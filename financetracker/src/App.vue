<template>
  <div>
    <!-- Other content -->
    <AddBudget />
  </div>
</template>

<script>
import AddBudget from './components/AddBudget.vue';

export default {
  name: 'App',
  components: {
    AddBudget,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  margin-top: 30px;
}

body {
  background-color: #D0F0C0;
}
</style>