<script setup>
import { CaretUpOutlined, CaretDownOutlined, DeleteFilled } from "@ant-design/icons-vue";
import { usePlanStore } from "@/stores/plan";
import { storeToRefs } from "pinia";
import AttractionItem from "@/components/attraction/item/AttractionItem.vue";


const planStore = usePlanStore();
const { userPlans } = storeToRefs(planStore);

const props = defineProps({
  isReadonly: Boolean,
  day: Number,
});
</script>

<template>
  <div class="user-plan">
    <div class="plan-item" v-for="(userPlan, index) in userPlans[day]" :key="index">
      <AttractionItem :attraction="userPlan" />
      <div class="action-buttons" v-if="!isReadonly">
        <a-button-group>
          <a-tooltip title="UP">
            <a-button shape="circle" @click="planStore.changeIndex(index, day, 'UP')">
              <CaretUpOutlined />
            </a-button>
          </a-tooltip>
          <a-tooltip title="DOWN">
            <a-button shape="circle" @click="planStore.changeIndex(index, day, 'DOWN')">
              <CaretDownOutlined />
            </a-button>
          </a-tooltip>
          <a-tooltip title="DELETE">
            <a-button shape="circle" @click="planStore.deletePlan(index, day)">
              <DeleteFilled />
            </a-button>
          </a-tooltip>
        </a-button-group>
      </div>
    </div>
  </div>
</template>


<style scoped>
.plan-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 중앙 정렬 */
  margin-bottom: 20px;
  /* 각 아이템 간의 간격 조정 */
}

.action-buttons {
  display: flex;
  justify-content: center;
  /* 버튼을 중앙에 위치 */
  padding: 10px 0;
  /* 상하 패딩으로 버튼과 아이템 간의 간격 조정 */
}

img {
  height: 200px;
  width: 300px;
  border-radius: 10px;
  /* 이미지의 모서리를 둥글게 */
  overflow: hidden;
}

.user-plan {
  width: 100%;
  overflow: auto;
}
</style>
