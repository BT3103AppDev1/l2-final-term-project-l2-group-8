<template>
    <div id="container">
        <h1>User Sign In</h1><br>
        <form class="form" @submit.prevent="signIn">
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
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";

// Initialize refs for email and password
const email = ref("");
const password = ref("");
const auth = getAuth();

// Define the signIn function
const signIn = async (event) => {
    console.log("Attempting to sign in");

    // Prevent default form submission behavior
    event.preventDefault();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("Sign-in successful, navigating to /forum");
        await router.push("/forum");
        console.log("Navigation to /forum successful");
    } catch (error) {
        console.error("Sign-in failed:", error);
        // Alert the error message only if it is not about a page navigation cancellation
        if (error.message !== "NavigationDuplicated: Avoided redundant navigation to current location: \"/forum\".") {
            alert(error.message);
        }
    }
};

// Define the signInWithGoogle function (implementation depends on your setup)
const signInWithGoogle = () => {
};

</script>