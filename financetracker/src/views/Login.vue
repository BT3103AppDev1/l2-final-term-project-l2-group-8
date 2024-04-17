<template>
    <body>
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
                </div><br>
                <div class="form-item-other">
                    <button @click="signIn">Sign In</button>
                </div> 
                <!-- <div class="form-item-other">
                    <button @click="signInWithGoogle">Sign In With Google</button>
                </div> -->
                <div class="form-item-other">
                    <button @click="register">Create An Account</button>
                </div>  
            </form>
        </div>
    </body>
</template>

<script setup>
import { ref } from "vue";
import {
    getAuth, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
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
// const signInWithGoogle = async (event) => {
//     event.preventDefault();
//     try {
//         const provider = new GoogleAuthProvider();
//         const userCredential = await signInWithPopup(auth, provider);
//         const user = userCredential.user;
//         router.push("/forum");
//     } catch (error) {
//         alert(error.message);
//         console.log(error.code);
//     }
// };

const register = () => {
    router.push("/register");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
body {
    background: linear-gradient(to right top, #49eded, #95d52d);
    background-size: cover;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
}
#container {
    width: 300px;
    height: 300px;
    padding: 100px;
    background-color: #ffffff77;
    border-radius: 10px;
    position: relative;
}
h1 {
    text-align: center;
}
.form {
    text-align: center;
}
a {
    color: #000000;
}
a:focus {
    color: #0000ff;
}
.form-item-icon {
    position: relative;
    top: 7px;
}
input {
    border: none;
    outline: none;
    background-color: #ffffffaa;
    height: 20px;
    width: 160px;
    border-radius: 20px;
    padding: 5px;
    margin: 5px;
}
input:focus {
    background-color: #ffffff;
}
button {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 200px;
    border-radius: 40px;
    font-size: 15px;
    margin: 5px 0 0 0;
}
button:hover {
    background-color: #aaaaaa;
}
</style>