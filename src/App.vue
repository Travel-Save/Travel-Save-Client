<script setup>
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
</script>

<template>
  <div>
    <AppHeader />
    <router-view />
  </div>
</template>

<style scoped></style>
