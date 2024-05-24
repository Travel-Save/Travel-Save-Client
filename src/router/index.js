import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/MainView.vue";
import PlanView from "@/views/PlanView.vue";

import { storeToRefs } from "pinia";

import { useUserStore } from "@/stores/user";

const onlyAuthUser = async (to, from, next) => {
  const userStore = useUserStore();
  const { userInfo, isValidToken, openLogin } = storeToRefs(userStore);
  const { getUserInfo } = userStore;

  let token = sessionStorage.getItem("accessToken");

  if (token) {
    await getUserInfo(token);
  }
  if (!isValidToken.value || userInfo.value === null) {
    openLogin.value = true;
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    {
      path: "/board/:type",
      name: "board",
      component: () => import("../views/BoardView.vue"),
      redirect: { name: "article-list" },
      children: [
        {
          path: "list",
          name: "article-list",
          component: () => import("@/components/board/BoardList.vue"),
        },
        {
          path: "view/:articleno",
          name: "article-view",
          component: () => import("@/components/board/BoardDetail.vue"),
        },
        {
          path: "write",
          name: "article-write",
          props: { mode: "regist" },
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/board/BoardWrite.vue"),
        },
        {
          path: "modify/:articleno",
          name: "article-modify",
          props: { mode: "modify" },
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/board/BoardWrite.vue"),
        },
      ],
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/UserView.vue"),
      children: [
        // {
        //   path: "login",
        //   name: "user-login",
        //   component: () => import("@/components/user/UserLogin.vue"),
        // },
        // {
        //   path: "join",
        //   name: "user-join",
        //   component: () => import("@/components/user/UserJoin.vue"),
        // },
        {
          path: "profile",
          name: "user-profile",
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/user/UserProfile.vue"),
        },
        // {
        //   path: "modify",
        //   name: "user-modify",
        //   beforeEnter: onlyAuthUser,
        //   component: () => import("@/components/user/UserModifyPw.vue"),
        // },
        // {
        //   path: "find/password",
        //   name: "user-findpw",
        //   component: () => import("@/components/user/UserFindPw.vue"),
        // },
      ],
    },
    {
      path: "/plan/:type",
      name: "plan",
      component: PlanView,
      children: [
        {
          path: "write",
          name: "plan-write",
          props: { mode: "regist" },
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/plan/AttractionPlanWrite.vue"),
        },
        {
          path: "modify/:articleno",
          name: "plan-modify",
          props: { mode: "modify" },
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/plan/AttractionPlanWrite.vue"),
        },
      ],
    },
    {
      path: "/attraction",
      children: [
        {
          path: "search",
          name: "search",
          component: () => import("@/views/SearchView.vue"),
        },
        {
          path: "detail/:contenttypeid/:contentid",
          name: "search-detail",
          component: () => import("@/components/attraction/AttractionDetail.vue"),
        },
      ],
    },
    {
      path: "/hotplace",
      name: "hotplace",
      children: [
        {
          path: "list",
          name: "hotplace-list",
          redirect: { name: "article-list", params: { type: "H" } },
        },
        {
          path: "write",
          name: "hotplace-write",
          props: { mode: "regist" },
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/hotplace/HotPlaceWrite.vue"),
        },
        {
          path: "modify/:articleno",
          name: "hotplace-modify",
          props: { mode: "modify" },
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/hotplace/HotPlaceWrite.vue"),
        },
      ],
    },
  ],
});

export default router;
