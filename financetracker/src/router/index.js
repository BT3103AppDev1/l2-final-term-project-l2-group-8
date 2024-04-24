import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Forum from '../views/Forum.vue';
import Resetpass from '@/views/Resetpass.vue';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/register",
        name: "register",
        component: Register
      },
      {
        path: "/",
        name: "login",
        component: Login
      },
      {
        path: "/forum",
        name: "forum",
        component: Forum
      },
      {
        path: "/resetpass",
        name: "resetpass",
        component: Resetpass
      },
      {
        path: "/home",
        name: "home",
        component: Home
      },
      {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
    }
    ]
})

export default router;