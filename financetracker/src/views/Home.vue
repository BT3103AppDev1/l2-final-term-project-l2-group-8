<template>

    <body>
    
    <body>
        <AddBudget @added="change" />
            <AddExpense @added="change" /><br><br>
        <DonutChartSummary :key="refreshComp"  /><br><br>
            <div class="barplotContainer">
                <BarplotDisplay :key="refreshComp" />
            </div>
    </body>
    </body>
</template>

<script>
import AddBudget from "../components/AddBudget.vue"
import AddExpense from "../components/AddExpense.vue"
import BarplotDisplay from '../components/BarplotDisplay.vue'

import DonutChartSummary from "@/components/DonutChartSummary.vue"

export default {
    name: 'App',
    components: {
        AddBudget,
        AddExpense,
        BarplotDisplay,
        DonutChartSummary
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
