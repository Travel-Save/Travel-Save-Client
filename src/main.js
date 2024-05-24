// import "./assets/main.css";
import { DatePicker } from "ant-design-vue";
import { createApp } from "vue";
import { createPinia } from "pinia";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Swiper, SwiperSlide } from 'swiper/vue';

import { register } from 'swiper/element/bundle';

import App from "./App.vue";
import router from "./router";

import "ant-design-vue/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "ant-design-vue/dist/reset.css";

const app = createApp(App);

register();

library.add(fas, far, fab);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('swiper-container', Swiper);
// app.component('swiper-container', SwiperContainer);
app.component('swiper-slide', SwiperSlide);

app.use(createPinia());
app.use(router);

app.mount("#app");
app.use(DatePicker);
