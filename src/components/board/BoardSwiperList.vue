<script setup>
import BoardCardItem from "@/components/board/item/BoardCardItem.vue";
import { listArticle, listFavorite } from "@/api/board.js";
import { ref, onMounted } from 'vue'
import "swiper/css";

const articles = ref([]);
const getArticleList = () => {
  console.log("서버에서 글목록 얻어오자!!!");
  // listArticle(
  //   { type: "H" },
  //   ({ data }) => {
  //     articles.value = data.articles;
  //   },
  //   (error) => {
  //     console.log(error);
  //   }
  // );

  
  listFavorite(
    { pgno: 1, spp: 2, type: "P" },
    ({ data }) => {
      articles.value.push(...data.articles);
    },
    (error) => {
      console.log(error);
    }
  );

  listFavorite(
    { pgno: 1, spp: 2, type: "H" },
    ({ data }) => {
      articles.value.push(...data.articles);
    },
    (error) => {
      console.log(error);
    }
  );

  listFavorite(
    { pgno: 1, spp: 2, type: "C" },
    ({ data }) => {
      articles.value.push(...data.articles);
    },
    (error) => {
      console.log(error);
    }
  );
};
onMounted(() => {
  getArticleList();
})

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
    <swiper-slide v-for="article in articles" :key="article.id" class="card-item">
      <BoardCardItem :article="article" />
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
/* 필요한 스타일 추가 */
.card-item {
  text-align: center;
}
</style>
