<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailArticle, deleteArticle, getFiles, downloadFile, getThumbnail } from "@/api/board";
import AttractionDayForm from "../plan/item/AttractionDayForm.vue";
import { usePlanStore } from "@/stores/plan";
import { useUserStore } from "@/stores/user";
import { useKakaoMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";
import KakaoMap from "../map/KakaoMap.vue";
import VLikeButton from "../common/VLikeButton.vue";
import OpenAI from "../openai/OpenAI.vue";

const { VITE_VUE_API_URL } = import.meta.env;

const planStore = usePlanStore();
const userStore = useUserStore();
const kakaoMapStore = useKakaoMapStore();
const route = useRoute();
const router = useRouter();

// const articleno = ref(route.params.articleno);
const { articleno } = route.params;
const { userInfo } = storeToRefs(userStore);
const { addLine } = kakaoMapStore;

const article = ref({
  content2: [],
});
const files = ref([]);

onMounted(() => {
  console.log("mounted");
  getArticle();
});

const mapMounted = () => {
  addLine(article.value.content2[0]);
};

const isWriter = computed(() => {
  return userInfo.value && article.value.userId === userInfo.value.id;
});

const thumbnail = ref("");
const getArticle = async () => {
  // const { articleno } = route.params;
  console.log(articleno + "번글 얻으러 가자!!!");
  detailArticle(
    articleno,
    ({ data }) => {
      article.value = data;
      console.log(article.value);
      article.value.content2 = JSON.parse(article.value.content2);
      // TODO : PolyLine 과 같은 증상 (처음 들어오면 좌표가 안찍힘)
      if (article.value.type === "H") {
        kakaoMapStore.addressLocation(article.value.content2.address);
      }
      if (article.value.thumbnail) {
        console.log("섬네일 불러오기");
        getThumbnail(
          { thumbnail: article.value.thumbnail, id: article.value.id },
          ({ data }) => {
            thumbnail.value = `${VITE_VUE_API_URL}/files/${data}`;
            console.log(thumbnail.value);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        thumbnail.value = `/src/assets/no-image2.png`;
      }
      console.log(article.value);
      console.log(userInfo);
      getFiles(
        article.value.id,
        (response) => {
          files.value = response.data;
          console.log(files.value);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    (error) => {
      console.log(error);
    }
  );
};

function moveList() {
  router.push({ name: "article-list" });
}

function moveModify() {
  if (article.value.type === "H") {
    router.push({ name: "hotplace-modify", params: { articleno } });
  } else {
    router.push({ name: "article-modify", params: { articleno } });
  }
}

function onDeleteArticle() {
  // const { articleno } = route.params;
  console.log(articleno + "번글 삭제하러 가자!!!");
  deleteArticle(
    articleno,
    (response) => {
      if (response.status == 200) moveList();
    },
    (error) => {
      console.log(error);
    }
  );
}

function download(file) {
  console.log(file.originalFile);
  downloadFile(file);
}

const planModify = () => {
  planStore.attractionList = [];
  router.push({ name: "plan-modify", params: { articleno: route.params.articleno } });
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <h2>
            {{ article.id }}. {{ article.title }}
            <div style="text-align: left; display: inline-block" v-if="article.type !== 'H' && article.thumbnail">
              <a-tooltip placement="right">
                <template #title><img :src="thumbnail" style="width: 100%" /></template>
                <span class="btn btn-outline-primary">썸네일</span>
              </a-tooltip>
            </div>
          </h2>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="clearfix align-content-center">
              <p>
                <span class="fw-bold">{{ article.userName }}</span> <br />
                <span class="text-secondary fw-light">
                  {{ article.regDate }}
                </span>
              </p>
            </div>
          </div>
          <div class="col-md-4 align-self-center text-secondary text-end">
            조회 : {{ article.viewCount }}
          </div>
          <div class="my-2 thumbnail-map-container" v-if="article.type === 'H'">
            <div class="info-container">
              <p>주소 : {{ article.content2.address }}</p>
              <p>도로명 : {{ article.content2.roadAddress }}</p>
              <img :src="thumbnail" class="thumbnail" />
            </div>
            <div class="map-wrapper">
              <KakaoMap id="map-container" />
            </div>
          </div>
          <div class="divider mb-5"></div>
          <div v-html="article.content"></div>

          <div class="mt-3" alt="첨부파일">
            <ul>
              <li class="form-control" v-for="(file, index) in files" :key="index">
                {{ file.originalFile }}
                <a @click="download(file)" class="filedown" :sfolder="file.saveFolder" :sfile="file.saveFile"
                  :ofile="file.originalFile">[다운로드]</a>
              </li>
            </ul>
          </div>
          <div class="divider mt-3 mb-3"></div>
          <div class="d-flex justify-content-end" v-if="article.type !== 'P'">
            <VLikeButton class="btn btn-outline-danger mb-3" :board-id="articleno" />
            <button type="button" class="btn btn-outline-primary mb-3 ms-1" @click="moveList">
              글목록
            </button>
            <div v-if="isWriter">
              <button type="button" class="btn btn-outline-success mb-3 ms-1" @click="moveModify">
                글수정
              </button>
              <button type="button" class="btn btn-outline-danger mb-3 ms-1" @click="onDeleteArticle">
                글삭제
              </button>
            </div>
          </div>
          <div class="d-flex justify-content-center mb-4" v-else>
            <VLikeButton class="btn btn-outline-danger" :board-id="article.id" />
            <button type="button" class="btn btn-outline-primary ms-1" @click="moveList">
              글목록
            </button>
            <div v-if="isWriter">
              <button type="button" class="btn btn-outline-success ms-1" @click="planModify">
                수정하기
              </button>
              <button type="button" class="btn btn-outline-danger ms-1" @click="onDeleteArticle">
                글삭제
              </button>
            </div>
          </div>
          <div v-if="article.type === 'P'" class="map-plan-container">
            <KakaoMap class="map-container" @map-mounted="mapMounted" />

            <div class="plan-container">
              <h4 class="text-center mt-3">나의 여행 계획</h4>
              <AttractionDayForm :dayPlans="article.content2" :isReadonly="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <OpenAI :userPlans="article.content2" />
</template>

<style scoped>
.like {
  background: red;
}

.map-plan-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
  background-color: white;
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.map {
  flex: 1 1 45%;
  /* flex-grow, flex-shrink, flex-basis를 설정하여 유연하게 배치 */
  margin-right: 10px;
  /* 두 요소 사이의 간격 */
  height: 100%;
  /* 컨테이너 높이에 맞추기 */
  box-sizing: border-box;
}

.user-plan {
  /* top: -50px; */
  position: relative;
  flex: 1 1 45%;
  /* flex-grow, flex-shrink, flex-basis를 설정하여 유연하게 배치 */

  /* height: 100%; 컨테이너 높이에 맞추기 */
  box-sizing: border-box;
}

.user-plan::-webkit-scrollbar {
  width: 10px;
}

.user-plan::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
  background-clip: padding-box;
  border: 2px solid transparent;
}

.user-plan::-webkit-scrollbar-track {
  background-color: grey;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumbnail-map-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background: #f9f9f9;
  /* 배경색 추가 */
  border-radius: 8px;
  /* 테두리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 그림자 효과 */
}

.info-container {
  flex: 1;
  margin-right: 20px;
}

.map-wrapper {
  flex-basis: 300px;
  flex-shrink: 0;
  height: 300px;
}

.thumbnail {
  width: 100%;
  max-width: 300px;
  height: auto;
}

#map-container {
  width: 100%;
  height: 100%;
}

.plan-container {
  width: 500px;
  min-width: 200px;
  height: 600px;
  overflow: scroll;
  flex: 2;
}

.map-container {
  width: 100%;
  min-width: 500px;
  height: 600px;
  flex: 3;
}
</style>
