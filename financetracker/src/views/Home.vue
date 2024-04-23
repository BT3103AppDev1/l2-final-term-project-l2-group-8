<template>

    <body>
        <AddBudget @added="change" />
        <AddExpense @added="change" /><br><br>
        <div class="barplotContainer">
            <BarplotDisplay />
        </div>
    </body>
</template>

<script>
import AddBudget from "../components/AddBudget.vue"
import AddExpense from "../components/AddExpense.vue"
import BarplotDisplay from '../components/BarplotDisplay.vue'

export default {
    name: 'App',
    components: {
        AddBudget,
        AddExpense,
        BarplotDisplay,
    },
    data() {
        return {
            refreshComp: 0
        }
    },
    methods: {
        change() {
            this.refreshComp += 1
        }
    }
}
</script>
