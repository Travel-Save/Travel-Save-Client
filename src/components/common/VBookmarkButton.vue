<script setup>
import { deleteAttractionFavorite, getAttractionFavorite, registAttractionFavorite } from '@/api/attraction';
import { error } from '@/api/common';
import { usePlanStore } from "@/stores/plan";
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  attraction: Object,
})

const userStore = useUserStore();
const { userInfo, isLogin } = storeToRefs(userStore);

const planStore = usePlanStore();
const { attractionList } = storeToRefs(planStore);

const favorite = ref(0);

const isLike = computed(() => favorite.value.isLike > 0);

onMounted(() => {
  getFavoriteInfo();
});

const getFavoriteInfo = async () => {
  await getAttractionFavorite(
    { contentid: props.attraction.contentid, userId: isLogin.value ? userInfo.value.id : '' },
    ({ data }) => {
      favorite.value = data;
    },
    error
  );
};

const like = () => {
  if (isLogin.value) {
    if (!isLike.value) {
      registAttractionFavorite(
        { ...props.attraction, userId: userInfo.value.id },
        () => {
          getFavoriteInfo();
        },
        error
      );
    } else {
      deleteAttractionFavorite(
        { favoriteId: favorite.value.isLike, ...props.attraction, userId: userInfo.value.id },
        () => {
          getFavoriteInfo();
        },
        error
      );
    }
  } else {
    error({ message: "로그인이 필요합니다." });
  }
};

watch(
  () => attractionList.value,
  () => {
    getFavoriteInfo();
  },
  { deep: true }
);

watch(
  () => props.attraction,
  () => {
    getFavoriteInfo();
  },
  { deep: true }
);

</script>

<template>
  <div @click="like">
    <div>
      <font-awesome-icon :icon="['far', 'bookmark']" v-show="!isLike" />
      <font-awesome-icon :icon="['fas', 'bookmark']" v-show="isLike" />
      {{ favorite.likeCount }}
    </div>
  </div>
</template>

<style scoped></style>