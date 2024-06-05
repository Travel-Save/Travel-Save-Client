<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useMapStore } from "@/stores/map";
import VBookmarkButton from "@/components/common/VBookmarkButton.vue";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  attraction: Object,
});

const loadingImg = ref("");
const mapStore = useMapStore();


const configList = [
  {
    text: "관광지",
    icon: ["fa-solid", "landmark"],
    contenttypeid: "12",
    color: "#FFB6C1", // 파스텔 핑크
  },
  {
    text: "문화시설",
    icon: ["fa-solid", "fa-book"],
    contenttypeid: "14",
    color: "#87CEEB", // 파스텔 블루
  },
  {
    text: "축제/공연/행사",
    icon: ["fa-solid", "fa-calendar"],
    contenttypeid: "15",
    color: "#FFD700", // 파스텔 옐로우
  },
  {
    text: "레포츠",
    icon: ["fa-solid", "fa-person-swimming"],
    contenttypeid: "28",
    color: "#98FB98", // 파스텔 그린
  },
  {
    text: "숙박",
    icon: ["fa-solid", "fa-bed"],
    contenttypeid: "32",
    color: "#FFA07A", // 파스텔 오렌지
  },
  {
    text: "쇼핑",
    icon: ["fa-solid", "fa-cart-shopping"],
    contenttypeid: "38",
    color: "#FFE4E1", // 파스텔 로즈
  },
  {
    text: "음식점",
    icon: ["fa-solid", "fa-utensils"],
    contenttypeid: "39",
    color: "#ADD8E6", // 파스텔 블루
  },
];


const moveDetail = () => {
  router.push({ name: "search-detail", params: { contentid: props.attraction.contentid, contenttypeid: props.attraction.contenttypeid } });
};

const matchedConfig = computed(
  () => {
    return configList.find(item => item.contenttypeid === props.attraction.contenttypeid);
  });

// 요청 인터셉터
// axios.interceptors.request.use(
//   function (config) {
//     loadingImg.value = "loading.png";
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터
// axios.interceptors.response.use(
//   function (response) {
//     loadingImg.value = "";
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );
</script>

<template>
  <div class="container-fluid">
    <div class="row" v-if="loadingImg !== ''">
      <img src="@/assets/loading2.gif" />
    </div>
    <div class="row" v-else>
      <div class="card-item w-100" style="width: 18rem" @click="moveDetail">
        <img v-if="route.path.includes('plan')" :src="attraction.firstimage" class="card-img-top" alt="..."
          style="object-fit: cover; height: 200px"
          @click.stop="mapStore.panTo(attraction.mapy, attraction.mapx)" />
        <img v-else :src="attraction.firstimage" class="card-img-top" alt="..." style="object-fit: cover; height: 200px"
          @click.stop="moveDetail" />
        <hr />
        <div class="card-body">
          <h5 class="card-title">{{ attraction.title }}</h5>
        </div>
        <div class="card-info">
          <span v-if="matchedConfig" :style="{ backgroundColor: matchedConfig.color }">
            <div>
              <font-awesome-icon :icon="matchedConfig.icon" />
              {{ matchedConfig.text }}
            </div>
          </span>
          <span @click.stop>
            <VBookmarkButton class="like-button" :attraction="attraction" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-item {
  background: #fff;
  padding: 26px;
  border-radius: 8px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.04);
  list-style: none;
  cursor: pointer;
  text-decoration: none;
  border: 2px solid transparent;
  transition: border 0.5s ease;
}

.card-item:hover {
  border: 2px solid #000;
}

.card-item img {
  width: 100%;
  height: auto;
  /* Ensure the height is auto to maintain the aspect ratio */
  aspect-ratio: 16/9;
  border-radius: 8px;
  object-fit: cover;
  /* This ensures the image covers the parent element while maintaining the aspect ratio */
}

span {
  display: inline-block;
  background: #aac5ff;
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 0.75rem;
  border-radius: 50px;
  font-weight: 600;
}


.card-item h4,
.card-title {
  color: #000;
  font-size: 1.438rem;
  margin-top: 10px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-info span {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.like-button,
.views {
  cursor: pointer;
}

.views>svg {
  padding: 1px 6px 1px 6px;
}

.like-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0;
}
</style>
