<script setup>
import { onMounted, ref, watch } from "vue";
const props = defineProps({ 
  selectOption: Array, 
  initSelected: {
    type: String,
    default: "",
  }
});
const emit = defineEmits(["onKeySelect"]);

const key = ref("");

onMounted(() => {
  if (props.initSelected) key.value = props.initSelected;
});

watch(
  () => props.selectOption,
  () => {
    key.value = "";
  }
)

const onSelect = () => {
  console.log(key.value + "선택!!!");
  emit("onKeySelect", key.value);
};
</script>

<template>
  <select v-model="key" class="form-select form-select-sm ms-5 me-5 w-50" @change="onSelect">
    <option
      v-for="option in selectOption"
      :key="option.value"
      :value="option.value"
    >
    <!-- <option
      v-for="option in selectOption"
      :key="option.value"
      :value="option.value"
      :disabled="option.value === '' ? true : false"
    > -->
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped></style>
