<template>
    <!-- <div style="text-align:center;">    
        <h1  id = "mainHead">CRYPTO PAPER PORTFOLIO</h1>
        container to place firebase ui
        <div id= "firebaseui-auth-container"></div>
        <div id="pagecontent">
            Crypto Paper Portfolio (CPP) is an app to track your crypto portfolio. <br>
            Enter coin details and get real time Profit and Loss update of your Portfolio.
        </div>
        <img id = "bg" src="@/assets/Coins2.png" alt="" class="center">
        <h5>copyright@cpp-2023</h5>
    </div>    -->
    <body>
        <div class="container">
            <div class="login-card">
                <div class="header">
                    <h1>User Log In</h1>
                    <br>
                </div>
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
                        <button type="submit" @click="login">Log In</button>
                    </div>    
                </form>
                <div id="firebaseui-auth-container"></div>
                <!-- <div class="footer">
                    <a href="ResetPassword.html">Forgot password</a>
                    <br>
                    <a href="SignUp.html">Create an acoount</a>
                </div> -->
            </div>
        </div>
    </body>
</template>

<script>
import firebase from '@/uifire.js';
// import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

export default {
    name:"Login",

  mounted() {
         
        // If already an instance is created, get it
        var ui = firebaseui.auth.AuthUI.getInstance();

        // For creating first instance       
        if (!ui){
        ui = new firebaseui.auth.AuthUI(firebase.auth());
        }      

        var uiConfig = {
            signInSuccessUrl: '/home',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]            
        };
        ui.start("#firebaseui-auth-container", uiConfig)    
    },
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        
        login() {
            const auth = getAuth();
            if (!this.password || !this.email) {
                alert("Please fill in all the requirements");
            } else {
                signInWithEmailAndPassword(auth, this.email, this.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    this.$router.push('/home');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

body {
    min-height: 100vh;
    background: linear-gradient(to right top, #49eded, #95d52d);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
}
.login-card {
    width: 300px;
    height: 300px;
    padding: 100px;
    background-color: #ffffff77;
    border-radius: 10px;
    position: relative;
}
.login-card::before {
    content: "";
    position: absolute;
    background-color: #ffffff33;
    inset: 0;
    transform: rotate(-5deg);
    border-radius: 10px;
    z-index: -1;
}
.header {
    text-align: center;
}
.form {
    text-align: center;
}
.footer {
    text-align: center;
}
a {
    color: #000000;
}
a:focus {
    color: #0000ff;
}
.checkbox {
    margin: 10px;
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
#remember {
    width: 15px;
    height: 15px;
    border-radius: 0;
    padding: 0;
    margin: 0;
}
button {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 40px;
    font-size: 15px;
    margin: 10px 0 0 0;
}
button:hover {
    background-color: #aaaaaa;
}
h1 {
    background-color: #00000000;
}
</style>


