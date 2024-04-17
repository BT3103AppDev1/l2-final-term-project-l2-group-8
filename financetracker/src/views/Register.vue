<template>
    <body>
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
                </div><br>
                <div class="form-item-other">
                    <button @click="register">Register</button>
                </div> 
                <!-- <div class="form-item-other">
                    <button @click="signInWithGoogle">Sign In With Google</button>
                </div> -->
                <div class="form-item-other">
                    <button @click="logIn">User Log In</button>
                </div>    
            </form>
        </div>
    </body>
</template>

<script setup>
import { ref } from 'vue';
import { 
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { useRouter } from 'vue-router';

// Initialize refs for email and password
const email = ref('');
const password = ref('');

// Initialize Firebase Auth and Vue Router
const auth = getAuth();
const router = useRouter();

// Define the register function
const register = async (event) => {
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

const logIn = () => {
    router.push("/");
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