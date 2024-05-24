import axios from "axios";
import { findObject } from "./common";
import { localAxios } from "@/util/http-commons";

const local = localAxios();
const { VITE_TRIP_API_URL, VITE_TRIP_WITH_API_URL } = import.meta.env;

function getAttractionList(config, success, fail) {
  axios
    .get(VITE_TRIP_API_URL + config.link, { params: { ...config.condition } })
    .then(success)
    .catch(fail);
}

function getGugunList(config, success, fail) {
  axios
    .get(VITE_TRIP_API_URL + config.link, { params: { ...config.condition } })
    .then(success)
    .catch(fail);
}

async function getAttractionDetail(config, success, fail) {
  await axios
    .get(VITE_TRIP_API_URL + config.link, { params: { ...config.condition } })
    .then(({ data }) => {
      if (findObject(data, "resultCode") === "0000") {
        success({ data });
      } else {
        throw new Error("Invalid resultCode");
      }
    })
    .catch(fail);
}

async function getAttractionWith(config, success, fail) {
  await axios
    .get(VITE_TRIP_WITH_API_URL + config.link, { params: { ...config.condition } })
    .then(({ data }) => {
      if (findObject(data, "resultCode") === "0000") {
        success({ data });
      } else {
        console.log(data);
        throw new Error("Invalid resultCode");
      }
    })
    .catch(fail);
}

async function registAttractionFavorite(param, success, fail) {
  await local.post(`/attraction/favorite`, JSON.stringify(param)).then(success).catch(fail);
}

async function getAttractionFavorite(param, success, fail) {
  await local.get(`/attraction/favorite`, { params: param }).then(success).catch(fail);
}

async function deleteAttractionFavorite(param, success, fail) {
  await local.delete(`/attraction/favorite`, { params: param }).then(success).catch(fail);
}

async function listAttractionFavorite(param, success, fail) {
  await local.get(`/attraction/favorite/list`, { params: param }).then(success).catch(fail);
}

export {
  getAttractionList,
  getGugunList,
  getAttractionDetail,
  getAttractionWith,
  registAttractionFavorite,
  getAttractionFavorite,
  deleteAttractionFavorite,
  listAttractionFavorite,
};
