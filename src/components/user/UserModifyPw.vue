<script setup>
import { reactive, computed } from "vue";
import { updateUser } from "@/api/user";
import { LockOutlined } from "@ant-design/icons-vue";
import { error, success } from "@/api/common";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
defineProps({
  open: Boolean,
});

const emits = defineEmits(["onClose"]);

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { getUserInfo } = userStore;

const formState = reactive({
  currPassword: "",
  password: "",
  passwordChk: "",
});

function resetForm() {
  formState.currPassword = "";
  formState.password = "";
  formState.passwordChk = "";
}

const onFinish = async (values) => {
  console.log("Success:", values);
  await updateUser({ ...values, loginId: userInfo.value.loginId }, success, error);
  await getUserInfo(sessionStorage.getItem("accessToken"));
  resetForm();
  emits('onClose');
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const disabled = computed(() => {
  return !(
    formState.currPassword &&
    formState.password &&
    formState.passwordChk &&
    formState.password == formState.passwordChk &&
    formState.currPassword == userInfo.value.password
  );
});

</script>
<template>
  <a-drawer title="Change Password" :open="open" @close="$emit('onClose')">
    <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="현재 비밀번호" name="currPassword" :rules="[{ required: true, message: '비밀번호를 입력하세요' }]">
        <a-input-password v-model:value="formState.currPassword">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="변경할 비밀번호" name="password" :rules="[{ required: true, message: '비밀번호를 입력하세요' }]">
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="비밀번호 확인" name="passwordChk" :rules="[{ required: true, message: '비밀번호를 입력하세요' }]"
        @keyup="console.log">
        <a-input-password v-model:value="formState.passwordChk">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          비밀번호 변경
        </a-button>
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
