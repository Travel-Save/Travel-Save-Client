<script setup>
// import KakaoMap from "@/components/map/KakaoMap.vue";
import AppSearchBox from "@/components/layout/AppSearchBox.vue";
import AttractionItem from "@/components/attraction/item/AttractionItem.vue";
import AttractionDayForm from "@/components/plan/item/AttractionDayForm.vue";
import { onMounted, ref, watch } from "vue";
import { usePlanStore } from "@/stores/plan";
import BoardWrite from "../board/BoardWrite.vue";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  SoundTwoTone,
} from "@ant-design/icons-vue";
import { useAttractionFilterStore } from "@/stores/attractionFilter";
import { storeToRefs } from "pinia";
import GoogleMap from "@/components/map/GoogleMap.vue";


/** stores */
const attractionFilterStore = useAttractionFilterStore();
const { infinityScrollPageNo, contentTypeId } = storeToRefs(attractionFilterStore);
const planStore = usePlanStore();
const { changeWriteComponent, totalCount } = storeToRefs(planStore);
/** stores end */

/** props */
const props = defineProps({
  mode: String,
})
const { mode } = props;
/** props end */


const isHidePlan = ref(false);

const items = ref([
  {
    value: "",
    title: "전체",
  },
  {
    value: "12",
    title: "관광지",
  },
  {
    value: "14",
    title: "문화시설",
  },
  {
    value: "38",
    title: "쇼핑",
  },
  {
    value: "28",
    title: "레포츠",
  },
  {
    value: "32",
    title: "숙박",
  },
  {
    value: "39",
    title: "음식점",
  },
  {
    value: "-99",
    title: "북마크",
  },
  {
    value: "15",
    title: "축제/공연/행사",
  },
]);

onMounted(() => {
  planStore.attractionList = [];
  changeWriteComponent.value = false;

  $("#plan-toggle").on("click", function () {
    // $("#plan-toggle").
    isHidePlan.value = !isHidePlan.value;
    $("#planContainer").slideToggle();
  });
});

const openSearch = ref(true);
const showDrawerSearch = () => {
  openSearch.value = true;
};
const onCloseSearch = () => {
  openSearch.value = false;
};

/** 계획 작성하기 페이지 들어갔을 때 검색창 닫기 */
watch(changeWriteComponent, () => {
  if (changeWriteComponent) openSearch.value = false;
});

/** 페이지네이션 */
const current = ref(1);

watch(current, () => {
  planStore.attractionList = [];
  infinityScrollPageNo.value = current.value;
});
/** 페이지네이션 end */
</script>
<template>
  <div>
    <a-float-button @click="showDrawerSearch" id="search-toggle" v-show="!changeWriteComponent">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-magnifying-glass-location" />
      </template>
      <template #tooltip>
        <div>관광지 검색</div>
      </template>
    </a-float-button>
    <!-- 메인 컬럼 (80% 너비) -->
    <div>
      <!-- BoardWrite 컴포넌트: flag가 true일 때 보여짐 -->
      <BoardWrite v-show="changeWriteComponent" :mode="mode" :userPlans="planStore.userPlans" />
      <a-float-button @click="planStore.moveWrite()" id="back-toggle" v-show="changeWriteComponent">
        <template #icon>
          <font-awesome-icon :icon="['fas', 'left-long']" />
        </template>
        <template #tooltip>
          <div>뒤로 가기</div>
        </template>
      </a-float-button>
      <!-- 검색 및 지도 컨테이너: flag가 false일 때 보여짐 -->
      <div class="row" v-show="!changeWriteComponent">
        <!-- 현재 화면의 20% 너비-->
        <a-drawer title="관광지 검색" :open="openSearch" :width="380" placement="left" :mask="false"
          :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }" @close="onCloseSearch">
          <AppSearchBox mode="paging" />
          <a-radio-group v-model:value="contentTypeId" v-for="item in items" :key="item.value">
            <a-radio-button :value="item.value">{{ item.title }}</a-radio-button>
          </a-radio-group>
          <a-pagination v-if="totalCount !== 0" simple class="mt-3 w-100 text-center" v-model:current="current"
            :total="totalCount" :showSizeChanger="false" :defaultPageSize=12 />
          <AttractionItem v-for="attraction in planStore.attractionList" :attraction="attraction"
            :key="attraction.contentId" />
          <div>
          </div>
        </a-drawer>

        <!-- 현재 화면의 나머지 너비, 최소 너비 400px - Kakao Map-->
        <!-- <KakaoMap id="mapContainer" /> -->
        
        <!-- Google Map -->
        <GoogleMap id="map-container" style="width : 100%; height : 700px;"/>
        <div class="col">
          <a-float-button tooltip="SHOW PLAN" id="plan-toggle">
            <template #icon>
              <DownSquareOutlined v-show="isHidePlan" />
              <UpSquareOutlined v-show="!isHidePlan" />
            </template>
            <template #tooltip>
              <div v-show="isHidePlan">여행계획 펼치기</div>
              <div v-show="!isHidePlan">여행계획 접어두기</div>
            </template>
          </a-float-button>

          <div id="planContainer" class="text-center">
            <div class="text-center mt-3">
              <button type="button" class="btn btn-outline-primary mb-3 ms-1" @click="planStore.moveWrite()">
                계획 작성하기
              </button>
            </div>
            <h4 class="text-center mt-3">나의 여행 계획</h4>
            <AttractionDayForm :mode="mode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 100%;
  padding-right: 0;
  padding-left: 0;
  margin-right: auto;
  margin-left: auto;
  min-height: 100vh;
  /* 뷰포트의 100% 높이를 최소 높이로 설정 */
}

.search-form {
  flex-direction: column;
}

/* searchContainer 및 mapContainer에 대한 추가 스타일링 */
#map-container {
  position: relative;
  min-width: 400px;
  height: 86vh;
  margin-top: 50px;
}

#planContainer {
  width: 500px;
  position: absolute;
  top: 120px;
  right: 0;
  height: 86vh;
  z-index: 2;
  border-radius: 10px;
  background-color: white;
  opacity: 0.7;
  overflow: scroll;
}

.slide-in {
  display: block;
  transform: translateX(0);
  transition: transform 0.5s ease, display 0s 0.5s;
}

.slide-out {
  transform: translateX(-100%);
  transition: transform 0.5s ease, display 0s 0.5s;
}

.plan-slide-in {
  display: block;
  transform: translateY(0);
  transition: transform 0.5s ease, display 0s 0.5s;
}

.plan-slide-out {
  transform: translateY(100%);
  transition: transform 0.5s ease, display 0s 0.5s;
}

#plan-toggle {
  top: 70px;
  right: 10px;
}

#search-toggle {
  top: 70px;
  left: 0px;
}

#back-toggle {
  top: 70px;
  right: 10px;
}
</style>
