<template>
    <div id="container">
        <h1>Create an Account</h1><br>
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
                <button @click="register">Register</button>
            </div> 
            <div class="form-item-other">
                <button @click="signInWithGoogle">Sign In With Google</button>
            </div>   
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

// Initialize refs for email and password
const email = ref('');
const password = ref('');

// Initialize Firebase Auth and Vue Router
const auth = getAuth();
const router = useRouter();

// Define the register function
const register = async () => {
    event.preventDefault();
    try {
        // This will now only be called when the user clicks the "Register" button
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        router.push('/forum');
    } catch (error) {
        alert(error.message);
        console.log(error.code);
    }
};

// Define the signInWithGoogle function (if needed)
const signInWithGoogle = () => {
    // Your Google sign-in logic here
};

</script>