<!--
    음식점 : 
    "contentid": "2465041",
    "contenttypeid": "39",
    "seat": "",
    "kidsfacility": "0",
    "firstmenu": "대게정식/ 사시미코스",
    "treatmenu": "대게정식 / 사시미코스 / 대게 외",
    "smoking": "모두 금연석",
    "packing": "",
    "infocenterfood": "02-566-2525",
    "scalefood": "",
    "parkingfood": "주차 가능",
    "opendatefood": "2009.01.20",
    "opentimefood": "11:00 ~ 22:30",
    "restdatefood": "명절연휴",
    "discountinfofood": "",
    "chkcreditcardfood": "가능",
    "reservationfood": "전화 예약 문의 (02-566-2525)",
    "lcnsno": "20020105593"
 -->

<script setup>
defineProps({
  attraction: Object,
});
</script>

<template>
  <div class="row">
    <div class="col-md-4 w-25">
      <img :src="attraction.firstimage" class="img-fluid rounded-start" />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title" v-if="attraction.title"  v-html="attraction.title"></h5>
        <p class="card-text" v-if="attraction.address || attraction.eventplace">주소 : <span v-html="attraction.address"></span> <span v-html="attraction.eventplace"></span></p>
        <p class="card-text" v-if="attraction.firstmenu">메인 메뉴 : <span v-html="attraction.firstmenu"></span></p>
        <p class="card-text" v-if="attraction.opentimefood">운영시간 : <span v-html="attraction.opentimefood"></span></p>
        <p class="card-text" v-if="attraction.restdatefood">휴일 : <span v-html="attraction.restdatefood"></span></p>
        <p class="card-text" v-if="attraction.infocenterfood">전화번호 :<span v-html="attraction.infocenterfood"></span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
