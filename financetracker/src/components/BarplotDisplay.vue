<template>
    <div>
      <div v-if="hasData">
        <canvas ref="chartCanvas"></canvas>
        <div v-for="(category, index) in categories" :key="index">
          {{ category.name }} - {{ categoryPercentage[index] }}%
        </div>
      </div>
      <div v-else>
        No data available yet.
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'ExpenseChart',
    props: {
      // Pass data from parent component
      categories: Array,
      expenses: Array,
      budgets: Array
    },
    setup(props) {
      const chartCanvas = ref(null);
      const hasData = ref(false);
      const categoryPercentage = ref([]);
  
      onMounted(() => {
        // Calculate total expenses and balance for each category
        const categoryData = props.categories.map((category, index) => {
          const totalExpenses = props.expenses
            .filter(expense => expense.category === category.id)
            .reduce((acc, expense) => acc + expense.amount, 0);
  
          const budget = props.budgets[index].amount;
          const balance = budget - totalExpenses;
          const percentage = (totalExpenses / budget) * 100;
  
          return { balance, percentage };
        });
  
        // Check if there is data available
        hasData.value = categoryData.some(data => data.balance !== undefined);
  
        // Generate bar chart
        if (hasData.value) {
          const ctx = chartCanvas.value.getContext('2d');
          const chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
              labels: props.categories.map(category => category.name),
              datasets: [{
                label: 'Balance',
                data: categoryData.map(data => data.balance),
                backgroundColor: 'rgba(54, 162, 235, 0.5)' // Blue color for balance
              }, {
                label: 'Total Expenses',
                data: props.categories.map(category =>
                  props.expenses
                    .filter(expense => expense.category === category.id)
                    .reduce((acc, expense) => acc + expense.amount, 0)
                ),
                backgroundColor: 'rgba(255, 99, 132, 0.5)' // Red color for total expenses
              }]
            },
            options: {
              scales: {
                x: {
                  stacked: true
                }
              }
            }
          });
  
          // Set category percentage
          categoryPercentage.value = categoryData.map(data => data.percentage.toFixed(2));
        }
      });
  
      return { chartCanvas, hasData, categoryPercentage };
    }
  };
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>
  