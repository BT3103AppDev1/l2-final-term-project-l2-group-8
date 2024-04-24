<template>

    <body v-if="user">
        <div class="nav">
            <NavBar />
        </div><br><br>
        <AddBudget @added="change" />
        <AddExpense @added="change" /><br><br>
        <DonutChartSummary :key="refreshComp" />
        <div class="barplotContainer">
            <BarplotDisplay :key="refreshComp" />
        </div>
    </body>
</template>

<script>
import AddBudget from "../components/AddBudget.vue"
import AddExpense from "../components/AddExpense.vue"
import BarplotDisplay from '../components/BarplotDisplay.vue'
import DonutChartSummary from "@/components/DonutChartSummary.vue"
import NavBar from "@/components/NavBar.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: 'App',
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    },
    components: {
        AddBudget,
        AddExpense,
        BarplotDisplay,
        DonutChartSummary,
        NavBar
    },
    data() {
        return {
            refreshComp: 0,
            user: false
        }
    },
    methods: {
        change() {
            this.refreshComp += 1
        }
    }
}
</script>

<style scoped>
body{
    margin: -20px;
    padding: 0;
    }
.nav{
    margin-bottom: 10vh;
}
</style>
