import { localAxios } from "@/util/http-commons";
import { success, error } from "@/api/common.js";

const local = localAxios();

async function getSavingProduct(param, success, fail) {
  await local.get(`/search/product`, { params: param }).then(success).catch(fail);
}
export { getSavingProduct };
