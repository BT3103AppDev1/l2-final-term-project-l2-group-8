import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDCuDC9lJoxIH3W40BFLFWKrOA2M0FTEDI",
    authDomain: "financetracker-6ff07.firebaseapp.com",
    projectId: "financetracker-6ff07",
    storageBucket: "financetracker-6ff07.appspot.com",
    messagingSenderId: "751809296128",
    appId: "1:751809296128:web:04b851f43d4f9ab211e5e5",
}

initializeApp(firebaseConfig);
createApp(App).use(router).mount('#app');