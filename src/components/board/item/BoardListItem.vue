<script setup>
defineProps({
  articles: Array,
});

const columns = [
  {
    title: "글번호",
    dataIndex: "id",
    width: "10%",
    align: "center",
  },
  {
    title: "제목",
    dataIndex: "title",
  },
  {
    title: "작성자",
    dataIndex: "userName",
    width: "20%",
  },
  {
    title: "조회수",
    dataIndex: "viewCount",
    width: "7%",
    align: "right",
  },
  {
    title: "등록일",
    dataIndex: "regDate",
    width: "20%",
    align: "center",
  },
];
</script>

<template>
  <div class="mb-2">
    <a-table :columns="columns" :data-source="articles" :pagination="false">
      <template #bodyCell="{ record, column, text }">
        <template v-if="column.dataIndex === 'title'">
          <router-link :to="{ name: 'article-view', params: { articleno: record.id, type: record.type } }"
            class="article-title link-dark">
            {{ text }}
          </router-link>
        </template>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
