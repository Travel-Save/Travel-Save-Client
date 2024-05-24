import { toRaw, ref, watch } from "vue";
import { defineStore } from "pinia";
import { usePlanStore } from "./plan";
import Swal from "sweetalert2";

export const useKakaoMapStore = defineStore("kakaoMap", () => {
  const map = ref({});
  const markers = ref([]);
  const planStore = usePlanStore();
  const polyline = ref(null);
  const selectAttraction = ref({});
  function initMap(elMap) {
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 5,
    };

    //지도 객체를 등록합니다.
    //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
    map.value = new kakao.maps.Map(elMap, options);

    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    var mapTypeControl = new kakao.maps.MapTypeControl();
    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }

  function changeSize(size) {
    const container = map.value;
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    toRaw(map.value).relayout();
  }

  function displayMarker(attractions) {
    if (markers.value.length > 0) {
      markers.value.forEach((marker) => marker.setMap(null));
    }

    const positions = [];
    if (attractions.length > 0) { 
      clearMarker();
      attractions.forEach((attraction) => {
        let position = new kakao.maps.LatLng(attraction.mapy, attraction.mapx);
        positions.push(position);
        let marker = new kakao.maps.Marker({
          map: map.value,
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
    var moveLatLon = new kakao.maps.LatLng(lat, lng);

    map.value.setLevel(level ? level : 5);

    console.log("pan to", moveLatLon);
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.value.panTo(moveLatLon);
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
    markers.value = [];
  }

  var marker = null;
  const resultAddress = ref({});
  // 주소로 좌표를 검색합니다
  function addressLocation(address) {
    var geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        if (marker) marker.setMap(null);
        var markerPosition = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 검색 시 좌표를 주소로 변환
        positionToAddress(markerPosition, geocoder);

        // 마커를 생성합니다
        marker = new kakao.maps.Marker({
          map: toRaw(map.value),
          position: markerPosition,
          draggable: true, // 마커를 드래그 가능하게 설정합니다
        });

        // 마커의 dragend 이벤트 리스너를 추가합니다
        kakao.maps.event.addListener(marker, "dragend", function () {
          // 이동한 마커의 좌표값
          var latLng = marker.getPosition();

          // 좌표를 주소로 변환합니다
          positionToAddress(latLng, geocoder);
        });

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        panTo(result[0].y, result[0].x);
      } else {
        Swal.fire({
          icon: "error",
          title: "해당 주소를 찾지 못하였습니다.",
          text: "다시 입력해주세요 :)",
        });
      }
    });
  }

  const positionToAddress = (position, geocoder) => {
    geocoder.coord2Address(position.getLng(), position.getLat(), function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        resultAddress.value = {
          address: result[0].address.address_name,
          roadAddress: result[0].road_address.address_name,
        };
        console.log("드래그된 좌표의 주소:", resultAddress.value);
      } else {
        console.log("주소 변환에 실패했습니다.");
      }
    });
  };

  const getAddress = () => {
    return resultAddress.value;
  };

  function addLine(userPlans) {
    removeMarker();
    console.log(map.value);
    if (polyline.value) polyline.value.setMap(null);
    // 선을 구성하는 좌표 배열입니다
    let linePath = [];

    userPlans.forEach((userPlan) => {
      linePath.push(new kakao.maps.LatLng(userPlan.mapy, userPlan.mapx));
    });

    linePath.forEach((position) => {
      const marker = new kakao.maps.Marker({
        map: toRaw(map.value),
        position,
      });
      markers.value.push(marker);
    });

    // 지도에 표시할 선을 생성합니다
    polyline.value = new kakao.maps.Polyline({
      // map: map.value,
      path: linePath, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: "red", // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일입니다
    });

    console.log(polyline);
    // 지도에 선을 표시합니다
    polyline.value.setMap(map.value);

    // 마커들의 위치를 기반으로 지도의 영역을 결정
    bound(linePath);
  }

  // 마커들의 위치를 기반으로 지도의 영역을 결정
  const bound = (positions) => {
    const bounds = positions.reduce(
      (bounds, latlng) => bounds.extend(latlng),
      new kakao.maps.LatLngBounds()
    );

    toRaw(map.value).setBounds(bounds);
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
    getAddress,
    addLine,
    resultAddress,
    selectAttraction,
  };
});
