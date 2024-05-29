import { toRaw, ref, watch } from "vue";
import { defineStore } from "pinia";
import { usePlanStore } from "./plan";
import Swal from "sweetalert2";

export const useMapStore = defineStore("googleMap", () => {
  const map = ref({});
  const markers = ref([]);
  const planStore = usePlanStore();
  const polyline = ref(null);
  const selectAttraction = ref({});
  var marker = null;
  const resultAddress = ref({});
  const geocoder = new google.maps.Geocoder();

  function initMap(elMap) {
    const options = {
      center: { lat: 33.450701, lng: 126.570667 },
      zoom: 12,
    };

    //지도 객체를 등록합니다.
    //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
    map.value = new google.maps.Map(elMap, options);
  }

  function changeSize(size) {
    const container = map.value;
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    toRaw(map.value).relayout();
  }

  function displayMarker(attractions) {
    if (markers.value.length > 0) {
      clearMarker();
    }
    const positions = [];
    if (attractions.length > 0) {
      attractions.forEach((attraction) => {
        let position = new google.maps.LatLng(attraction.mapy, attraction.mapx);
        positions.push(position);
        let marker = new google.maps.Marker({
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
    var moveLatLon = new google.maps.LatLng(lat, lng);
    map.value.setZoom(level ? level : 15);

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
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];
  }

  function addressLocation(address) {
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === 'OK') {
        if (marker) marker.setMap(null);
        const markerPosition = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        positionToAddress(markerPosition);

        marker = new google.maps.Marker({
          map: map.value,
          position: markerPosition,
          draggable: true
        });

        google.maps.event.addListener(marker, "dragend", function () {
          const latLng = marker.getPosition();
          positionToAddress(latLng);
        });
        console.log(markerPosition)
        panTo(markerPosition.lat(), markerPosition.lng(), 15);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  function positionToAddress(position) {
    geocoder.geocode({ 'location': position }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          const resultAddress = {
            address: results[0].formatted_address,
            roadAddress: results[0].formatted_address // Google Maps API does not differentiate road address
          };
          console.log("Converted coordinates to address:", resultAddress);
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  }
  // // 주소로 좌표를 검색합니다
  // function addressLocation(address) {
  //   var geocoder = new google.maps.services.Geocoder();
  //   geocoder.addressSearch(address, function (result, status) {
  //     // 정상적으로 검색이 완료됐으면
  //     if (status === google.maps.services.Status.OK) {
  //       if (marker) marker.setMap(null);
  //       var markerPosition = new google.maps.LatLng(result[0].y, result[0].x);
  //       // 검색 시 좌표를 주소로 변환
  //       positionToAddress(markerPosition, geocoder);

  //       // 마커를 생성합니다
  //       marker = new google.maps.Marker({
  //         map: toRaw(map.value),
  //         position: markerPosition,
  //         draggable: true, // 마커를 드래그 가능하게 설정합니다
  //       });

  //       // 마커의 dragend 이벤트 리스너를 추가합니다
  //       google.maps.event.addListener(marker, "dragend", function () {
  //         // 이동한 마커의 좌표값
  //         var latLng = marker.getPosition();

  //         // 좌표를 주소로 변환합니다
  //         positionToAddress(latLng, geocoder);
  //       });

  //       // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
  //       panTo(result[0].y, result[0].x);
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "해당 주소를 찾지 못하였습니다.",
  //         text: "다시 입력해주세요 :)",
  //       });
  //     }
  //   });
  // }

  // const positionToAddress = (position, geocoder) => {
  //   geocoder.coord2Address(position.getLng(), position.getLat(), function (result, status) {
  //     if (status === google.maps.services.Status.OK) {
  //       resultAddress.value = {
  //         address: result[0].address.address_name,
  //         roadAddress: result[0].road_address.address_name,
  //       };
  //       console.log("드래그된 좌표의 주소:", resultAddress.value);
  //     } else {
  //       console.log("주소 변환에 실패했습니다.");
  //     }
  //   });
  // };

  const getAddress = () => {
    return resultAddress.value;
  };

  function addLine(userPlans) {
    removeMarker();
    // console.log(map.value);
    if (polyline.value) polyline.value.setMap(null);
    // 선을 구성하는 좌표 배열입니다
    let linePath = [];

    userPlans.forEach((userPlan) => {
      linePath.push(new google.maps.LatLng(userPlan.mapy, userPlan.mapx));
    });

    linePath.forEach((position) => {
      const marker = new google.maps.Marker({
        map: toRaw(map.value),
        position,
      });
      markers.value.push(marker);
    });

    // 지도에 표시할 선을 생성합니다
    polyline.value = new google.maps.Polyline({
      // map: map.value,
      path: linePath, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: "red", // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일입니다
    });

    // console.log(polyline);
    // 지도에 선을 표시합니다
    polyline.value.setMap(map.value);

    // 마커들의 위치를 기반으로 지도의 영역을 결정
    bound(linePath);
  }

  // 마커들의 위치를 기반으로 지도의 영역을 결정
  const bound = (positions) => {
    const bounds = positions.reduce(
      (bounds, latlng) => bounds.extend(latlng),
      new google.maps.LatLngBounds()
    );

    map.value.fitBounds(bounds);
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
    markers,
  };
});
