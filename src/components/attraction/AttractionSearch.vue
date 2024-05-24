<script setup>
import { getAttractionList } from "@/api/attraction";
import { useAttractionFilterStore } from "@/stores/attractionFilter";
import { usePlanStore } from "@/stores/plan";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const planStore = usePlanStore();
const attractionFilterStore = useAttractionFilterStore();
const { setAttractions } = planStore;
const { setAreaBasedConfig, getCondition } = attractionFilterStore;
const { contentTypeId } = storeToRefs(attractionFilterStore);

onMounted(() => {
  planStore.attractionList = [];
});

const configList = ref([
  {
    text: "관광지",
    icon: ["fa-solid", "landmark"],
    click: () => {
      contentTypeId.value = "12";
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "문화시설",
    icon: ["fa-solid", "fa-book"],
    click: () => {
      contentTypeId.value = "14"
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "쇼핑",
    icon: ["fa-solid", "fa-cart-shopping"],
    click: () => {
      contentTypeId.value = "38"
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "레포츠",
    icon: ["fa-solid", "fa-person-swimming"],
    click: () => {
      contentTypeId.value = "28"
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "숙박",
    icon: ["fa-solid", "fa-bed"],
    click: () => {
      contentTypeId.value = "32"
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "음식점",
    icon: ["fa-solid", "fa-utensils"],
    click: () => {
      contentTypeId.value = "39"
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "축제/공연/행사",
    icon: ["fa-solid", "fa-calendar"],
    click: () => {
      contentTypeId.value = "15"
      setAreaBasedConfig({ numOfRows: 12 });
      getAttractionList(getCondition(), setAttractions, console.log);
      router.push({ name: "search" });
    },
  },
  {
    text: "여행계획 세우기",
    icon: ["fa-solid", "plane-departure"],
    click: () => {
      router.push({ name: "plan-write", params: { type: "P" } });
    },
  },
  {
    text: "핫플레이스",
    icon: ["fas", "fire"],
    click: () => {
      router.push({ name: "article-list", params: { type: "H" } });
    },
  },
  {
    text: "여행계획 게시판",
    icon: ["fas", "map-location-dot"],
    click: () => {
      router.push({ name: "article-list", params: { type: "P" } });
    },
  },
  {
    text: "좋아요 목록",
    icon: ["fas", "heart"],
    click: () => {
      router.push({ name: "article-list", params: { type: "F" } });
    }
  },
  {
    text: "게시판",
    icon: ["fas", "list"],
    click: () => {
      router.push({ name: "article-list", params: { type: "C" } });
    }
  },
]);
</script>

<template>
  <div>
    <ul class="menu">
      <li class="menuBtn" v-for="(config, index) in configList" :key="index" :config="config" @click="config.click">
        <div class="icon"><font-awesome-icon :icon="config.icon" size="2x" /></div>
        <div class="text">{{ config.text }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex-wrap: wrap;
}

.menuBtn {
  list-style: none;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  padding: 10px;
  transition: background-color 0.3s ease;
  /* 부드러운 색상 전환 효과 */
}

.menuBtn:hover {
  background-color: #f0f0f0;
  /* 마우스 오버 시 색상 변경 */
}

.menuBtn span {
  margin-top: 5px;
  /* 아이콘과 텍스트 사이 간격 */
}

@media (max-width: 768px) {
  .menuBtn {
    width: 50%;
    /* 화면이 768px 이하일 때 2열로 표시 */
  }
}

@media (max-width: 480px) {
  .menuBtn {
    width: 100%;
    /* 화면이 480px 이하일 때 1열로 표시 */
  }
}
</style>
