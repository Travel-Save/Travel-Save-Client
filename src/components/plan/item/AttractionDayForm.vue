<script setup>
import { ref, onMounted, watch } from "vue";
import AttractionUserPlan from "@/components/plan/item/AttractionUserPlan.vue";
import { usePlanStore } from "@/stores/plan";
import { useMapStore } from "@/stores/map";
import { storeToRefs } from "pinia";

const planStore = usePlanStore();
const mapStore = useMapStore();
const { selectAttraction } = storeToRefs(mapStore);
const { userPlans, activeTab } = storeToRefs(planStore);
const { addLine } = mapStore;

const props = defineProps({
  mode: String,
  isReadonly: {
    type: Boolean,
    default: false,
  },
  dayPlans: {
    type: Array,
    default: null,
  },
});

const { mode } = props;

let day = 1;
const tabs = ref([{ name: `1 일차` }]);

onMounted(() => {
  activeTab.value = 0;
  if (mode === "modify") {
    modifyTab();
  } else if (mode === "regist") {
    userPlans.value = [];
    userPlans.value.push([]);
  } else {
    tabs.value = [];
    for (let i = 0; i < props.dayPlans.length; i++) {
      if (props.dayPlans[i].length > 0) tabs.value.push({ name: i + 1 + " 일차" });
    }
    userPlans.value = [...props.dayPlans];
    console.log(userPlans.value);
  }
});


// 탭 추가 함수
const addTab = () => {
  userPlans.value.push([]); // 새로운 일차에 빈 배열 추가
  tabs.value.push({ name: `${++day} 일차` }); // 탭 추가
  activeTab.value = tabs.value.length - 1; // 새로운 탭 활성화
};

const modifyTab = () => {
  const totalDays = userPlans.value.length; // 전체 일차 수
  tabs.value = [];
  for (let day = 1; day <= totalDays; day++) {
    tabs.value.push({ name: `${day} 일차` }); // 탭 추가
  }
  activeTab.value = tabs.value.length - 1; // 마지막 탭 활성화
};

// 탭 제거 함수
const removeTab = (index) => {
  day--;

  // 탭 재배치
  tabs.value = [];
  for (let i = 1; i <= day; i++) {
    tabs.value.push({ name: i + " 일차" });
  }

  userPlans.value.splice(index, 1); // 해당 인덱스의 계획 제거
  // 활성 탭 업데이트
  if (activeTab.value >= tabs.value.length) {
    activeTab.value = tabs.value.length - 1;
  }
};

watch(
  () => activeTab.value,
  () => {
    if (props.isReadonly) {
      addLine(userPlans.value[activeTab.value]);
    }
  },
);
</script>

<template>
  <div class="tab-container">
    <div class="tab-header">
      <div v-for="(tab, index) in tabs" :key="index" :class="['tab', { 'active-tab': index === activeTab }]"
        @click="activeTab = index">
        {{ tab.name }}
        <span v-if="!isReadonly" class="close-tab" @click.stop="removeTab(index)">x</span>
      </div>
      <button v-if="!isReadonly" @click="addTab" class="add-tab">+</button>
    </div>
    <div class="tab-content">
      <div v-for="(tab, index) in tabs" :key="index" v-show="index === activeTab">
        <AttractionUserPlan v-if="userPlans[index]" :isReadonly="isReadonly" :day="index" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  border-radius: 4px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  background-color: white;
  overflow-x: auto;
  white-space: nowrap;
}

.tab {
  padding: 10px;
  cursor: pointer;
  position: relative;
  background-color: #dffdff;
  border-radius: 10px;
  font-size: 14px;
}

.active-tab {
  background-color: #8ad4ff;
}

.add-tab {
  padding: 10px;
  cursor: pointer;
  background-color: white;
  border: none;
  font-size: 16px;
}

.close-tab {
  margin-left: 10px;
  color: red;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.close-tab:hover {
  transform: scale(1.8);
}

.tab-content {
  padding: 20px;
  background-color: #fff;
}
</style>
