<script setup>
import { usePlanStore } from "@/stores/plan";
import AttractionItem from "./item/AttractionItem.vue";
import "swiper/css";
import { ref } from "vue";

const planStore = usePlanStore();

const slidesPerView = ref(5); // 기본 값
const breakpoints = ref({
  // 반응형 설정
  1600: {
    slidesPerView: 5,
  },
  1200: {
    slidesPerView: 4,
  },
  992: {
    slidesPerView: 3,
  },
  768: {
    slidesPerView: 2,
  },
  576: {
    slidesPerView: 1,
  },
  0: {
    slidesPerView: 1,
  },
});

const mySwiper = ref(null);
const onUserInteractionEnds = () => {
  // 사용자 상호작용이 끝나면 자동 재생을 다시 시작
  if (mySwiper.value) {
    mySwiper.value.autoplay.start();
  }
};
</script>

<template>
  <swiper-container :ref="mySwiper" :slides-per-view="slidesPerView" :space-between="30" :loop="true" :autoplay="{
    delay: 2000,
    disableOnInteraction: false,
  }" :navigation="true" :breakpoints="breakpoints" @touchEnd="onUserInteractionEnds">
    <swiper-slide v-for="attraction in planStore.attractionList" :key="attraction.contentId">
      <AttractionItem :attraction="attraction" />
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
/* 필요한 스타일 추가 */
</style>
