<script setup>
import { onMounted, ref, watch } from "vue";
import { getGugunList, getAttractionList, listAttractionFavorite } from "@/api/attraction.js";
import { SearchOutlined } from "@ant-design/icons-vue";
import { usePlanStore } from "@/stores/plan";
// import { useKakaoMapStore } from "@/stores/map";
import { useMapStore } from "@/stores/map"; 
import { useAttractionFilterStore } from "@/stores/attractionFilter";
import VSelect from "../common/VSelect.vue";
import { storeToRefs } from "pinia";
import { error, findObject } from "@/api/common";
import { useUserStore } from "@/stores/user";

const props = defineProps({
  mode: String,
});

// const areaCode = ref(0);
// const sigunguCode = ref(0);
const keyword = ref("");

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const planStore = usePlanStore();
const { attractionList, totalCount } = storeToRefs(planStore);
const { pagenationBySetAttractions, setKeywordAttractions } = planStore;

const attractionFilterStore = useAttractionFilterStore();
const { infinityScrollPageNo, contentTypeId, areaCode, sigunguCode } = storeToRefs(attractionFilterStore);
const { setSidoConfig, getCondition, setAreaBasedConfig, setKeywordConfig } = attractionFilterStore;

const mapStore = useMapStore();
const { map } = storeToRefs(mapStore);
const { displayMarker } = mapStore;


const sidoSelectOption = ref([
  { text: "시/도", value: "" },
  { text: "서울", value: "1" },
  { text: "인천", value: "2" },
  { text: "대전", value: "3" },
  { text: "대구", value: "4" },
  { text: "광주", value: "5" },
  { text: "부산", value: "6" },
  { text: "울산", value: "7" },
  { text: "세종특별자치시", value: "8" },
  { text: "경기도", value: "31" },
  { text: "강원도", value: "32" },
  { text: "충청북도", value: "33" },
  { text: "충청남도", value: "34" },
  { text: "경상북도", value: "35" },
  { text: "경상남도", value: "36" },
  { text: "전라북도", value: "37" },
  { text: "전라남도", value: "38" },
  { text: "제주도", value: "39" },
]);

const gugunSelectOption = ref([{ text: "구/군", value: "" }]);

const submitSearchBox = () => {
  if (contentTypeId.value != -99) {
    if (keyword.value) {
      setKeywordConfig(keyword.value, { pageNo: infinityScrollPageNo.value, numOfRows: 12, });
    } else {
      setAreaBasedConfig({ pageNo: infinityScrollPageNo.value, numOfRows: 12 });
    }
    getAttractionList(
      getCondition(),
      ({ data }) => {
        console.log(data);
        if (props.mode === 'paging') totalCount.value = data.response.body.totalCount;
        pagenationBySetAttractions({ data });
        if (Object.entries(map.value).length != 0) displayMarker(findObject(data, "item"));
      },
      (err) => {
        error({ message: "검색결과가 없습니다." });
        console.log(err);
      }
    );
  }
};

const attractionSize = ref(0);
watch(
  [infinityScrollPageNo, attractionList],
  ([newVar1, newVar2], [oldVar1, oldVar2]) => {
    console.log('pagenation')
    if (
      infinityScrollPageNo.value !== 1 &&
      newVar1 !== oldVar1 &&
      (newVar2.length !== attractionSize.value
        || props.mode === 'paging')
    ) {
      submitSearchBox();
      attractionSize.value = oldVar2.length;
    }
  },
  { deep: true }
);

watch(
  () => contentTypeId.value,
  () => {
    planStore.attractionList = [];
    infinityScrollPageNo.value = 1;
    totalCount.value = 0;

    if (contentTypeId.value == -99) {
      listAttractionFavorite(
        // { ...param.value, key: 'b.user_id', word: userInfo.value.id },
        { pgno: infinityScrollPageNo.value, spp: 12, userId: userInfo.value.id },
        ({ data }) => {
          console.log(data);
          if (props.mode === 'paging') totalCount.value = data.totalPageCount * 12;
          if (keyword.value) {
            setKeywordAttractions({ item: data.attractions }, keyword.value);
          } else {
            pagenationBySetAttractions({ item: data.attractions });
          }
          if (Object.entries(map.value).length != 0) displayMarker(findObject(data, "attractions"));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
);

watch(
  // sigunguCode가 변경되면 attractionList 와 page 번호 초기화
  () => sigunguCode.value,
  () => {
    infinityScrollPageNo.value = 1;
    attractionList.value = [];
    totalCount.value = 0;
  }
);

watch(
  () => areaCode.value,
  () => {
    infinityScrollPageNo.value = 1;
    attractionList.value = [];
    totalCount.value = 0;
    gugunSelectOption.value = [{ text: "구/군", value: "" }];
    sigunguCode.value = "";

    if (areaCode.value === "") return;
    setSidoConfig();
    getGugunList(getCondition(),
      ({ data }) => {
        data.response.body.items.item.forEach((code) => {
          gugunSelectOption.value.push({ text: code.name, value: code.code });
        });
        console.log(gugunSelectOption.value);
      },
      console.log
    );
  }
);

const changeKey = (val) => {
  areaCode.value = val;
};

const changeGugunKey = (val) => {
  sigunguCode.value = val;
};

onMounted(() => {
  setSidoConfig();
  getGugunList(getCondition(),
    ({ data }) => {
      console.log(data);
      data.response.body.items.item.forEach((code) => {
        gugunSelectOption.value.push({ text: code.name, value: code.code });
      });
    },
    console.log
  );
});
</script>

<template>
  <form @submit.prevent="submitSearchBox" class="search-form">
    <VSelect :selectOption="sidoSelectOption" @onKeySelect="changeKey" :init-selected="areaCode" class="select-sido" />
    <VSelect :selectOption="gugunSelectOption" @onKeySelect="changeGugunKey" class="select-gugun" />
    <div class="search-input-container">
      <input v-model="keyword" type="text" placeholder="검색어를 입력해주세요." class="search-input" />
      <button type="submit" class="search-button">
        <SearchOutlined id="svg" />
      </button>
    </div>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  padding: 0.625rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.select-sido,
.select-gugun {
  height: 2.25rem;
  /* 고정 높이 설정 */
  margin-bottom: 0.5rem;
  /* 세로 배열 시 간격 설정 */
}

.search-input-container {
  display: flex;
  margin-bottom: 0.5rem;
  /* 입력 필드와 버튼의 컨테이너 */
}

.search-input {
  height: 2.25rem;
  font-size: 1rem;
  border: 0;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  /* 버튼과 간격 설정 */
}

.search-button {
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 0.5rem;
  background: black;
  color: white;
  text-align: center;
}

@media (min-width: 768px) {
  .search-form {
    flex-direction: row;
    /* 모바일에서는 요소들을 세로로 쌓음 */
  }

  .select-sido,
  .select-gugun {
    flex: 1 1 auto;
    /* 데스크톱에서도 고정 크기 유지 */
    min-width: 120px;
    /* 최소 너비 명시 */
    max-width: 300px;
    /* 최대 너비 명시 */
    height: 40px;
  }

  .search-input-container {
    margin-right: 0.5rem;
    /* 요소 간 간격 유지 */
    flex-direction: row;
    /* 데스크톱에서 입력 필드와 버튼 가로 배열 */
  }

  .search-button,
  .search-input {
    flex: none;
    /* 데스크톱에서는 고정 크기 */
  }
}
</style>
