import { createApp } from 'vue'
import App from './App.vue'
// import Vuetify from 'vuetify'; // Import Vuetify
// import 'vuetify/dist/vuetify.min.css'; // Import Vuetify styles
import router from './router/index.js'

createApp(App).use(router).mount('#app')