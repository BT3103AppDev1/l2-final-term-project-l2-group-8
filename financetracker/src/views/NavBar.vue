<template>
    <div id="container" v-if="user">
        <img src="" alt="logo">
        <button id = "btn" @click="signOut()"> Logout </button>
        <nav>
            <router-link to="/home" class="router-link" active-class="router-link-active">Home</router-link> |
            <router-link to="/forum" class="router-link" active-class="router-link-active">Forum</router-link> |
            <router-link to="/products" class="router-link" active-class="router-link-active">Finance Products</router-link>
        </nav>
        
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "../router";
export default {
    name: "NavBar",
    data() {
        return {
            user: false,     
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
                if (user) {
                this.user = user;      
            }
        })
    },

    methods: {
        signOut() {
            const auth = getAuth();      
            const user = auth.currentUser;  
            signOut(auth, user);
            router.push("/");
            this.user = false;
        }
    }
}
</script>

<style scoped>
#container {
    background-color: #ffffffaa;
    position: absolute;
    top: 0;
    left: -20px;
    height: 60px;
    width: 100%;
    margin: 0 23px;
}
img {
    position: absolute;
    bottom: 20px;
    left: 50px;
}
nav {
    display: inline-block;
    position: absolute;
    left: 300px;
    bottom: 20px;
}
#btn {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 40px;
    font-size: 15px;
    position: absolute;
    right: 50px;
    bottom: 10px;
}
#btn:hover{
    background-color: #aaaaaa;
}
.router-link {
    color: #000000;
}
.router-link-active {
    color: #018337;
}
</style>