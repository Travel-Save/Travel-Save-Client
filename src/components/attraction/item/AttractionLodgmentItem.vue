<!-- 
    숙박 : 
    "contentid": "1747867",
    "contenttypeid": "32",
    "goodstay": "0",
    "benikia": "0",
    "hanok": "0",
    "roomcount": "50실",
    "roomtype": "디럭스 패밀리룸",
    "refundregulation": "",
    "checkintime": "14:00",
    "checkouttime": "12:00",
    "chkcooking": "",
    "seminar": "0",
    "sports": "0",
    "sauna": "0",
    "beauty": "0",
    "beverage": "0",
    "karaoke": "0",
    "barbecue": "0",
    "campfire": "0",
    "bicycle": "0",
    "fitness": "0",
    "publicpc": "0",
    "publicbath": "0",
    "subfacility": "",
    "foodplace": "",
    "reservationurl": "",
    "pickup": "",
    "infocenterlodging": "02-561-9442",
    "parkinglodging": "주차 가능",
    "reservationlodging": "02-561-9442~5",
    "scalelodging": "",
    "accomcountlodging": ""
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
        <p class="card-text" v-if="attraction.address || attraction.eventplace">주소 : <span v-html="attraction.address"></span> <span v-html="attraction.eventplace"></span></p>
        <p class="card-text" v-if="attraction.roomcount">객실 수 : <span v-html="attraction.roomcount"></span></p>
        <p class="card-text" v-if="attraction.roomtype">객실 타입 : <span v-html="attraction.roomtype"></span></p>
        <p class="card-text" v-if="attraction.checkintime">체크인 : <span v-html="attraction.checkintime"></span></p>
        <p class="card-text" v-if="attraction.checkouttime">체크아웃 : <span v-html="attraction.checkouttime"></span></p>
        <p class="card-text" v-if="attraction.parkinglodging">주차 : <span v-html="attraction.parkinglodging"></span></p>
        <p class="card-text" v-if="attraction.reservationlodging">전화번호 : <span v-html="attraction.reservationlodging"></span></p>
      </div>
    </div>
  </div>
 </template>
 
 <style scoped>

 </style>
 