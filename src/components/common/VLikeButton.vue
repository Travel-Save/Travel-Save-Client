<script setup>
import { deleteFavorite, getFavorite, registFavorite } from '@/api/board';
import { error } from '@/api/common';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  boardId: Number,
})

const { boardId } = props;

const userStore = useUserStore();
const { userInfo, isLogin } = storeToRefs(userStore);

const favorite = ref(0);

const isLike = computed(() => favorite.value.isLike > 0);

onMounted(() => {
  getFavoriteInfo();
});

const getFavoriteInfo = () => {
  getFavorite(
    { boardId, userId: isLogin.value ? userInfo.value.id : '' },
    ({ data }) => {
      favorite.value = data;
    },
    error
  );
};

const like = () => {
  if (isLogin.value) {
    if (!isLike.value) {
      registFavorite(
        { boardId, userId: userInfo.value.id },
        () => {
          getFavoriteInfo();
        },
        error
      );
    } else {
      deleteFavorite(
        { favoriteId: favorite.value.isLike, boardId, userId: userInfo.value.id },
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

</script>

<template>
  <div @click="like">
    <div>
      <font-awesome-icon :icon="['far', 'heart']" v-show="!isLike" />
      <font-awesome-icon :icon="['fas', 'heart']" v-show="isLike" />
      {{ favorite.likeCount }}
    </div>
  </div>
</template>

<style scoped></style>