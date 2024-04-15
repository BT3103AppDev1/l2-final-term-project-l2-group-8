<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Enter your email" v-model="email"></p>
    <p><input type="password" placeholder="Enter your password" v-model="password"></p>
    <p><button @click="register">Register</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>
</template>

<script setup>
import {ref} from "vue";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {useRouter} from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();
const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
        console.log("Successfully registered!");
        console.log(data);
        router.push("/ResetPassword")
    })
    .catch((error) => {
        console.log(error.code);
        alert(error.message);
    })
};
const signInWithGoogle = () => {

};
</script>