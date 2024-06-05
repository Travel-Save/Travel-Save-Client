<script setup>
// import KakaoMap from "@/components/map/KakaoMap.vue";
import { useMapStore } from "@/stores/map";
import { SearchOutlined } from "@ant-design/icons-vue";
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { registArticle, getModifyArticle, modifyArticle, uploadFiles, getFiles, getThumbnail } from "@/api/board";
import { error, success } from "@/api/common";
import Editor from "@tinymce/tinymce-vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import GoogleMap from "../map/GoogleMap.vue";
const { VITE_VUE_API_URL, VITE_TINYMCE_API_KEY } = import.meta.env;

const router = useRouter();
const route = useRoute();

const props = defineProps({
  mode: String,
});

const boardType = "H";
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const mapStore = useMapStore();
const { addressLocation } = mapStore;
const { userAddressPosition } = storeToRefs(mapStore);

const isUseId = ref(false);
const userAddress = ref({});

const article = ref({
  title: "",
  content: "",
  userId: userInfo.value.id,
  content2: {},
  type: boardType,
});

const thumbnail = ref("/src/assets/thumbnail-add.png");
const files = ref([]);
const uploadedFiles = ref([]);

if (props.mode === "modify") {
  let { articleno } = route.params;
  console.log(articleno + "번글 얻어와서 수정할거야");
  getModifyArticle(
    articleno,
    ({ data }) => {
      console.log(data);
      article.value = data;
      if (article.value.content2 !== undefined) {
        article.value.content2 = { ...JSON.parse(article.value.content2) };
        userAddress.value = article.value.content2;
        addressLocation(userAddress.value.address);
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
      }
      console.log(article.value);
      isUseId.value = true;
      getFiles(
        article.value.id,
        (response) => {
          uploadedFiles.value = response.data;
          console.log(uploadedFiles.value);
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
  isUseId.value = true;
}

const titleErrMsg = ref("");
const contentErrMsg = ref("");
const content2ErrMsg = ref("주소를 확인해 주세요");
watch(
  () => article.value.title,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      titleErrMsg.value = "제목을 확인해 주세요";
    } else titleErrMsg.value = "";
  },
  { immediate: true }
);
watch(
  () => article.value.content,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요";
    } else contentErrMsg.value = "";
  },
  { immediate: true }
);
watch(
  () => userAddress.value,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      content2ErrMsg.value = "주소를 확인해 주세요";
    } else content2ErrMsg.value = "";
  },
);

function onSubmit() {
  if (titleErrMsg.value) {
    error({ message: titleErrMsg.value });
  } else if (contentErrMsg.value) {
    error({ message: contentErrMsg.value });
  } else if (content2ErrMsg.value) {
    error({ message: content2ErrMsg.value });
  } else {
    props.mode === "regist" ? writeArticle() : updateArticle();
  }
}

function writeArticle() {
  console.log("글등록하자!!", article.value);
  article.value.content2 = JSON.stringify({ ...userAddress.value, mapy: userAddressPosition.value.lat, mapx: userAddressPosition.value.lng })
  registArticle(
    article.value,
    (response) => {
      let msg = "글등록 처리시 문제 발생했습니다.";
      if (response.status == 201) msg = "글등록이 완료되었습니다.";
      console.log(response.data);
      if (file.value !== null) {
        files.value = [...files.value, file.value];
      }
      uploadFiles(response.data, [...files.value], moveList, error);
      success(msg);
    },
    (error) => console.log(error)
  );
  moveList();
}

function updateArticle() {
  console.log(article.value.id + "번글 수정하자!!", article.value);

  modifyArticle(
    article.value,
    (response) => {
      let msg = "글수정 처리시 문제 발생했습니다.";
      if (response.status == 200) msg = "글정보 수정이 완료되었습니다.";
      if (file.value !== null) {
        files.value = [...files.value, file.value];
      }
      uploadFiles(article.value.id, [...files.value], moveList, error);
      alert(msg);
      moveList();
    },
    (error) => console.log(error)
  );
}

function moveList() {
  router.replace({ name: "hotplace-list", params: { type: "H" } });
}

function handleFileUpload(event) {
  files.value = event.target.files;
  console.log(files.value);
}

const getAddressLocation = () => {
  new daum.Postcode({
    oncomplete: function (data) {
      addressLocation(data.address);
      userAddress.value = { address: data.address, roadAddress: data.jibunAddress}
    },
  }).open();
};

const fileInput = ref(null);
const selectImage = () => {
  fileInput.value.click();
};

const file = ref(null);
const handleFileChange = (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      thumbnail.value = e.target.result;
    };
    reader.readAsDataURL(file.value);
    article.value.thumbnail = file.value.name;
  }
  console.log(article.value);
  console.log(file.value);
};

</script>

<template>
  <div class="container">
    <form @submit.prevent="getAddressLocation" class="input-group-form">
      <div class="input-group">
        <input v-model="userAddress.address" type="text" class="form-control" placeholder="주소를 입력해주세요." @click="getAddressLocation"/>
        <button type="submit" class="btn btn-dark">
          <span class="icon">
            <SearchOutlined />
          </span>
        </button>
      </div>
    </form>
    <div class="row image">
      <img class="thumbnail col-auto" :src="thumbnail" alt="Tumbnail" @click="selectImage" />
      <GoogleMap id="map-container" class="col" />
    </div>
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
      <div class="mb-3">
        <label for="title" class="form-label">제목 : </label>
        <input type="text" class="form-control" v-model="article.title" placeholder="제목..." />
        <label for="title" class="form-label mt-3">주소 : {{ userAddress.address }} ({{ userAddress.roadAddress }})</label>
        <!-- <input type="text" class="form-control" v-model="userAddress" placeholder="주소..." readonly /> -->
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">내용 : </label>
        <Editor v-model="article.content" :api-key="VITE_TINYMCE_API_KEY" :init="{
          height: 500,
          menubar: false,
          // plugins: [
          //   'lists link image charmap print preview anchor',
          //   'code fullscreen',
          //   'paste code help wordcount',
          // ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        }" />
      </div>
      <div class="mb-3" alt="첨부파일" v-if="uploadedFiles.length > 0">
        <ul>
          <li class="form-control" v-for="file in uploadedFiles" :key="file.id">
            {{ file.originalFile }}
            <a @click="download(file)" class="filedown" :sfolder="file.saveFolder" :sfile="file.saveFile"
              :ofile="file.originalFile">[다운로드]</a>
          </li>
        </ul>
      </div>
      <div class="mb-3">
        <label for="upfile" class="form-label">파일:</label>
        <input type="file" class="form-control border" id="upfile" name="upfile" @change="handleFileUpload"
          multiple="multiple" />
      </div>
      <div class="col-auto text-center">
        <button type="submit" class="btn btn-outline-primary mb-3" v-if="mode === 'regist'">
          글작성
        </button>
        <button type="submit" class="btn btn-outline-success mb-3" v-else>글수정</button>
        <button type="button" class="btn btn-outline-danger mb-3 ms-1" @click="moveList">
          목록으로이동...
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.thumbnail {
  height: 300px;
  width: 300px;
  object-fit: cover;
}

#map-container {
  height: 400px;
  width: 100%;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group-form {
  width: 70%;
  min-width: 300px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .thumbnail {
    width: 100%;
    height: auto;
  }

  #map-container {
    height: 300px;
  }
}
</style>
