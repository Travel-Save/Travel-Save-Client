<script setup>
import BoardFormItem from "./item/BoardFormItem.vue";

defineProps({
  userPlans: Array,
  mode: String,
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 text-start">
        <BoardFormItem :mode="mode" :userPlans="userPlans" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
