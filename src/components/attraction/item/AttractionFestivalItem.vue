<!-- 
    축제/공연/행사 : 
    "contentid": "3024325",
    "contenttypeid": "15",
    "sponsor1": "과학기술정보통신부",
    "sponsor1tel": "070-4245-7738",
    "sponsor2": "정보통신기획평가원, 인공지능혁신허브,고려대학교, 서울시",
    "sponsor2tel": "070-4245-7738",
    "eventenddate": "20231103",
    "playtime": "10:00 ~ 18:00",
    "eventplace": "조선팰리스강남 더그레이트홀",
    "eventhomepage": "",
    "agelimit": "",
    "bookingplace": "",
    "placeinfo": "",
    "subevent": "",
    "program": "",
    "eventstartdate": "20231102",
    "usetimefestival": "무료",
    "discountinfofestival": "",
    "spendtimefestival": "",
    "festivalgrade": ""
     -->

 <script setup>
 defineProps({
         attraction : Object,
 })
 
 
 </script>
 
 <template>
  <div class="row">
    <div class="col-md-4 w-25" v-if="attraction.firstimage">
      <img :src="attraction.firstimage" class="img-fluid rounded-start" />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title" v-if="attraction.title"  v-html="attraction.title"></h5>
        <p class="card-text" v-if="attraction.address || attraction.eventplace">주소 : <span v-html="attraction.address"></span> <span v-html="attraction.eventplace"></span></p>
        <p class="card-text" v-if="attraction.usetimefestival">가격 : <span v-html="attraction.usetimefestival"></span></p>
        <p class="card-text" v-if="attraction.playtime">운영시간 : <span v-html="attraction.playtime"></span></p>
        <p class="card-text" v-if="attraction.sponsor1">운영기관 : <span v-html="attraction.sponsor1"></span></p>
        <p class="card-text" v-if="attraction.sponsor1tel">전화번호 : <span v-html="attraction.sponsor1tel"></span></p>
        <p class="card-text" v-if="attraction.eventstartdate">시작일자 :<span v-html="attraction.eventstartdate"></span></p>
        <p class="card-text" v-if="attraction.eventenddate">종료일자 :<span v-html="attraction.eventenddate"></span></p>
      </div>
    </div>
  </div>
 </template>
 
 <style scoped>

 </style>
 