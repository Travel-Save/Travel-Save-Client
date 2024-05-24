<script setup>
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const boardConfigs = [
  {
    title: "자유게시판",
    subTitle: "",
    type: "C",
  },
  {
    title: "여행계획게시판",
    subTitle: "",
    type: "P",
  },
  {
    title: "핫플레이스",
    subTitle:"",
    type : "H",
  },
  {
    title: "좋아요",
    subTitle:"",
    type : "F",
  }
]
const boardConfig = ref({
  title:"",
  subTitle:"",
});

onMounted(() =>{
  boardConfig.value = boardConfigs.filter((config) => config.type == route.params.type)[0];
});

onBeforeRouteUpdate((to, from) => {
  boardConfig.value = boardConfigs.filter((config) => config.type == to.params.type)[0];
});

</script>

<template>
  <div class="container text-center mt-3">
    <div class="mb-2">
      <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="boardConfig.title"
        :sub-title="boardConfig.subTitle" />
    </div>
    
    <router-view></router-view>
  </div>
</template>

<style>

</style>
