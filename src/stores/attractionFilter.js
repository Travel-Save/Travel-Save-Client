import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAttractionFilterStore = defineStore("attractionFilter", () => {
  const { VITE_OPEN_API_SERVICE_KEY } = import.meta.env;

  //관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
  // const contentTypeId = [12, 14, 15, 25, 28, 32, 38, 39];
  const infinityScrollPageNo = ref(1);

  let defaultConfig = {
    numOfRows: "10",
    pageNo: "1",
    MobileOS: "ETC",
    MobileApp: "test",
    _type: "json",
    serviceKey: VITE_OPEN_API_SERVICE_KEY,
  };

  const config = ref({
    condition: {},
  });
  const contentTypeId = ref("");
  const areaCode = ref("1");
  const sigunguCode = ref("");

  const setLocationConfig = (mapX, mapY, radius) => {
    console.log(config.value);
    config.value.link = "/locationBasedList1";
    config.value.condition = {
      ...defaultConfig,
      arrange: "O",
      mapX: encodeURIComponent(mapX ? mapX : 127.036431) /*GPS X좌표(WGS84 경도좌표)*/,
      mapY: encodeURIComponent(mapY ? mapY : 37.500613) /*GPS Y좌표(WGS84 위도좌표)*/,
      radius: encodeURIComponent(radius ? radius : "1000") /*거리반경(단위:m) , Max값 20000m=20Km*/,
      contentTypeId: contentTypeId ? contentTypeId : "",
    };
  };

  const setAreaBasedConfig = (etcConfig) => {
    config.value.link = "/areaBasedList1";
    config.value.condition = {
      ...defaultConfig,
      ...etcConfig,
      arrange: "O",
      areaCode,
      sigunguCode,
      contentTypeId: contentTypeId.value ? contentTypeId.value : "",
    };
  };

  const setKeywordConfig = (keyword, etcConfig) => {
    config.value.link = "/searchKeyword1";
    config.value.condition = {
      ...defaultConfig,
      ...etcConfig,
      arrange: "O",
      keyword,
      areaCode,
      sigunguCode,
      contentTypeId: contentTypeId.value ? contentTypeId.value : "",
    };
  };

  const setSidoConfig = () => {
    config.value.link = "/areaCode1";
    config.value.condition = {
      ...defaultConfig,
      numOfRows: 1000,
      areaCode,
    };
  };

  const setDetailIntroConfig = (contentId, contentTypeId) => {
    config.value.link = "/detailIntro1";
    config.value.condition = {
      ...defaultConfig,
      contentId,
      contentTypeId,
    };
  };

  const setDetailCommonConfig = (contentId) => {
    config.value.link = "/detailCommon1";
    config.value.condition = {
      ...defaultConfig,
      contentId,
      defaultYN: "Y",
      firstImageYN: "Y",
      areacodeYN: "N",
      catcodeYN: "N",
      addrinfoYN: "Y",
      mapinfoYN: "Y",
      overviewYN: "Y",
    };
  };

  const setDetailInfoConfig = (contentId, contentTypeId) => {
    config.value.link = "/detailInfo1";
    config.value.condition = {
      ...defaultConfig,
      contentId,
      contentTypeId,
    };
  };

  const setDetailImageConfig = (contentId) => {
    config.value.link = "/detailImage1";
    config.value.condition = {
      ...defaultConfig,
      contentId,
      numOfRows: 1000,
      imageYN: "Y",
      subImageYN: "Y",
    };
  };

  //무장애여행조회
  const setDetailWithConfig = (contentId, etcConfig) => {
    config.value.link = "/detailWithTour1";
    config.value.condition = {
      ...defaultConfig,
      ...etcConfig,
      contentId,
    };
  };
  const getCondition = () => {
    return config.value;
  };
  const plusInfinityScrollPageNo = () => {
    infinityScrollPageNo.value = infinityScrollPageNo.value + 1;
  };
  return {
    getCondition,
    setLocationConfig,
    setKeywordConfig,
    setSidoConfig,
    setDetailCommonConfig,
    setDetailIntroConfig,
    setDetailInfoConfig,
    setDetailImageConfig,
    setDetailWithConfig,
    setAreaBasedConfig,
    plusInfinityScrollPageNo,
    infinityScrollPageNo,
    contentTypeId,
    areaCode,
    sigunguCode,
  };
});
