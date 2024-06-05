import { toRaw, ref, watch } from "vue";
import { defineStore } from "pinia";
import { usePlanStore } from "./plan";
import Swal from "sweetalert2";

export const useMapStore = defineStore("googleMap", () => {
  const { VITE_GOOGLE_MAP_ID } = import.meta.env
  let map;
  const markers = ref([]);
  const planStore = usePlanStore();
  let polyline;
  const selectAttraction = ref({});
  var marker = null;
  const userAddressPosition = ref({});

  //지도 객체를 등록합니다.
  //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
  // await를 사용하지 않으면 Map is not a constructor 에러 발생
  async function initMap(elMap) {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(elMap, {
      center: { lat: 33.450701, lng: 126.570667 },
      zoom: 12,
      mapId: VITE_GOOGLE_MAP_ID,
    });
  }

  function changeSize(size) {
    const container = map;
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    toRaw(map).relayout();
  }

  async function displayMarker(attractions) {
    if (markers.value.length > 0) {
      clearMarker();
    }
    const positions = [];
    if (attractions.length > 0) {
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
      attractions.forEach((attraction) => {
        let position = { lat: Number(attraction.mapy), lng: Number(attraction.mapx) }
        console.log(position)
        positions.push(position);
        let marker = new AdvancedMarkerElement({
          map,
          position,
        });
        marker.addListener("click", function () {
          planStore.addPlan(attraction);
        });
        markers.value.push(marker);
      });
      bound(positions);
    }
  }

  function panTo(lat, lng, level) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new google.maps.LatLng(lat, lng);
    map.setZoom(level ? level : 15);

    console.log("pan to", moveLatLon);
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  }

  function addMarker(marker) {
    markers.value.push(marker);
  }

  function removeMarker() {
    markers.value.forEach((marker) => {
      marker.setMap(null);
    });
  }

  function clearMarker() {
    markers.value.forEach((marker) => marker.position = null);
    markers.value = [];
    console.log(markers.value.length);
  }

  // 주소에 대한 좌표값 가져오기
  function addressLocation(address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, async function (results, status) {
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
      if (status === 'OK') {
        if (marker) marker.setMap(null);
        userAddressPosition.value = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        marker = new AdvancedMarkerElement({
          map,
          position: userAddressPosition.value,
          gmpDraggable: true,
        });
        // 마커를 움직였을 때 움직인 마커의 좌표 갱신
        google.maps.event.addListener(marker, "dragend", function () {
          userAddressPosition.value = { lat: marker.position.lat, lng: marker.position.lng };
          console.log(userAddressPosition.value)
        });
        panTo(userAddressPosition.value.lat, userAddressPosition.value.lng, 15);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  async function addLine(userPlans) {
    removeMarker();
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    if (polyline) polyline.setMap(null);

    // 선을 구성하는 좌표 배열입니다
    let linePath = [];

    userPlans.forEach((userPlan) => {
      linePath.push({ lat: Number(userPlan.mapy), lng: Number(userPlan.mapx) });
    });

    linePath.forEach((position) => {
      const marker = new AdvancedMarkerElement({
        map,
        position,
      });
      markers.value.push(marker);
    });

    // 지도에 표시할 선을 생성합니다
    polyline = new google.maps.Polyline({
      // map: map,
      path: linePath, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: "red", // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일입니다
    });
    // 지도에 선을 표시합니다
    polyline.setMap(map);

    // 마커들의 위치를 기반으로 지도의 영역을 결정
    bound(linePath);
  }

  // 마커들의 위치를 기반으로 지도의 영역을 결정
  const bound = (positions) => {
    const bounds = positions.reduce(
      (bounds, latlng) => bounds.extend(latlng),
      new google.maps.LatLngBounds()
    );

    map.fitBounds(bounds);
  };

  return {
    map,
    initMap,
    displayMarker,
    panTo,
    changeSize,
    addMarker,
    clearMarker,
    addressLocation,
    addLine,
    userAddressPosition,
    selectAttraction,
    markers,
  };
});
