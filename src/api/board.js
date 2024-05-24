import { localAxios } from "@/util/http-commons";
import { success, error } from "@/api/common.js";
import { message } from "ant-design-vue";

const local = localAxios();
const { VITE_VUE_API_URL } = import.meta.env;

function listArticle(param, success, fail) {
  local.get(`/board`, { params: param }).then(success).catch(fail);
}

function detailArticle(articleno, success, fail) {
  local.get(`/board/${articleno}`).then(success).catch(fail);
}

function registArticle(article, success, fail) {
  console.log("boardjs article", article);
  local.post(`/board`, JSON.stringify(article)).then(success).catch(fail);
}

function getModifyArticle(articleno, success, fail) {
  console.log(articleno);
  local.get(`/board/modify/${articleno}`).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
  local.put(`/board`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteArticle(articleno, success, fail) {
  local.delete(`/board/${articleno}`).then(success).catch(fail);
}

async function uploadFiles(id, selectedFiles, success, fail) {
  if (!selectedFiles.length) {
    // alert('파일을 선택해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append("id", id);
  for (let i = 0; i < selectedFiles.length; i++) {
    formData.append("files", selectedFiles[i]);
  }

  try {
    console.log("call upload file");
    await fetch(`${VITE_VUE_API_URL}/board/upload`, {
      method: "POST",
      body: formData,
    })
      .then(success)
      .catch(fail);
  } catch (e) {
    error({ message: "업로드 중 오류 발생" });
  }
}

function getFiles(articleno, success, fail) {
  local.get(`/board/${articleno}/files`).then(success).catch(fail);
}

async function downloadFile(param, success, fail) {
  try {
    console.log("call download file");
    const response = await fetch(`${VITE_VUE_API_URL}/board/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        saveFolder: param.saveFolder,
        originalFile: param.originalFile,
        saveFile: param.saveFile,
      }),
    });
    if (!response.ok) throw new Error("서버 오류");
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = param.originalFile; // 파일명 지정
    document.body.appendChild(a);
    a.click();
    a.remove(); // 다운로드 후 링크 제거
  } catch (e) {
    error({ message: "다운로드 중 오류 발생" });
  }
}

async function registFavorite(param, success, fail) {
  await local.post(`/board/favorite`, JSON.stringify(param)).then(success).catch(fail);
}

function getFavorite(param, success, fail) {
  local.get(`/board/favorite`, { params: param }).then(success).catch(fail);
}

async function deleteFavorite(param, success, fail) {
  await local.delete(`/board/favorite`, { params: param }).then(success).catch(fail);
}

function listFavorite(param, success, fail) {
  local.get(`/board/favorite/list`, { params: param }).then(success).catch(fail);
}

function getThumbnail(param, success, fail) {
  local.get(`/board/thumbnail`, { params: param }).then(success).catch(fail);
}

export {
  listArticle,
  detailArticle,
  registArticle,
  getModifyArticle,
  modifyArticle,
  deleteArticle,
  uploadFiles,
  getFiles,
  downloadFile,
  registFavorite,
  getFavorite,
  listFavorite,
  deleteFavorite,
  getThumbnail,
};
