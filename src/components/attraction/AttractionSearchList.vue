<script setup>
import { usePlanStore } from "@/stores/plan";
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import AttractionItem from "./item/AttractionItem.vue";
import { useAttractionFilterStore } from "@/stores/attractionFilter";
import { storeToRefs } from "pinia";
import { throttle } from 'lodash';

const planStore = usePlanStore();
const attractionFilterStore = useAttractionFilterStore();
const { infinityScrollPageNo, contentTypeId } = storeToRefs(attractionFilterStore);
const { plusInfinityScrollPageNo } = attractionFilterStore;

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
    value: "15",
    title: "축제/공연/행사",
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
    value: "38",
    title: "쇼핑",
  },
  {
    value: "39",
    title: "음식점",
  },
]);

const bottomObserver = ref(null);
let observer = null;

// throttle을 적용하여 함수가 너무 자주 호출되는 것을 방지
const throttledPlusInfinityScrollPageNo = throttle(() => {
  plusInfinityScrollPageNo();
}, 2000); // 1000ms 동안 최대 1회 호출

const setupObserver = () => {
  if (observer) observer.disconnect(); // 기존 Observer 연결 해제

  if (planStore.attractionList.length > 10 && document.body.scrollHeight > window.innerHeight) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          throttledPlusInfinityScrollPageNo();
        }
      },
      {
        rootMargin: '30px',
        threshold: 1
      }
    );
    if (bottomObserver.value) observer.observe(bottomObserver.value);
  }
};

onMounted(() => {
  setupObserver();
  window.addEventListener('resize', setupObserver);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener('resize', setupObserver);
});

watch([contentTypeId, infinityScrollPageNo, () => planStore.attractionList.length], () => {
  nextTick(() => {
    setupObserver(); // 필터 변경, 페이지 변경, 또는 데이터 유무 변경 시 Observer 재설정
  });
}, { deep: true });
</script>

<template>
  <div class="text-center">
    <a-radio-group v-model:value="contentTypeId" v-for="item in items" :key="item.value">
      <a-radio-button :value="item.value">{{ item.title }}</a-radio-button>
    </a-radio-group>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="attraction in planStore.attractionList"
        :key="attraction.contentId">
        <AttractionItem :attraction="attraction" class="attraction-item" />
      </div>
    </div>
  </div>
  <div ref="bottomObserver"></div>
</template>


<style scoped>
.container {
  margin-top: 20px;
  /* 컨테이너 상단 여백 추가 */
}

.text-center {
  margin-bottom: 20px;
  /* 라디오 버튼 그룹 하단 여백 추가 */
}

.attraction-item {
  margin-bottom: 20px;
  /* 각 관광지 아이템 하단 여백 추가 */
}

body.freeze-scroll {
  overflow: hidden; /* 스크롤을 일시적으로 비활성화 */
}

</style>
