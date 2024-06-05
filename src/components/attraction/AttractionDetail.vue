<script setup>
// import KakaoMap from "@/components/map/KakaoMap.vue";
import AttractionCultureItem from "./item/AttractionCultureItem.vue";
import AttractionFestivalItem from "./item/AttractionFestivalItem.vue";
import AttractionLeisureSportsItem from "./item/AttractionLeisureSportsItem.vue";
import AttractionLodgmentItem from "./item/AttractionLodgmentItem.vue";
import AttractionRestaurantItem from "./item/AttractionRestaurantItem.vue";
import AttractionShoppingItem from "./item/AttractionShoppingItem.vue";
import AttractionTourismItem from "./item/AttractionTourismItem.vue";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { getAttractionDetail, getAttractionWith } from "@/api/attraction";
import { useAttractionFilterStore } from "@/stores/attractionFilter";
import { useMapStore } from "@/stores/map";
import { findObject } from "@/api/common";
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import VBookmarkButton from "../common/VBookmarkButton.vue";
import { map } from "lodash";
import GoogleMap from "../map/GoogleMap.vue";

const route = useRoute();

const mapStore = useMapStore();
const { panTo, displayMarker } = mapStore;
const attractionFilterStore = useAttractionFilterStore();
const { getCondition, setDetailIntroConfig, setDetailCommonConfig, setDetailImageConfig, setDetailWithConfig } = attractionFilterStore;

const swiperModules = ref([Navigation, Pagination, Thumbs]);

const attractionBookmark = ref({});
const attractionDetail = ref({});
const attractionInfo = ref({});
const attractionImages = ref({});
const attractionWith = ref({});
onMounted(async () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 부드러운 스크롤
  });

  //공통 정보 조회
  setDetailCommonConfig(route.params.contentid);
  await getAttractionDetail(
    getCondition(),
    ({ data }) => {
      // data.response.body.items.item[0]
      attractionDetail.value = { ...findObject(data, "0"), ...attractionDetail.value };
    },
    console.log
  );

  // 지도 위치 이동
  // const position = [];
  // position.push([attractionDetail.value.mapy, attractionDetail.value.mapx]);
  displayMarker([attractionDetail.value]);
  panTo(attractionDetail.value.mapy, attractionDetail.value.mapx, attractionDetail.value.mlevel);

  //소개 정보 조회
  setDetailIntroConfig(route.params.contentid, route.params.contenttypeid);
  await getAttractionDetail(
    getCondition(),
    ({ data }) => {
      console.log(data);
      attractionInfo.value = { ...findObject(data, "0"), ...attractionDetail.value };
    },
    console.log
  );

  //이미지 정보 조회
  setDetailImageConfig(route.params.contentid);
  getAttractionDetail(
    getCondition(),
    ({ data }) => {
      attractionImages.value = findObject(data, "item");
    },
    console.log
  );

  //무장애 정보 조회
  setDetailWithConfig(route.params.contentid);
  getAttractionWith(
    getCondition(),
    ({ data }) => {
      console.log(data);
      if (data) attractionWith.value = findObject(data, "0");
    }
  )

  attractionBookmark.value = {
    ...attractionDetail.value, homepage: "", overview: ""
  };
});

const mapMounted = () => {
  // console.log("map mounted");
}

const thumbsSwiper = ref();
const slidesPerViewCnt = ref(0);
watch(
  () => attractionImages.value,
  () => {
    slidesPerViewCnt.value = 0;
    if (attractionImages.value) slidesPerViewCnt.value = Object.keys(attractionImages.value).length;
  },
  { immediate: true, deep: true }
);
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};


const disabledItems = ['parking', 'route', 'publictransport', 'ticketoffice', 'promotion', 'wheelchair', 'exit', 'elevator', 'restroom', 'auditorium', 'room', 'handicapetc'];
const visualItems = ['braileblock', 'helpdog', 'guidehuman', 'audioguide', 'bigprint', 'brailepromotion', 'guidesystem', 'blindhandicapetc'];
const hearingItems = ['signguide', 'videoguide', 'hearingroom', 'hearinghandicapetc'];
const familyItems = ['stroller', 'lactationroom', 'babysparechair', 'infantsfamilyetc'];
const hasItems = (items) => {
  return items.some(item => attractionWith.value?.[item]);
}
</script>

