import { createApp } from 'vue'
import App from './App.vue'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'
// import Vuetify from 'vuetify'; // Import Vuetify
// import 'vuetify/dist/vuetify.min.css'; // Import Vuetify styles
import router from './router/index.js'

createApp(App).use(router).use(VueChartkick).mount('#app')