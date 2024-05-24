<!-- 
        문화시설 : 
        "contentid": "719514",
        "contenttypeid": "14",
        "scale": "이용자 검색 PC : 5대 <br />\n도서 열람석 : 18석 (랩탑전용 6석)<br />\n세미나실 : 3실",
        "usefee": "무료",
        "discountinfo": "",
        "spendtime": "",
        "parkingfee": "",
        "infocenterculture": "02-2189-2681",
        "accomcountculture": "",
        "usetimeculture": "10:00~17:00(점심시간 12:00~13:00)",
        "restdateculture": "공휴일 / 대체휴무일 / 창립기념일(12.9)",
        "parkingculture": "주차 불가",
        "chkbabycarriageculture": "없음",
        "chkpetculture": "불가",
        "chkcreditcardculture": "없음"

 -->

 <script setup>
defineProps({
        attraction : Object,
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
        <p class="card-text" v-if="attraction.address">주소 : <span v-html="attraction.address"></span></p>
        <p class="card-text" v-if="attraction.scale">규모 : <span v-html="attraction.scale"></span></p>
        <p class="card-text" v-if="attraction.usefee">가격 : <span v-html="attraction.usefee"></span></p>
        <p class="card-text" v-if="attraction.usetimeculture">운영시간 : <span v-html="attraction.usetimeculture"></span></p>
        <p class="card-text" v-if="attraction.restdateculture">휴일 : <span v-html="attraction.restdateculture"></span></p>
        <p class="card-text" v-if="attraction.infocenterculture">전화번호 : <span v-html="attraction.infocenterculture"></span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
