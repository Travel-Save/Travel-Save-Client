<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { listArticle, listFavorite } from "@/api/board.js";
import BoardListItem from "@/components/board/item/BoardListItem.vue";
import VSelect from "@/components/common/VSelect.vue";
import PageNavigation from "@/components/common/PageNavigation.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "글번호", value: "b.id" },
  { text: "제목", value: "b.title" },
  { text: "작성자", value: "u.name" },
]);

const articles = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);

const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
  type: "",
});

const dType = ref("graph");

onMounted(() => {
  param.value.type = route.params.type;
  getArticleList();
});

onBeforeRouteUpdate((to, from) => {
  param.value.type = to.params.type;
  getArticleList();
});

const changeKey = (val) => {
  console.log("BoarList에서 선택한 조건 : " + val);
  param.value.key = val;
};

const getArticleList = () => {
  console.log("서버에서 글목록 얻어오자!!!", param.value);
  if (route.params.type === "F") {
    listFavorite(
      { ...param.value, userId: userInfo.value.id, type:"" },
      ({ data }) => {
        console.log(data);
        articles.value = data.articles;
        currentPage.value = data.currentPage;
        totalPage.value = data.totalPageCount;
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    listArticle(
      param.value,
      ({ data }) => {
        console.log(data);
        articles.value = data.articles;
        currentPage.value = data.currentPage;
        totalPage.value = data.totalPageCount;
      },
      (error) => {
        console.log(error);
      }
    );
  }
};

const onPageChange = (val) => {
  console.log(val + "번 페이지로 이동 준비 끝!!!");
  currentPage.value = val;
  param.value.pgno = val;
  getArticleList();
};

const moveWrite = () => {
  if (param.value.type === "H") {
    router.push({ name: "hotplace-write" });
  } else if (param.value.type === "P") {
    router.push({ name: "plan-write", type: "P" });
  } else {
    router.push({ name: "article-write" });
  }
};

</script>

<template>
  <div class="container">
    <div class="row align-self-center mb-2">
      <div class="col-md-2 text-start">
        <button type="button" class="btn btn-outline-primary btn-sm" @click="moveWrite">
          글쓰기
        </button>
      </div>
      <div class="col-md-5 offset-5">
        <form class="d-flex" @submit.prevent="getArticleList">
          <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
          <div class="input-group input-group-sm">
            <input type="text" class="form-control" v-model="param.word" placeholder="검색어..." />
            <button class="btn btn-dark" type="button" @click="getArticleList">검색</button>
          </div>
        </form>
      </div>
    </div>
    <a-tabs v-model:activeKey="dType">
      <a-tab-pane key="graph" tab="목록형"></a-tab-pane>
      <a-tab-pane key="card" tab="카드형"></a-tab-pane>
    </a-tabs>
    <BoardListItem :articles="articles" v-if="dType === 'graph'" />
    <div class="container" v-if="dType === 'card'">
      <div class="card-list">
        <BoardCardItem v-for="article in articles" :key="article.id" :article="article" id="card-item" />
      </div>
    </div>
    <div class="row">
      <PageNavigation :current-page="currentPage" :total-page="totalPage" @pageChange="onPageChange" />
    </div>
  </div>
</template>

<style scoped>
.ant-table-cell>a {
  text-decoration: none;
  color: aqua;
}

.container {
  max-width: 1200px;
  /* 원하는 최대 너비로 설정 */
  margin: 0 auto;
  padding: 20px;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
  gap: 20px;
}

.card-item {
  width: 100%;
}

/* 반응형 미디어 쿼리 */
@media (max-width: 1200px) {
  .card-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 992px) {
  .card-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .card-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .card-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
