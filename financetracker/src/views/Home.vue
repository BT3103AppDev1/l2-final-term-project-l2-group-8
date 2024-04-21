<template>
    <AddBudget @added="change" />
    <AddExpense @added="change"/>
    <DonutChartSummary />
</template>

<script>
import AddBudget from "../components/AddBudget.vue"
import AddExpense from "../components/AddExpense.vue"
import DonutChartSummary from "@/components/DonutChartSummary.vue"

export default {
    name: 'App',
    components: {
        AddBudget,
        AddExpense,
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
