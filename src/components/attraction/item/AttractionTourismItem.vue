<!--
    관광지 :  
    "contentid": "2646372",
    "contenttypeid": "12",
    "heritage1": "0",
    "heritage2": "0",
    "heritage3": "0",
    "infocenter": "02-6326-0881",
    "opendate": "",
    "restdate": "연중무휴",
    "expguide": "",
    "expagerange": "",
    "accomcount": "",
    "useseason": "",
    "usetime": "11:00~22:00",
    "parking": "[대승주차장]<br>월요일~토요일, 10:00~18:00<br>[스파 도향 주차장]<br>일요일, 2시간 3,000원",
    "chkbabycarriage": "없음",
    "chkpet": "없음",
    "chkcreditcard": "없음" -->

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
        <p class="card-text" v-if="attraction.address">주소 : <span v-html="attraction.address"></span></p>
        <p class="card-text" v-if="attraction.usetime">운영시간 : <span v-html="attraction.usetime"></span></p>
        <p class="card-text" v-if="attraction.restdate">휴일 : <span v-html="attraction.restdate"></span></p>
        <p class="card-text" v-if="attraction.parking">주차 : <span v-html="attraction.parking"></span></p>
        <p class="card-text" v-if="attraction.infocenter">전화번호 : <span v-html="attraction.infocenter"></span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
