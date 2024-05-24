<script setup>
import { useUserStore } from "@/stores/user";
import { UserOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";
import UserFormItem from "../user/item/UserFormItem.vue";
import UserLogin from "../user/UserLogin.vue";
import UserModify from "../user/UserModifyPw.vue";
import UserFindPw from "../user/UserFindPw.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const badgeCount = ref(0);

const userStore = useUserStore();

const { isLogin, userInfo, openLogin } = storeToRefs(userStore);
const { userLogout, getUserInfo } = userStore;

let token = sessionStorage.getItem("accessToken");

onMounted(async () => {
  // accessToken이 유효하면 자동 로그인
  if (token) {
    await getUserInfo(token);
  }
});

const name = computed(() => {
  if (userInfo.value && isLogin.value)
    return userInfo.value.name + " (" + userInfo.value.loginId + ")";
  return "";
});

const profileImg = computed(() => {
  if (userInfo.value && isLogin.value)
    return userInfo.value.profile;
  return "";
});

const openJoin = ref(false);
const showDrawerJoin = () => {
  openLogin.value = false;
  openFindPwd.value = false;
  openPwd.value = false;
  openJoin.value = true;
};
const onCloseJoin = () => {
  openJoin.value = false;
};

const showDrawerLogin = () => {
  openLogin.value = true;
  openFindPwd.value = false;
  openPwd.value = false;
  openJoin.value = false;
};
const onCloseLogin = () => {
  openLogin.value = false;
};

const openPwd = ref(false);
const showDrawerPwd = () => {
  openLogin.value = false;
  openFindPwd.value = false;
  openPwd.value = true;
  openJoin.value = false;
};
const onClosePwd = () => {
  openPwd.value = false;
};

const openFindPwd = ref(false);
const showDrawerFindPwd = () => {
  openLogin.value = false;
  openFindPwd.value = true;
  openJoin.value = false;
  openPwd.value = false;
};
const onCloseFindPwd = () => {
  openFindPwd.value = false;
};

const logout = () => {
  userLogout();
  router.replace("/");
}
</script>

<template>
  <div>
    <a-layout class="layout">
      <a-layout-header style="line-height: 0px; background-color: #f6ffff">
        <div>
          <div class="logo">
            <router-link :to="{ name: 'main' }" class="navbar-brand">
              <img src="@/assets/logo.png" width="100%" height="100%" alt="..." />
            </router-link>
          </div>
          <a-menu mode="horizontal" style="line-height: 64px; background-color: #f5fff8">
            <a-menu-item key="2"><router-link :to="{ name: 'search' }"
                class="nav-link">관광지검색</router-link></a-menu-item>
            <a-menu-item key="3"><router-link :to="{ name: 'article-list', params: { type: 'P' } }"
                class="nav-link">여행계획</router-link></a-menu-item>
            <a-menu-item key="4"><router-link :to="{ name: 'article-list', params: { type: 'H' } }"
                class="nav-link">핫플레이스</router-link></a-menu-item>
            <a-menu-item key="1"><router-link :to="{ name: 'article-list', params: { type: 'C' } }"
                class="nav-link">게시판</router-link></a-menu-item>
          </a-menu>
        </div>
        <div>
          {{ name }}
          <div class="badge">
            <a-space style="display: flex">
              <a-dropdown placement="bottomRight" arrow>
                <a>
                  <a-space :size="24">
                    <a-badge :count="badgeCount">
                      <!-- <a-avatar v-if="userInfo.profile" :src="userInfo.profile">
                      </a-avatar>-->
                      <a-avatar :src="profileImg">
                        <template #icon>
                          <UserOutlined id="userSvg" />
                        </template>
                      </a-avatar>
                    </a-badge>
                  </a-space>
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="!isLogin" @click="showDrawerLogin">로그인</a-menu-item>
                    <a-menu-item v-if="!isLogin" @click="showDrawerJoin">회원가입</a-menu-item>
                    <a-menu-item v-if="!isLogin" @click="showDrawerFindPwd">비밀번호 찾기</a-menu-item>
                    <a-menu-item v-if="isLogin">
                      <router-link :to="{ name: 'user-profile' }" class="dropdown-item">마이페이지</router-link>
                    </a-menu-item>
                    <a-menu-item v-if="isLogin" @click="showDrawerPwd">비밀번호 변경</a-menu-item>
                    <a-menu-item v-if="isLogin" @click="logout">로그아웃</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </div>
        </div>
      </a-layout-header>
    </a-layout>
    <UserFormItem @on-close="onCloseJoin" :open="openJoin" />
    <UserLogin @on-close="onCloseLogin" @on-join="showDrawerJoin" @on-pwd="showDrawerFindPwd" :open="openLogin" />
    <UserFindPw @on-close="onCloseFindPwd" :open="openFindPwd" />
    <UserModify @on-close="onClosePwd" :open="openPwd" />
  </div>
</template>

<style scoped>
#userSvg {
  vertical-align: initial;
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

.logo {
  float: left;
  width: 130px;
  height: 64px;
  /* margin: 16px 24px 16px 0; */
  /* background: rgba(255, 255, 255, 0.3); */
}

.ant-row-rtl .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
