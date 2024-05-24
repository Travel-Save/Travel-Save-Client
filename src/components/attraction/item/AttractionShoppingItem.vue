<!-- 
    쇼핑 : 
    "contentid": "2911908",
    "contenttypeid": "38",
    "saleitem": "향수 및 화장품",
    "saleitemcost": "",
    "fairday": "월~일요일",
    "opendateshopping": "",
    "shopguide": "환급서비스 제공방식 : 즉시+사후",
    "culturecenter": "",
    "restroom": "",
    "infocentershopping": "02-2642-5290",
    "scaleshopping": "",
    "restdateshopping": "명절",
    "parkingshopping": "불가능",
    "chkbabycarriageshopping": "",
    "chkpetshopping": "",
    "chkcreditcardshopping": "가능",
    "opentime": "08:00-22:00"
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
        <h5 class="card-title" v-if="attraction.title"  v-html="attraction.title"></h5>
        <p class="card-text" v-if="attraction.address">주소 : <span v-html="attraction.address"></span></p>
        <p class="card-text" v-if="attraction.saleitem">판매제품 : <span v-html="attraction.saleitem"></span></p>
        <p class="card-text" v-if="attraction.fairday">운영시간 : <span v-html="attraction.fairday"></span></p>
        <p class="card-text" v-if="attraction.restdateshopping">휴일 : <span v-html="attraction.restdateshopping"></span></p>
        <p class="card-text" v-if="attraction.infocentershopping">전화번호 : <span v-html="attraction.infocentershopping"></span></p>
        <p class="card-text" v-if="attraction.shopguide">운영안내 : <span v-html="attraction.shopguide"></span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
