<!-- 
레포츠 :
contentid": "595579",
"contenttypeid": "28",
"openperiod": "",
"reservation": "홈페이지 : <a href=\"http://www.gyyc.kr \" target=\"_blank\" title=\"새창 : 역삼청소년수련관 홈페이지로 이동\">http://www.gyyc.kr</a><br />\n전화 문의 : 02-550-3600, 02-550-3650",
"infocenterleports": "스포츠문화팀 02-550-3632",
"scaleleports": "",
"accomcountleports": "",
"restdateleports": "공휴일",
"usetimeleports": "06:00~20:50",
"usefeeleports": "[ 일일입장 ] 성인 5,500 / 청소년 3,000원",
"expagerangeleports": "",
"parkingleports": "",
"parkingfeeleports": "",
"chkbabycarriageleports": "없음",
"chkpetleports": "없음",
"chkcreditcardleports": "없음"

-->

<script setup>
defineProps({
  attraction: Object,
})

</script>

<template>
  <div class="row">
    <div class="col-md-4 w-25">
      <img :src="attraction.firstimage" class="img-fluid rounded-start" />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title" v-if="attraction.title" v-html="attraction.title"></h5>
        <p class="card-text" v-if="attraction.address || attraction.eventplace">주소 : <span
            v-html="attraction.address"></span> <span v-html="attraction.eventplace"></span></p>
        <p class="card-text" v-if="attraction.usefeeleports">가격 : <span v-html="attraction.usefeeleports"></span></p>
        <p class="card-text" v-if="attraction.usetimeleports">운영시간 : <span v-html="attraction.usetimeleports"></span>
        </p>
        <p class="card-text" v-if="attraction.restdateleports">휴일 : <span v-html="attraction.restdateleports"></span>
        </p>
        <p class="card-text" v-if="attraction.infocenterleports">운영기관 : <span
            v-html="attraction.infocenterleports"></span></p>
        <p class="card-text" v-if="attraction.eventstartdate">시작일자 :<span v-html="attraction.eventstartdate"></span></p>
        <p class="card-text" v-if="attraction.eventenddate">종료일자 :<span v-html="attraction.eventenddate"></span></p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
