<template>

    <body>
        <div id="container" v-if="user">
            <img src="@/assets/logo.png" alt="logo">
            <button id="btn" @click="signOut()"> Logout </button>
            <nav>
                <div>
                <router-link to="/home" class="router-link" active-class="router-link-active">Home</router-link>
                </div>
                <div><router-link to="/forum" class="router-link" active-class="router-link-active">Forum</router-link>
                </div>
                <div><router-link to="/products" class="router-link" active-class="router-link-active">Financial Products</router-link>
                </div>
            </nav>

        </div>
    </body>
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
    background-color: #f6f3e7;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
}

img {
    position: relative;
    height:2.8em;
    margin-top:7px;
    margin-left: -0.5em;
}

nav {
    display: flex;
    position: absolute;
    justify-content: space-between;
    width: 25%;
    left: 65%;
    bottom: 20px;
}
nav div {
  text-align: center;
}

#btn {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 5px;
    font-size: 15px;
    position: absolute;
    left: 80px;
    bottom: 10px;
}
#btn:hover{
    background-color: #aaaaaa;
}
.router-link {
  color: #000;
  text-decoration: none;
  display: block;
}
.router-link-active {
    color: #018337;
}
.router-link:hover {
  color: #dddddd; 
}
</style>