import { localAxios } from "@/util/http-commons";
import { error } from "./common";
const { VITE_VUE_API_URL } = import.meta.env;
const local = localAxios();

async function login(param, success, fail) {
  await local.post(`/user/login`, JSON.stringify(param)).then(success).catch(fail);
}

async function findById(loginId, success, fail) {
  local.defaults.headers["Authorization"] = sessionStorage.getItem("accessToken");
  await local.get(`/user/info/${loginId}`).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
  local.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken"); //axios header에 refresh-token 셋팅
  await local.post(`/user/refresh`, user).then(success).catch(fail);
}

async function logout(loginId, success, fail) {
  await local.get(`/user/logout/${loginId}`).then(success).catch(fail);
}

function joinUser(param, success, fail) {
  local
    .post(`/user/join`, JSON.stringify(param))
    .then((response) => {
      success(response);
    })
    .catch(({ response }) => {
      fail(response);
    });
}

async function updateUser(param, success, fail) {
  const formData = new FormData();
  Object.keys(param).forEach((key) => {
    if (param[key] !== null && param[key] !== undefined) {
      // null이 아닌 값만 추가
      formData.append(key, param[key]);
    }
  });

  try {
    console.log("call upload file");
    const response = await fetch(`${VITE_VUE_API_URL}/user`, {
      method: "PUT",
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data'는 생략해야 함
      },
    });
    const data = await response.json();
    if (!response.ok) {
      error(data);
    } else success(data); // 성공 콜백 함수 실행
  } catch (e) {
    console.error("업로드 중 오류 발생:", e);
    fail(e); // 실패 콜백 함수 실행
  }
  // local.put(`/user`, JSON.stringify(param)).then(success).catch(fail);
}

function deleteUser(param, success, fail) {
  if (confirm("정말로 회원탈퇴하시겠습니까?")) {
    local.delete(`/user/${param}`).then(success).catch(fail);
  }
}

function findpw(param, success, fail) {
  local.post(`/user/find/password`, JSON.stringify(param)).then(success).catch(fail);
}

export { login, joinUser, updateUser, deleteUser, findpw, findById, tokenRegeneration, logout };
