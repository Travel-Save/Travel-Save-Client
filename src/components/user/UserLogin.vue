<script setup>
import { reactive, computed, onMounted } from "vue";
import { deleteCookie, getCookie, setCookie } from "@/api/common";
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
defineProps({
  open: Boolean,
});

const emits = defineEmits(["onClose", "onJoin", "onPwd"]);
const userStore = useUserStore();

const { isLogin } = storeToRefs(userStore);
const { userLogin, getUserInfo } = userStore;

const formState = reactive({
  loginId: "",
  password: "",
  remember: false,
});
function resetForm() {
  initLoginForm();
  formState.password = "";
}

onMounted(() => {
  initLoginForm();
});

const initLoginForm = () => {
  const loginConfig = getCookie("loginConfig");
  if (loginConfig) {
    const parsedConfig = JSON.parse(loginConfig);
    console.log(parsedConfig);
    formState.loginId = parsedConfig.loginId;
    formState.remember = parsedConfig.remember;
  }
}

const onFinish = async (values) => {
  console.log("Success:", values);
  // 쿠키 추가
  if (formState.remember) {
    setCookie(
      "loginConfig",
      JSON.stringify({ loginId: formState.loginId, remember: formState.remember }),
      { secure: true }
    );
  } else {
    deleteCookie("loginConfig");
  }

  await userLogin(values);
  let token = sessionStorage.getItem("accessToken");

  if (isLogin.value) {
    await getUserInfo(token);
    resetForm();
    emits('onClose');
  }
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const disabled = computed(() => {
  return !(formState.loginId && formState.password);
});
</script>
<template>
  <a-drawer title="Login" :open="open" @close="$emit('onClose')">
    <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="Login ID" name="loginId"
        :rules="[{ required: true, message: 'Please input your Login ID!' }]">
        <a-input v-model:value="formState.loginId">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Password" name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
        <a-button type="link" @click="$emit('onPwd')">Forgot password</a-button>
        Or
        <a-button type="link" @click="$emit('onJoin')">register now!</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<style scoped>
.login-form {
  display: inline-block;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}
</style>
