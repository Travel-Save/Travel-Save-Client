<script setup>
import { usePlanStore } from "@/stores/plan";
import { onMounted } from "vue";

const planStore = usePlanStore;

onMounted(() => {
  planStore.userPlans = [];
  planStore.attractionList = [];
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
