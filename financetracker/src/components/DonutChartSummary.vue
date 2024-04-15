<template>
    <pie-chart :donut="true" :data="chartData" :round="2"></pie-chart>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { doc, setDoc } from "firebase/firestore";
import firebaseApp from '../firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'chartkick/chart.js'
const db = getFirestore(firebaseApp);

export default {
    name: "DonutChartSummary",
    mounted(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.chartData = [["cat1", 4.4543], ["cat2", 5]];
            }
        })
    },
    data(){
        return {
            chartData: [], // Initialize chartData as an empty array
            user: null,
        };
    },
    methods(){

    }
}
</script>

<style scoped>

</style>