<template>
  <div class="container">
    <h1 style="text-align: center;">{{ attractionDetail.title }}
      <VBookmarkButton class="like-button" :attraction="attractionBookmark" />
    </h1>
    <div class="swiper-container" v-if="slidesPerViewCnt > 0">
      <!-- 메인 이미지 슬라이더 -->
      <swiper-container :style="{
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#fff',
      }" :loop="true" :spaceBetween="10" :navigation="true" :thumbs="{ swiper: thumbsSwiper }" :modules="swiperModules"
        class="mySwiper2">
        <swiper-slide v-for="(image, index) in attractionImages" :key="index">
          <img :src="image.originimgurl" alt="">
        </swiper-slide>
      </swiper-container>

      <!-- 썸네일 슬라이더 -->
      <swiper-container v-show="slidesPerViewCnt > 1" @swiper="setThumbsSwiper" :loop="true" :spaceBetween="10"
        :slidesPerView="slidesPerViewCnt" :freeMode="true" :watchSlidesProgress="true" :modules="swiperModules"
        class="mySwiper">
        <swiper-slide v-for="(image, index) in attractionImages" :key="index">
          <img :src="image.originimgurl" alt="">
          <!-- <img :src="image.smallimageurl" alt=""> -->
        </swiper-slide>
      </swiper-container>
    </div>
    <div v-else-if="slidesPerViewCnt === 0" style="text-align: center;">
      <img :src="attractionDetail.firstimage" alt="" style="max-height: 600px;">
    </div>
    <div class="container mt-5">
      <div class="basic-info">
        <h2>기본정보</h2>
        <p v-if="attractionDetail.overview" v-html="attractionDetail.overview">
        </p>
        <div>
          <p v-if="attractionDetail.addr1"><strong>주소 : </strong><span v-html="attractionDetail.addr1"></span> <span
              v-html="attractionDetail.addr2"></span>
          </p>
          <p v-if="attractionDetail.tel"><strong>전화 : </strong>{{ attractionDetail.telname }} ({{ attractionDetail.tel
            }})</p>
          <p v-if="attractionDetail.homepage"><strong>홈페이지 : </strong><span v-html="attractionDetail.homepage"></span>
          </p>
          <p v-if="attractionDetail.playtime"><strong>운영시간 : </strong>{{ attractionDetail.playtime }}</p>
          <p v-if="attractionDetail.infocenter"><strong>운영안내 : </strong>{{ attractionDetail.infocenter }}</p>
        </div>
        <br>
        <div class="accordion mt-4" id="accordionExample2">
          <div class="accordion-item">
            <h3 class="accordion-header" id="headingOne2">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne2"
                aria-expanded="true" aria-controls="collapseOne2">
                상세정보
              </button>
            </h3>
            <div id="collapseOne2" class="accordion-collapse collapse show" aria-labelledby="headingOne2"
              data-bs-parent="#accordionExample2">
              <div class="info-container">
                <div class="info-item">
                  <AttractionCultureItem class="accordion-body" v-if="route.params.contenttypeid === '14'"
                    :attraction="attractionInfo" />
                  <AttractionFestivalItem class="accordion-body" v-if="route.params.contenttypeid === '15'"
                    :attraction="attractionInfo" />
                  <AttractionLeisureSportsItem class="accordion-body" v-if="route.params.contenttypeid === '28'"
                    :attraction="attractionInfo" />
                  <AttractionLodgmentItem class="accordion-body" v-if="route.params.contenttypeid === '32'"
                    :attraction="attractionInfo" />
                  <AttractionRestaurantItem class="accordion-body" v-if="route.params.contenttypeid === '39'"
                    :attraction="attractionInfo" />
                  <AttractionShoppingItem class="accordion-body" v-if="route.params.contenttypeid === '38'"
                    :attraction="attractionInfo" />
                  <AttractionTourismItem class="accordion-body" v-if="route.params.contenttypeid === '12'"
                    :attraction="attractionInfo" />
                </div>
                <GoogleMap id="mapContainer" @map-mounted="mapMounted" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="accessibility-info mt-4"
        v-if="hasItems([...disabledItems, ...visualItems, ...hearingItems, ...familyItems])">
        <h2>무장애 편의정보</h2>

        <div class="accordion" id="accordionExample">
          <!-- 지체장애 -->
          <div v-if="hasItems(disabledItems)" class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                aria-expanded="true" aria-controls="collapseOne">
                지체장애
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ul>
                  <li v-if="attractionWith.parking">주차시설: <span v-html="attractionWith.parking"></span></li>
                  <li v-if="attractionWith.route">대중교통: <span v-html="attractionWith.route"></span></li>
                  <li v-if="attractionWith.publictransport">접근로: <span v-html="attractionWith.publictransport"></span>
                  </li>
                  <li v-if="attractionWith.ticketoffice">매표소: <span v-html="attractionWith.ticketoffice"></span></li>
                  <li v-if="attractionWith.promotion">홍보물: <span v-html="attractionWith.promotion"></span></li>
                  <li v-if="attractionWith.wheelchair">휠체어: <span v-html="attractionWith.wheelchair"></span></li>
                  <li v-if="attractionWith.exit">출입통로: <span v-html="attractionWith.exit"></span></li>
                  <li v-if="attractionWith.elevator">엘리베이터: <span v-html="attractionWith.elevator"></span></li>
                  <li v-if="attractionWith.restroom">화장실: <span v-html="attractionWith.restroom"></span></li>
                  <li v-if="attractionWith.auditorium">관람석: <span v-html="attractionWith.auditorium"></span></li>
                  <li v-if="attractionWith.room">객실: <span v-html="attractionWith.room"></span></li>
                  <li v-if="attractionWith.handicapetc">기타 상세: <span v-html="attractionWith.handicapetc"></span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 시각장애 -->
          <div v-if="hasItems(visualItems)" class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                시각장애
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ul>
                  <li v-if="attractionWith.braileblock">점자블록: <span v-html="attractionWith.braileblock"></span></li>
                  <li v-if="attractionWith.helpdog">보조견동반: <span v-html="attractionWith.helpdog"></span></li>
                  <li v-if="attractionWith.guidehuman">안내요원: <span v-html="attractionWith.guidehuman"></span></li>
                  <li v-if="attractionWith.audioguide">오디오가이드: <span v-html="attractionWith.audioguide"></span></li>
                  <li v-if="attractionWith.bigprint">큰활자 홍보물: <span v-html="attractionWith.bigprint"></span></li>
                  <li v-if="attractionWith.brailepromotion">점자표지: <span v-html="attractionWith.brailepromotion"></span>
                  </li>
                  <li v-if="attractionWith.guidesystem">유도안내설비: <span v-html="attractionWith.guidesystem"></span></li>
                  <li v-if="attractionWith.blindhandicapetc">기타상세: <span
                      v-html="attractionWith.blindhandicapetc"></span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 청각장애 -->
          <div v-if="hasItems(hearingItems)" class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                청각장애
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ul>
                  <li v-if="attractionWith.signguide">수화안내: <span v-html="attractionWith.signguide"></span></li>
                  <li v-if="attractionWith.videoguide">영상자막안내: <span v-html="attractionWith.videoguide"></span></li>
                  <li v-if="attractionWith.hearingroom">객실: <span v-html="attractionWith.hearingroom"></span></li>
                  <li v-if="attractionWith.hearinghandicapetc">기타상세: <span
                      v-html="attractionWith.hearinghandicapetc"></span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 영유아가족 -->
          <div v-if="hasItems(familyItems)" class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                영유아가족
              </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ul>
                  <li v-if="attractionWith.stroller">유모차: <span v-html="attractionWith.stroller"></span></li>
                  <li v-if="attractionWith.lactationroom">수유실: <span v-html="attractionWith.lactationroom"></span></li>
                  <li v-if="attractionWith.babysparechair">유아용보조의자: <span v-html="attractionWith.babysparechair"></span>
                  </li>
                  <li v-if="attractionWith.infantsfamilyetc">기타상세: <span
                      v-html="attractionWith.infantsfamilyetc"></span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 고령자 -->
          <!-- <div class="accordion-item">
            <h2 class="accordion-header" id="headingFive">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                고령자
              </button>
            </h2>
            <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive"
              data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ul>
                  <li>대여 가능: 대여 가능 (6대/전동차 미지원)</li>
                </ul>
              </div>
            </div>
          </div> -->

        </div>
      </div>
    </div>




  </div>
</template>

<style scoped>
/** 소개 start */
.basic-info h2,
.accessibility-info h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
}

.basic-info p,
.accordion-body {
  font-size: 1em;
}

.accordion-button {
  font-size: 1.2em;
}

span>a {
  text-decoration: none;
}

/** 소개 end */

/** 상세소개 start */
.info-container {
  display: flex;
}

.info-item {
  flex: 2;
}

#mapContainer {
  width: 400px;
  height: 400px;
  margin: 0 auto;
  flex: 1;
}

/** 상세소개 end */

/* swiper start */
.swiper-container {
  width: 700px;
  margin: 0 auto;
}

.swiper {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  object-fit: cover;
}

.mySwiper2 {
  height: 80%;
  width: 100%;
}

.mySwiper2 img {
  display: block;
  width: 100%;
  height: 466px;
  object-fit: cover;
}

.mySwiper {
  height: 20%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0;
}

.mySwiper img {
  display: block;
  width: 100%;
  height: 50px;
  object-fit: cover;
}

.mySwiper .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

/* swiper end */

.like-button {
  display: inline-block;
  background: #F7DFF5;
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 0.75rem;
  border-radius: 50px;
  font-weight: 600;
}
</style>
