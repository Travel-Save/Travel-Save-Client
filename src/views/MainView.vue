<script setup>
import AttractionSearch from "@/components/attraction/AttractionSearch.vue";
import AttractionList from "@/components/attraction/AttractionList.vue";
import BoardSwiperList from "@/components/board/BoardSwiperList.vue";
import { onMounted, ref } from "vue";
import { usePlanStore } from "@/stores/plan";
import { listAttractionFavorite } from "@/api/attraction";

const planStroe = usePlanStore();
const { setAttractions } = planStroe;

onMounted(() => {
  listAttractionFavorite(
    { pgno: 1, spp: 6, sort: 'likeCount' },
    ({ data }) => {
      setAttractions({ item: data.attractions });
    },
    (error) => {
      console.log(error);
    }
  );
});
</script>

<template>
  <div>
    <AttractionSearch />
    <AttractionList class="mb-2" />
    <BoardSwiperList />
  </div>
</template>

<style scoped></style>
