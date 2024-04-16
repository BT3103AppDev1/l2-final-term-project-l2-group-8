<template>
    <div id="container">
        <h1>User Sign In</h1><br>
        <form class="form">
            <div class="form-item">
                <span class="form-item-icon material-symbols-rounded">mail</span>
                <input type="text" placeholder="Enter your email" v-model="email">
            </div>
            <div class="form-item">
                <span class="form-item-icon material-symbols-rounded">lock</span>
                <input type="password" placeholder="Enter your password" v-model="password">
            </div>
            <div class="form-item-other">
                <button @click="signIn">Sign In</button>
            </div> 
            <div class="form-item-other">
                <button @click="signInWithGoogle">Sign In With Google</button>
            </div>   
        </form>
    </div>
</template>

<script setup>
import {ref} from "vue";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import router from "@/router";

const email = ref("");
const password = ref("");
const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    router.push("/forum")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    alert(errorCode);
  });
const signInWithGoogle = () => {
    
};
</script>