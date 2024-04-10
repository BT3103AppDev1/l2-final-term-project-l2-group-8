<template>
<button id = "btn" @click="signOut()" v-if="user"> Logout </button>
    
</template>

<script>

// import firebaseApp from '@/firebase.js'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


export default {
  name: 'Logout',

  data() {
  return {
      user:false,     
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
      signOut(auth, user)
      this.$router.push({name:'Login'}) 
                      
    }
  }
}

</script>

<style scoped>
#btn{
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 40px;
    font-size: 15px;
    margin: 10px 0 0 0;
}
#btn:hover{
  background-color: #aaaaaa;
}

</style>