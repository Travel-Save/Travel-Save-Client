<script setup>
import { ref, onMounted } from 'vue'
import { getThumbnail } from "@/api/board"
import noImage from '@/assets/no-image.png';
import { useRouter } from 'vue-router';
import VLikeButton from "@/components/common/VLikeButton.vue";

const { VITE_VUE_API_URL } = import.meta.env;
const props = defineProps({
  article: Object,
});
const router = useRouter();
const thumbnail = ref("");
onMounted(() => {
  getThumbnail({ thumbnail: props.article.thumbnail, id: props.article.id },
    ({ data }) => {
      if (data !== "") thumbnail.value = `${VITE_VUE_API_URL}/files/${data}`
      else thumbnail.value = noImage;
    }, () => {
      thumbnail.value = noImage;
    });
});

const moveDetail = (type, articleno) => {
  router.push({
    name: "article-view",
    params: { type, articleno },
  });
};
</script>

<template>
  <div @click="moveDetail(article.type, article.id)" class="card-item">
    <img :src="thumbnail" alt="Card Image">

    <span v-if="article.type === 'H'" class="hotplace">Hotplace</span>
    <span v-if="article.type === 'C'" class="board">Board</span>
    <span v-if="article.type === 'P'" class="plan">Plan</span>
    <h4>{{ article.title }}</h4>

    <div class="card-info">
      <span @click.stop>
        <VLikeButton class="like-button" :board-id="article.id" />
      </span>
      <span class="views">
        <div><font-awesome-icon :icon="['fas', 'eye']" /> {{ article.viewCount }}</div>
      </span>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  background: #fff;
  padding: 26px;
  border-radius: 8px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.04);
  list-style: none;
  cursor: pointer;
  text-decoration: none;
  border: 2px solid transparent;
  transition: border 0.5s ease;
}

.card-item:hover {
  border: 2px solid #000;
}

.card-item img {
  width: 100%;
  height: auto;
  /* Ensure the height is auto to maintain the aspect ratio */
  aspect-ratio: 16/9;
  border-radius: 8px;
  object-fit: cover;
  /* This ensures the image covers the parent element while maintaining the aspect ratio */
}

span {
  display: inline-block;
  background: #F7DFF5;
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 0.75rem;
  border-radius: 50px;
  font-weight: 600;
}

.hotplace {
  background-color: #F7DFF5;
  color: #B22485;
}

.plan {
  background-color: #d1e8ff;
  color: #2968a8;
}

.board {
  background-color: #d6f8d6;
  color: #205c20;
}

.views {
  background: #f0f0f0;
}

.card-item h4 {
  color: #000;
  font-size: 1.438rem;
  margin-top: 10px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-info span {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.like-button,
.views {
  cursor: pointer;
}

.views>svg {
  padding: 1px 6px 1px 6px;
}

.like-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0;
}
</style>