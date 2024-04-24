<template>
    <div style="text-align: center;" v-if="user">
        <NavBar /><br><br><br>
        <h2>Page Not Found</h2>
        <h3>Please click on the above available options</h3>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
    name: "NotFound",
    components: {
        NavBar,
    },
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
    }
}
</script>
<style scoped>
div{
    min-height: 100vh;
    background: linear-gradient(to right top, #008080, #bab86c);
    align-items: center;
}
</style>