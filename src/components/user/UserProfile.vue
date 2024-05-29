<template>
  <div class="container">
    <h3>마이페이지</h3>
    <a-collapse v-model:activeKey="activeKeyCollapse">
      <a-collapse-panel key="1" header="회원정보">
        <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
          @finishFailed="onFinishFailed">
          <a-descriptions :contentStyle="{ width: '300px' }" bordered
            :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }">
            <a-descriptions-item :contentStyle="{ height: '200px' }" label="프로필사진" :span="2">
              <div class="profile-container">
                <div>
                  <img class="thumbnail col-auto" :src="thumnail" alt="Tumbnail" @click="selectImage" />
                  <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
                </div>
                <div class="profile-button-container">
                  <a-form-item>
                    <a-button type="primary" html-type="submit" class="login-form-button">
                      수정
                    </a-button>
                  </a-form-item>
                  <a-form-item>
                    <a-button danger html-type="button" @click="withdraw" class="login-form-button">
                      회원탈퇴
                    </a-button>
                  </a-form-item>
                </div>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="로그인 아이디" :contentStyle="{ height: '60px' }"><span>{{ formState.loginId
                }}</span></a-descriptions-item>
            <a-descriptions-item label="이름" :contentStyle="{ height: '60px' }">
              <!-- <span>{{ formState.name }}</span> -->
              <a-form-item name="name" :rules="[{ required: true, message: '이름을 입력하세요' }]">
                <a-input v-model:value="formState.name">
                </a-input>
              </a-form-item>
            </a-descriptions-item>
            <a-descriptions-item label="휴대전화">
              <!-- <span>{{ formState.phone }}</span> -->
              <a-form-item name="phone" :rules="[{ required: true, message: '휴대전화 번호를 입력하세요' }]">
                <a-input v-model:value="formState.phone">
                </a-input>
              </a-form-item>
            </a-descriptions-item>
            <a-descriptions-item label="이메일">
              <!-- <span>{{ formState.email }}</span> -->
              <a-form-item name="email">
                <a-input v-model:value="formState.email">
                </a-input>
              </a-form-item>
            </a-descriptions-item>
            <a-descriptions-item label="주소" :span="2">
              <!-- <span>{{ formState.addr }}</span> -->
              <a-form-item name="addr">
                <a-input v-model:value="formState.addr">
                </a-input>
              </a-form-item>
            </a-descriptions-item>
            <a-descriptions-item label="상세주소">
              <!-- <span>{{ formState.addr2 }}</span> -->
              <a-form-item name="addr2">
                <a-input v-model:value="formState.addr2">
                </a-input>
              </a-form-item>
            </a-descriptions-item>
            <a-descriptions-item label="우편번호">
              <!-- <span>{{ formState.zipcode }}</span> -->
              <a-form-item name="zipcode">
                <a-input v-model:value="formState.zipcode">
                </a-input>
              </a-form-item>
            </a-descriptions-item>
            <!-- <a-descriptions-item label="회원가입일">{{ formState.regDate }}</a-descriptions-item> -->
          </a-descriptions>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="내가 작성한 게시물">
        <a-tabs v-model:activeKey="param.type">
          <a-tab-pane key="P" tab="여행계획">
          </a-tab-pane>
          <a-tab-pane key="H" tab="핫플레이스">
          </a-tab-pane>
          <a-tab-pane key="C" tab="게시판">
          </a-tab-pane>
          <a-tab-pane key="F" tab="좋아요">
          </a-tab-pane>
          <a-tab-pane key="A" tab="관광지북마크">
          </a-tab-pane>
        </a-tabs>
        <BoardListItem :articles="articles" v-show="param.type !== 'A'" />
        <AttractionList v-show="param.type === 'A'" />
        <div class="row">
          <PageNavigation :current-page="currentPage" :total-page="totalPage" @pageChange="onPageChange"
            v-show="param.type !== 'A'" />
          <PageNavigation :current-page="currentBookmarkPage" :total-page="totalBookmarkPage" @pageChange="onPageChange"
            v-show="param.type === 'A'" />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, watch } from "vue";
import { updateUser, deleteUser } from "@/api/user";
import { useRouter } from "vue-router";
import { error, success } from "@/api/common";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import BoardListItem from "../board/item/BoardListItem.vue";
import PageNavigation from "../common/PageNavigation.vue";
import { listArticle, listFavorite } from "@/api/board";
import { listAttractionFavorite } from "@/api/attraction";
import { usePlanStore } from "@/stores/plan";
import AttractionList from "../attraction/AttractionList.vue";

const router = useRouter();

const formState = reactive({
  name: "",
  phone: "",
  email: "",
  zipcode: "",
  addr: "",
  addr2: "",
});

const thumnail = ref("/src/assets/thumbnail-add.png");
const fileInput = ref(null);
const file = ref(null);

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { getUserInfo } = userStore;
const planStroe = usePlanStore();
const { attractionList } = storeToRefs(planStroe);

const activeKeyCollapse = ref(['2']);

const articles = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);

const currentBookmarkPage = ref(1);
const totalBookmarkPage = ref(0);

const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
  type: "P",
});

const onPageChange = (val) => {
  console.log(val + "번 페이지로 이동 준비 끝!!!");
  currentPage.value = val;
  param.value.pgno = val;
  if (param.value.type !== 'A')
    getArticleList();
  else if (param.value.type === 'A') {
    getAttractionBookmarkList();
  }
};

onMounted(() => {
  Object.assign(formState, userInfo.value);
  if (userInfo.value.profile) thumnail.value = userInfo.value.profile;
  console.log(param.value);
  getArticleList();
  getAttractionBookmarkList();
});

const onFinish = async (values) => {
  console.log("Success:", { ...values, profileImg: file.value, loginId: userInfo.value.loginId });
  if (file.value) values = { ...values, profileImg: file.value };
  await updateUser({ ...values, loginId: userInfo.value.loginId }, success, error);
  await getUserInfo(sessionStorage.getItem("accessToken"));
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function withdraw() {
  deleteUser(formState.loginId, moveMain, error);
}

function moveMain() {
  router.replace({ name: "main" });
}

watch(
  () => param.value.type,
  () => {
    getArticleList();
    getAttractionBookmarkList();
  },
  { deep: true }
);

const getArticleList = () => {
  console.log("서버에서 글목록 얻어오자!!!", param.value);
  if (param.value.type === "F") {
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
      { ...param.value, key: 'b.user_id', word: userInfo.value.id },
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
}

const getAttractionBookmarkList = async () => {
  console.log("서버에서 북마크목록 얻어오자!!!", param.value);
  await listAttractionFavorite(
    // { ...param.value, key: 'b.user_id', word: userInfo.value.id },
    { ...param.value, userId: userInfo.value.id },
    ({ data }) => {
      console.log(data);
      attractionList.value = data.attractions;
      currentBookmarkPage.value = data.currentPage;
      totalBookmarkPage.value = data.totalPageCount;
    },
    (error) => {
      console.log(error);
    }
  );
}

const selectImage = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      thumnail.value = e.target.result;
    };
    reader.readAsDataURL(file.value);
  }
  console.log(formState);
  console.log(file.value);
};

</script>
<style scoped>
.login-form {
  display: inline-block;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

.ant-form-item {
  margin-bottom: unset;
}

.thumbnail {
  height: 200px;
  width: 200px;
  object-fit: cover;
  /* 이미지 비율 유지 */
}

.profile-container {
  display: flex;
  justify-content: space-between;
}

.profile-button-container>div {
  margin: 5px;
}
</style>