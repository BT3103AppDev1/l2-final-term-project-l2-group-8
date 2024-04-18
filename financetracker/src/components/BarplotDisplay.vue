<template>
    <div>
      <div v-for="(category, index) in categories" :key="index" class="category-row">
        <div @click="handleClick(index)" class="category-name">
          <span :class="{'icon-expanded': category.isExpanded}">▶</span>
          {{ category.name }}
        </div>
        <canvas :id="'chart-' + index" class="category-chart"></canvas>
        <div v-if="category.isExpanded" class="expense-table">
          <div v-for="expense in category.expenses" :key="expense.id">
            {{ expense.selectedTime }} - {{ expense.title }} - {{ expense.amount }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import firebaseApp from '../firebase.js';
  import { ref, onMounted } from 'vue';
  import { Chart } from 'chart.js';
  import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  const db = getFirestore(firebaseApp);
  
  export default {
    name:"BarplotDisplay",
    setup() {
      const categories = ref([]);
      const user = ref(null);
      const auth = getAuth();
      onAuthStateChanged(auth, (userAuth) => {
        if (userAuth) {
            user.value = userAuth;
        }
      });
      const fetchCategoryData = async () => {
        if(!user.value) return;
        // Get the current year and month
        const currentYearMonth = new Date().toISOString().slice(0, 7); // Format as 'YYYY-MM'
        // Fetch data from Firebase
        const q = query(collection(db, String(user.value.email), currentYearMonth), orderBy('totalExpenses', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const data = doc.data();
          const totalExpenses = data.expenses.reduce((total, expense) => total + expense.amount, 0);
          const value1 = (data.budget.amount - totalExpenses) / data.budget.amount * 100;
          const value2 = totalExpenses / data.budget.amount * 100;
          categories.value.push({
            name: doc.id,
            isExpanded: false,
            expenses: data.expenses,
            budget: data.budget,
            barData: [value1, value2],
          });
        });
      };
  
      const handleClick = (index) => {
        categories.value[index].isExpanded = !categories.value[index].isExpanded;
      };
  
      onMounted(async () => {
        await fetchCategoryData();
        categories.value.forEach((category, index) => {
          const ctx = document.getElementById('chart-' + index);
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Budget', 'Expenses'],
              datasets: [
                {
                  data: category.barData,
                  backgroundColor: ['white', 'black'],
                },
              ],
            },
            options: {
              indexAxis: 'y',
            },
          });
        });
      });
  
      return {
        categories,
        handleClick,
      };
    },
  };
  </script>
  
<style scoped>
.category-row { 
    display: flex;
    align-items: center;
}
.category-name {
    flex:1;
}
.category-chart {
    flex:2;
}
.icon-expanded {
    display: inline-block;
    transform: rotate(90deg);
}
  
.expense-table {
    max-height: 200px;
    overflow-y: auto;
    background-color: transparent;
}
</style>
  