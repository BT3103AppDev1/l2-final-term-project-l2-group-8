<template>
    <AddBudget @added="change" />
    <AddExpense @added="change"/>
</template>

<script>
import AddBudget from "../components/AddBudget.vue"
import AddExpense from "../components/AddExpense.vue"
export default {
    name: 'App',
    components: {
        AddBudget,
        AddExpense,
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
