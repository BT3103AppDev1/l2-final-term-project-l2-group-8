import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Forum from '../views/Forum.vue';
import Product from "../views/FinancialProductPage.vue"
import Resetpass from '@/views/Resetpass.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/product",
        name: "product",
        component: Product
      }
    ]
})

export default router;