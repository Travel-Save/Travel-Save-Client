<script setup>
import { ref } from "vue";
import axios from "axios";
import OpenAI from "openai";
import { WechatOutlined } from "@ant-design/icons-vue";
import { getSavingProduct } from "@/api/openai";
import Swal from "sweetalert2";
import { error } from "@/api/common";
const props = defineProps({
  userPlans: Array,
});

const planFormat = ref([]);

const planResponse = ref(null);
const productResponse = ref(null);
const { VITE_OPEN_AI_SERVICE_KEY } = import.meta.env;

const planAIFormat = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강화도 여행 경비 계산</title>
    <style>
        .result {
            max-width: 800px;
            margin: auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .h1, .h2 {
            color: #333;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #f4f4f4;
        }
        .total {
            font-weight: bold;
            color: #d9534f;
        }
        .note {
            font-style: italic;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="result">
        <h1 class="h1">여행 경비 계산</h1>
        <br>
        <h2>?일차 계획</h2>
        <table>
            <thead>
                <tr>
                    <th>순서</th>
                    <th>장소</th>
                    <th>주요 명소 및 즐길거리</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <br>
        <h2 class="h2">남은 일차 추천</h2>
        <table>
            <thead>
                <tr>
                    <th>장소</th>
                    <th>주요 명소 및 즐길거리</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                ...
            </tbody>
        </table>
        <br>
        <h2 class="h2">전체 여행 경비 계산</h2>
        <table>
            <thead>
                <tr>
                    <th>항목</th>
                    <th>세부사항</th>
                    <th>비용</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>교통</td>
                    <td></td>
                    <td>약</td>
                </tr>
                <tr>
                    <td>숙박</td>
                    <td>4일 (펜션)</td>
                    <td>약</td>
                </tr>
                <tr>
                    <td>식비</td>
                    <td>4일간 1인당 약 30,000원/일</td>
                    <td>약</td>
                </tr>
                <tr>
                    <td>관광 및 활동</td>
                    <td>관광지 입장료, 체험 활동 등</td>
                    <td>약 </td>
                </tr>
                <tr>
                    <td>기타 경비</td>
                    <td>기념품, 예비 경비 등</td>
                    <td>약 </td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="total"><td colspan="2">총 경비</td><td>약 <span id="total_price">1,610,000</span>원</td></tr>
                <tr><td colspan="3" class="note">※ 실제 비용은 변동될 수 있습니다.</td></tr>
            </tfoot>
        </table>
        <br>
        <p class="total">예산한도와의 차이: 예산한도 - 총경비 = 원</p>
    </div>
    <p class="total">주의: 실제 비용은 항공권, 숙박, 렌트카 등의 예약 시기 및 상황에 따라 변동될 수 있으므로 실제 경비는 사전 조사를 통해 확정하시기 바랍니다.<p>
</body>
</html>`;

const productAIFormat = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>여행 예/적금 상품 추천</title>
    <style>
        .result {
            max-width: 800px;
            margin: auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .h1 {
            color: #333;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #f4f4f4;
        }
    </style>
</head>
<body>
<div class="result">
    <h1 class="h1">여행 예적금 상품 추천</h1>
    <table>
        <thead>
        <tr>
            <th>상품명</th>
            <th>은행</th>
            <th>금리</th>
            <th>우대금리</th>
            <th>저축 기간</th>
            <th>납입 한도</th>
            <th>추천 이유</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>헤이(Hey)정기예금</td>
            <td>수협은행</td>
            <td>3.2%</td>
            <td>6%</td>
            <td>12개월</td>
            <td>1,000,000원</td>
            <td>
                기본금리가 높고 다양한 우대금리가 있어 총금리가 높은 상품. 여행 경비를 위한 저축에 적합.
            </td>
        </tr>
        <tr>
            <td></td
            <td>주식회사 카카오뱅크</td>
            <td>3.8%</td>
            <td>5.8%</td>
            <td>12개월</td>
            <td>30,000원 (1일 1회만 입금 가능)</td>
            <td>
                기본금리와 보너스 우대금리가 좋은 상품. 제한된 납입 한도로 여행 경비를 차근차근 모을 수 있음.
            </td>
        </tr>
        <tr>
            <td></td>
            <td>중소기업은행</td>
            <td>3.6%</td>
            <td>4.5%</td>
            <td>12개월</td>
            <td>1,000,000원</td>
            <td>
                기본금리가 높으며, 다양한 우대금리 조건으로 최종 금리를 높일 수 있음.
            </td>
        </tr>
        <tr>
            <td></td>
            <td>KB국민은행</td>
            <td>2.9%</td>
            <td>3.1%</td>
            <td>6개월</td>
            <td>제한 없음</td>
            <td>
                기본금리는 중간 수준이나, 다양한 우대금리 조건으로 비교적 높은 금리를 제공.
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        </tbody>
    </table>
</div>
</body>
</html>
`;

const options = ref([
  { value: "렌트" },
  { value: "비행기" },
  { value: "도보" },
  { value: "시내버스" },
  { value: "고속버스" },
  { value: "택시" },
  { value: "지하철" },
  { value: "열차" },
]);

const form = ref({
  personnel: "",
  transportation: [],
  lodgment: "",
  limit: 0,
  date: [],
});

const rules = {
  personnel: [
    {
      required: true,
      message: "Please enter personnel",
    },
  ],
  transportation: [
    {
      required: true,
      message: "please select an trasportation",
    },
  ],
  lodgment: [
    {
      required: true,
      message: "Please select an lodgment",
    },
  ],
  limit: [
    {
      required: true,
      message: "Please choose the limit",
    },
  ],
  date: [
    {
      required: true,
      message: "Please choose the date",
    },
  ],
  startArea: [
    {
      required: true,
      message: "Please enter startArea",
    },
  ],
};

const handleChange = (value) => {
  form.value.transportation = value;
};

const open = ref(false);

const showDrawer = () => {
  open.value = true;
};
const onClose = () => {
  open.value = false;
};

/** 여행 계획 일차별로 문자열 형태로 변환 */
let requestDataFormat = "";
const planFormatter = () => {
  let day = 1;
  let addressNo = 1;
  props.userPlans.forEach((plans) => {
    if (plans.length > 0) {
      requestDataFormat += `${day}일차 : \n 주소 : `;
      plans.forEach((plan) => {
        requestDataFormat += `${addressNo}. ${plan.addr1}\n`;
        addressNo++;
      });
      addressNo = 1;
      day++;
    }
  });
};

/** 여행 계획 일차별로 문자열 형태로 변환 */

/** 여행 경비 계산 */
const message = ref([]);
const startDate = ref("");
const endDate = ref("");
const resultDate = ref("");
// API 호출 함수 (response : 반응형 객체)
const getGPTResponse = async (message, response) => {
  if (response.value !== "") response.value = "";
  try {
    const openai = new OpenAI({
      apiKey: VITE_OPEN_AI_SERVICE_KEY,
      dangerouslyAllowBrowser: true,
    });
    const result = await openai.chat.completions.create({
      messages: message,
      model: "gpt-4o",
    });
    response.value = result.choices[0].message.content.replaceAll("```", "").replace("html", "");
    console.log("chatGPT 결과: ", result.choices[0].message.content);
  } catch ({ errorResponse }) {
    response.value = null;
    console.log("chatGPT: 🚨 에러가 발생했습니다." + errorResponse);
    error({ message: "죄송합니다 처리 중 에러가 발생하였습니다." });
  }
};
/** 여행 경비 계산 */

/** 예/적금 데이터 호출 */
const getSavingProductData = async (price, response) => {
  console.log(price, response);
  // kor_co_nm : 은행명
  // fin_prdt_nm : 상품명
  // join_way : 가입방법
  // mtrt_int : 이자율
  // spcl_cnd : 우대금리
  // join_member: 가입대상
  // etc_note: 추가설명
  // max_limit : 납입 한도
  // intr_rate_type : 금리 유형
  // intr_rate_type_nm : 금리 유형명
  // save_trm : 저축 기간 [개월]
  // rsrv_type_nm : 적립 유형
  // intr_rate : 기본금리
  // intr_rate2 : 최대금리
  message.value = [];

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const params = {
    totalPrice: price,
    now: `${year}-${month}-${day}`,
    startDate: `${startDate.value.getFullYear()}-${startDate.value.getMonth() + 1
      }-${startDate.value.getDate()}`,
  };
  console.log(params.now);
  const productsFormat = ref("");
  await getSavingProduct(
    params,
    ({ data }) => {
      console.log(data);
      productsFormat.value += "예/적금 상품 리스트 \n";
      let no = 1;
      data.forEach((product) => {
        productsFormat.value += `${no++}.\n
        상품명 : ${product.kor_co_nm}\n
        가입방법 : ${product.join_way}\n
        이자율 : ${product.mtrt_int} \n
        우대금리 : ${product.spcl_cnd} \n
        가입대상 : ${product.join_member} \n
        추가설명 : ${product.etc_note} \n
        납입 한도 : ${product.max_limit} \n
        금리 유형 : ${product.intr_rate_type} \n
        금리 유형명 : ${product.intr_rate_type_nm} \n
        저축 기간 [개월] : ${product.save_trm} \n
        적립 유형 : ${product.rsrv_type_nm} \n
        기본금리 : ${product.intr_rate} \n
        최대금리 : ${product.intr_rate2} \n
        `;
      });
      console.log(productsFormat.value);
    },
    () => {
      console.log(error({ message: "죄송합니다. 처리 중 에러가 발생하였습니다." }));
    }
  );

  message.value.push({
    role: "user",
    content: `
          GPT가 추천해준 여행 경비 내역은 ${response}이며,
          현재 예상 비용이 ${params.totalPrice}이고,
          아래는 내가 가지고 있는 예적금 상품이야
          ${productsFormat.value}

          너는 지금 예/적금 상품을 추천해주는 은행원이라고 가정할 때
          나는 예상비용을 모으기 위한 예/적금 상품을 가입하고싶어.
          이 여행에 적합한 예/적금상품을 나열해주고 그 이유를 알려줘

          밑에는 응답 요구사항이야
          1. 응답 데이터는 HTML형식으로 디자인해서 보기좋게 보여줘
          2. HTML 테이블 크기에 맞게 글자크기를 맞춰줬으면 좋겠어
          3. 내가 가지고 있는 예적금상품이 아니어도 괜찮아 더 괜찮은 상품이 있다면 추천해줘
          `,
  });
  message.value.push({
    role: "assistant",
    content: productAIFormat,
  });
  getGPTResponse(message.value, productResponse);
};
/** 예/적금 데이터 호출 end */

/** 첫 검색 시, 여행 계획에 대한 경비 및 예/적금 상품 제공 여부 확인 */
const priceNumber = ref(0);
const getTotalResponse = async () => {
  /** 여행 경비 계산 */

  planResponse.value = "";
  productResponse.value = null;
  message.value = [];
  planFormatter();
  startDate.value = form.value.date[0].$d;
  endDate.value = form.value.date[1].$d;
  resultDate.value = `${startDate.value.getFullYear()}/${startDate.value.getMonth() + 1
    }/${startDate.value.getDate()} ~ ${endDate.value.getFullYear()}/${endDate.value.getMonth() + 1
    }/${endDate.value.getDate()}`;
  message.value.push({
    role: "user",
    content: `
          여행경비를 알고싶어
          여행경로 : ${requestDataFormat},
          인원 : ${form.value.personnel}명,
          이동수단 : ${form.value.transportation},
          선호 숙박시설 : ${form.value.lodgment},
          출발지 : ${form.value.lodgment}
          예산한도 : ${form.value.limit} 만원,
          여행기간 : ${resultDate.value}
          너의 직업은 여행 계획 플래너야
          요구사항을 말해줄게
          1. HTML말고 추가적인 설명은 안해줘도 될거 같아 추가로 style에 body랑 container는 안줬으면 좋겠어
          2. 위에 데이터에서 여행경로에 있는 일차와 주소는 그 일차에 가려고 계획중인 주소야 이에대한 데이터를 가지고 여행경로 일차에 대한 계획을 짜주고
          3. 여행지 주변에 유명명소나 즐길거리, 먹거리 등이 있다면 추천해주는데 예상 경비를 계산해서 답변 전체를 HTML 테이블 형태로 이쁘게 디자인 해서 만들어줘
          4. 여행 계획이랑 여행일수랑 차이가 있을수도 있어 만약 차이가 난다면 남은 일수에 대해 주변 관광지나 먹거리, 즐길거리 등을 추천 해줬으면 좋겠어
          5. 숙박을 제외한 다른 데이터의 계산값은 여행 일수로 계산해줘
          6. 총 경비에는 숫자만 span으로 감싸서 id값을 total_price로 넣어줘
          7. 교통비는 출발지에서 여행경로를 기준으로 계산해줘
          8. 이외에 필요하다 생각되는것도 추가적으로 넣어줘도 좋아`,
  });
  message.value.push({
    role: "assistant",
    content: planAIFormat,
  });

  // 예상 여행 경비 계산
  await getGPTResponse(message.value, planResponse);

  /** 여행 경비 계산 end */

  /** 예/적금 상품 조회 */
  // HTML 요소 선택
  const priceElement = document.getElementById("total_price");
  console.log(priceElement);
  // 텍스트 내용 가져오기
  const priceText = priceElement.innerText || priceElement.textContent;

  // 텍스트에서 숫자만 추출하기 (쉼표 제거)
  const priceValue = priceText.replace(/,/g, "");

  // 숫자로 변환
  priceNumber.value = parseInt(priceValue, 10);
  // 예/적금 상품 추천 (confirm alert 로 체크)
  await Swal.fire({
    title: "경비에 맞는 예/적금 상품을 추천해드릴까요?",
    icon: "question",
    iconHtml: "؟",
    confirmButtonText: "네 추천해주세요!",
    cancelButtonText: "아뇨 다음에 받을게요",
    showSuccessButton: true,
    showCancelButton: true,
  })
    .then((result) => {
      if (result.isConfirmed) getSavingProductData(priceNumber.value, planResponse.value);
    })
    .catch(() => {
      error("죄송합니다 처리 중 에러가 발생하였습니다.");
    });

  console.log(priceNumber.value);
  /** 예/적금 상품 조회 end */
};
/** 첫 검색 시, 여행 계획에 대한 경비 및 예/적금 상품 제공 여부 확인 end*/
</script>

<template>
  <div class="chat-container">
    <a-button class="button" type="primary" @click="showDrawer">
      <template #icon>
        <font-awesome-icon class="icon" :icon="['fas', 'piggy-bank']" />
      </template>
    </a-button>
    <a-drawer title="여행 경비 추천" :width="900" :open="open" :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }" placement="left" @close="onClose" :mask="false">
      <a-form :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="인원(명)" name="personnel">
              <a-input v-model:value="form.personnel" placeholder="personnel" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="이동수단" name="transportation">
              <a-select v-model:value="form.transportation" mode="multiple" style="width: 100%" :options="options"
                @change="handleChange"></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="선호 숙박시설" name="lodgment">
              <a-select v-model:value="form.lodgment" placeholder="lodgment">
                <a-select-option value="호텔">호텔</a-select-option>
                <a-select-option value="펜션">펜션</a-select-option>
                <a-select-option value="모텔">모텔</a-select-option>
                <a-select-option value="게스트하우스">게스트하우스</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="출발지" name="startArea">
              <a-input v-model:value="form.startArea" placeholder="출발지" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="예산한도 (단위:만원)" name="limit">
              <a-input-number v-model:value="form.limit" size="large" :min="1" :max="100000" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="여행 기간" name="date">
              <a-range-picker v-model:value="form.date" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" @click="getTotalResponse">예상 경비 확인</a-button>
      </a-form>
      <template #extra> </template>

      <div class="loading" v-if="planResponse === ''">
        <img src="@/assets/ai-loading.gif" />
      </div>
      <div class="mt-4" v-html="planResponse"></div>
      <div class="loading" v-if="productResponse === ''">
        <img src="@/assets/product-ai-loading.gif" />
      </div>
      <div class="mt-4" v-html="productResponse"></div>
      <a-space v-if="planResponse && productResponse === null">
        <a-button type="dashed" @click="getSavingProductData(priceNumber, planResponse)">예/적금 상품 추천 받기</a-button>
      </a-space>
    </a-drawer>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.chat-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 2;
}

.button {
  width: 50px;
  height: 50px;
}

.icon {
  font-size: 24px;
}

.code-box-demo .ant-slider {
  margin-bottom: 16px;
}

.loading {
  margin-top: 30px;
  width: 400px;
  margin: auto;
}
</style>
