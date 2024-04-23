<template>

    <body>
        <div id="container">
            <h1>Reset Password</h1><br>
            <form class="form">
                <div class="form-item">
                    <span class="form-item-icon material-symbols-rounded">mail</span>
                    <input type="text" placeholder="Enter your email" v-model="email">
                </div><br>
                <div class="form-item-button">
                    <button @click="sendEmail">Send Email</button>
                </div>
                <div class="footer">
                    <button id="signIn" @click="signIn">Back to Log in</button>
                    <button id="register" @click="register">Create an Account</button>
                </div>
            </form>
        </div>
    </body>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from "@/router";

const email = ref("");
const auth = getAuth();

const sendEmail = async (event) => {
    event.preventDefault();
    try {
        await sendPasswordResetEmail(auth, email.value);
        alert("Password reset email sent!")
    } catch (error) {
        alert("Failed to send email! Please check your email!");
        console.log(error.code);
    }
}

const signIn = () => {
    router.push("/");
};

const register = () => {
    router.push("/register");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
body {
    background: linear-gradient(to right top, #49eded, #95d52d);
    background-size: cover;
    min-height: 102vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -20px;
    padding:0;
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
    margin:5px 0 0 0;
}
button:hover {
    background-color: #aaaaaa;
}

.footer {
    text-align: center;
    position: absolute;
    left:0;
    right:0;
    margin-top: 4rem;
}

#signIn,
#register {
    background: none;
    width: 25%;
    flex: 1;
    margin: 0 3.5rem;
    font-size: smaller;
    text-decoration: underline;
    color:gray
}

#signIn:hover,
#register:hover{
    color:black
}

</style>