import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Forum from '../views/Forum.vue';

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
      }
    ]
})

export default router;



