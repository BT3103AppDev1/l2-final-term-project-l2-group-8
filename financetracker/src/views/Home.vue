<template>
    <AddBudget @added="change" />
</template>

<script>
import AddBudget from "../components/AddBudget.vue"

export default {
    name: 'App',
    components: {
        AddBudget,
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

