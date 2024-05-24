<script setup>
import { reactive, computed } from "vue";
import { findpw } from "@/api/user";
import { PhoneOutlined, UserOutlined } from '@ant-design/icons-vue';
defineProps({
  open: Boolean,
});

const emits = defineEmits(["onClose"]);
const formState = reactive({
  loginId: "",
  phone: "",
});
function resetForm() {
  formState.loginId = "";
  formState.phone = "";
}
const onFinish = async (values) => {
  console.log("Success:", values);
  await findpw(values, getTempPassword, console.log);
  resetForm();
  emits('onClose');
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const getTempPassword = (response) => {
  console.log(response);
  alert(response.data.password);
}

const disabled = computed(() => {
  return !(formState.loginId && formState.phone);
});
</script>
<template>
  <a-drawer title="Find Password" :open="open" :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }" @close="$emit('onClose')">
    <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="Login ID" name="loginId"
        :rules="[{ required: true, message: 'Please input your Login ID!' }]">
        <a-input v-model:value="formState.loginId">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Phone" name="phone" :rules="[{ required: true, message: 'Please input your Phone!' }]">
        <a-input v-model:value="formState.phone">
          <template #prefix>
            <PhoneOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          비밀번호 찾기
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