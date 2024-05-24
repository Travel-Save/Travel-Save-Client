<script setup>
import { reactive, computed, onMounted } from "vue";
import { joinUser, updateUser, deleteUser } from "@/api/user";
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { error, success } from "@/api/common";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const props = defineProps({
  mode: String,
  open: Boolean,
});

const emits = defineEmits(["onClose"]);

const formState = reactive({
  loginId: "",
  password: "",
  passwordChk: "",
  name: "",
  phone: "",
  email: "",
  zipcode: "",
  addr: "",
  addr2: "",
  agreeYn: false,
});

function resetForm() {
  formState.loginId = "";
  formState.password = "";
  formState.passwordChk = "";
  formState.name = "";
  formState.phone = "";
  formState.email = "";
  formState.zipcode = "";
  formState.addr = "";
  formState.addr2 = "";
  formState.agreeYn = false;
}

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const disabled = computed(() => {
  return !(
    formState.loginId &&
    formState.password &&
    formState.passwordChk &&
    formState.name &&
    formState.phone &&
    ((formState.agreeYn && !isModify.value) || (isModify.value)) &&
    formState.password == formState.passwordChk
  );
});

const isModify = computed(() => {
  return props.mode === 'modify'
});

const btnText = computed(() => {
  return isModify.value ? "수정" : "회원가입"
});

onMounted(() => {
  resetForm();
});

const onFinish = (values) => {
  console.log("Success:", values);
  if (isModify.value) {
    updateUser(values, success, error);
  } else {
    joinUser(values, joinSuccess, error);
  }
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

if (isModify.value) {
  Object.assign(formState, userInfo.value);
}

const joinSuccess = (msg) => {
  success(msg);
  resetForm();
  emits('onClose');
}

function withdraw() {
  deleteUser(formState.loginId, success, error);
  emits('onClose');
}

</script>
<template>
  <a-drawer title="Create a new account" :open="open" :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }" @close="$emit('onClose')">


    <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">

      <a-form-item label="login ID" name="loginId" :rules="[{ required: true, message: '아이디를 입력하세요' }]"
        v-if="!isModify">
        <a-input v-model:value="formState.loginId">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="login ID" name="loginId" v-if="isModify">
        <a-input v-model:value="formState.loginId" readonly>
        </a-input>
      </a-form-item>

      <a-form-item label="Password" name="password" :rules="[{ required: true, message: '비밀번호를 입력하세요' }]">
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="PW check" name="passwordChk" :rules="[{ required: true, message: '비밀번호를 입력하세요' }]"
        @keyup="console.log">
        <a-input-password v-model:value="formState.passwordChk">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="name" name="name" :rules="[{ required: true, message: '이름을 입력하세요' }]">
        <a-input v-model:value="formState.name">
        </a-input>
      </a-form-item>

      <a-form-item label="phone" name="phone" :rules="[{ required: true, message: '휴대전화 번호를 입력하세요' }]">
        <a-input v-model:value="formState.phone">
        </a-input>
      </a-form-item>

      <a-form-item label="email" name="email">
        <a-input v-model:value="formState.email">
        </a-input>
      </a-form-item>

      <a-form-item label="zipcode" name="zipcode">
        <a-input v-model:value="formState.zipcode">
        </a-input>
      </a-form-item>

      <a-form-item label="addr" name="addr">
        <a-input v-model:value="formState.addr">
        </a-input>
      </a-form-item>

      <a-form-item label="addr2" name="addr2">
        <a-input v-model:value="formState.addr2">
        </a-input>
      </a-form-item>

      <a-form-item name="agreeYn" label="agreeYn" no-style v-if="!isModify"
        :rules="[{ required: true, message: '개인정보 이용 동의' }]">
        <a-checkbox v-model:checked="formState.agreeYn">개인정보 이용 동의</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          {{ btnText }}
        </a-button>
      </a-form-item>
      <a-form-item v-if="isModify">
        <a-button danger html-type="button" @click="withdraw" class="login-form-button">
          회원탈퇴
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