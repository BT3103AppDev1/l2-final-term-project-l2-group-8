import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: () => import("../views/HomePage.vue")},
        {path: "/SignUp", component: () => import("../views/SignUp.vue")},
        {path: "/SignIn", component: () => import("../views/SignIn.vue")},
        {path: "/PasswordReset", component: () => import("../views/PasswordReset.vue")},
    ]
});
export default router;