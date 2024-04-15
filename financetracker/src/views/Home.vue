<template>
    <AddBudget @added="change" />
    <DonutChartSummary />
</template>

<script>
import AddBudget from "../components/AddBudget.vue"
import DonutChartSummary from "@/components/DonutChartSummary.vue"

export default {
    name: 'App',
    components: {
        AddBudget,
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

