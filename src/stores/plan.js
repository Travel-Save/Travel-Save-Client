import { ref } from "vue";
import { defineStore } from "pinia";
import { findObject } from "@/api/common";
import { error } from "@/api/common";
export const usePlanStore = defineStore("plan", () => {
  //   const count = ref(0);
  //   const doubleCount = computed(() => count.value * 2);
  //   function increment() {
  //     count.value++;
  //   }
  const attractionList = ref([]);
  const userPlans = ref([]);
  const changeWriteComponent = ref(false);
  const totalCount = ref(0);
  const activeTab = ref(0);
  const setAttractions = (data) => {
    attractionList.value = [];
    const attractions = findObject(data, "item");
    attractions.forEach((attraction) => {
      if (!attraction.firstimage) attraction.firstimage = "/src/assets/no-image.png";
      if (!attraction.tel) attraction.tel = "전화번호가 없습니다.";
      // console.log(attraction);
      attractionList.value.push(attraction);
    });
  };

  const pagenationBySetAttractions = (data) => {
    const attractions = findObject(data, "item");
    attractions.forEach((attraction) => {
      if (!attraction.firstimage) attraction.firstimage = "/src/assets/no-image.png";
      if (!attraction.tel) attraction.tel = "전화번호가 없습니다.";
      // console.log(attraction);
      attractionList.value.push(attraction);
    });
  };

  const setKeywordAttractions = (data, keyword) => {
    console.log(data);
    const attractions = findObject(data, "item");
    attractions.forEach((attraction) => {
      if (attraction.title.includes(keyword)) {
        if (!attraction.firstimage) attraction.firstimage = "/src/assets/no-image.png";
        if (!attraction.tel) attraction.tel = "전화번호가 없습니다.";
        // console.log(attraction);
        attractionList.value.push(attraction);
      }
    });
  };

  const getPositions = () => {
    let positions = [];
    attractionList.value.forEach((attraction) => {
      positions.push([attraction.mapy, attraction.mapx]);
    });
    console.log(positions);
    return positions;
  };

  const addPlan = (attraction) => {
    if (!userPlans.value[activeTab.value]) {
      userPlans.value[activeTab.value] = [];
    }
    userPlans.value[activeTab.value].push(attraction);
    console.log(userPlans.value);
  };

  const deletePlan = (index, day) => {
    userPlans.value[day].splice(index, 1);
  };

  const changeIndex = (index, day, action) => {
    if (action === "UP") {
      if (index > 0) {
        const item = userPlans.value[day].splice(index, 1);
        userPlans.value[day].splice(index - 1, 0, item[0]);
      }
    } else {
      if (index < userPlans.value[day].length - 1) {
        const item = userPlans.value[day].splice(index, 1);
        userPlans.value[day].splice(index + 1, 0, item[0]);
      }
    }
  };

  const moveWrite = () => {
    let isSuccess = true;
    userPlans.value.forEach((userPlan) => {
      if (userPlan.length === 0) {
        isSuccess = false;
        return;
      }
    });
    if (isSuccess) changeWriteComponent.value = !changeWriteComponent.value;
    else {
      error({ message: "작성이 완료되지 않은 일차가 있습니다. 확인해주세요." });
    }
  };
  return {
    attractionList,
    userPlans,
    changeWriteComponent,
    totalCount,
    activeTab,
    setAttractions,
    getPositions,
    addPlan,
    deletePlan,
    changeIndex,
    setKeywordAttractions,
    pagenationBySetAttractions,
    moveWrite,
  };
});
