<template>
  <div class="barplotContainer">
  <div>
    <h3>Category</h3>
  </div>
  <!--loop the categories in the order of descending total expenses-->
  <div v-for="category in sortedCategories" :key="category.name">
    <div class="category-header">
      <!--▶ category name: barplot-->
      <span :class="{'icon-expanded': category.isExpanded}" @click="toggleExpand(category)">▶</span>
      <div class="label">
      <span>{{ category.name }}</span>
      </div>
      <div class="barchart-display">
        <bar-chart :data="category.chartData" :colors="category.colour" :stacked="true" :horizontal="true" :library="chartOptions" height="12px"></bar-chart>

      </div>
      <span>{{ category.value1 + '%'}}</span>
    </div>
    <!--expense table below barchart-->
    <table v-if="category.isExpanded" class="expenses-table">
      <tr v-for="expense in category.expenses" :key="expense.id">
        <!--table columns-->
        <td>{{ expense.date }}</td>
        <td>{{ expense.expense_title }}</td>
        <td>{{ '$' + expense.amount.toString() }}</td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import firebaseApp from '../firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'chartkick/chart.js'
import 'chart.js';



const db = getFirestore(firebaseApp);

export default {
  name:"BarplotDisplay",
  props: ['key'],
  watch: {
      // Watch for changes in the key prop, which is the refreshComp from the parent
      key(newValue, oldValue) {
          if (newValue !== oldValue) {
              this.fetchChartData();
          }
      }
  },
  data() {
    return {
      // chartData2: [
      //   {name: "Category 1", data: {"Segment 1": 20, "Segment 2": 30}},
      //   {name: "Category 2", data: {"Segment 1": 50, "Segment 2": 10}},
      //   {name: "Category 3", data: {"Segment 1": 30, "Segment 2": 40}}
      // ],
      chartOptions: {
        scales: {
          x: { 
            stacked: true,
            display: false
          },
          y: { 
            stacked: true,
            display: false
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      },
      //save a list of category objects constructed by fetchCategoryData()
      categories: [],
      //save the data to be displayed for each category
      //chartData: [],
      //use current month to filter out relevant data
      user:null,
      value1: 0,
      value2: 0,
      //monthly data used to plot % barchart
      monthlyBudget: 0,
      monthlyExpense: 0
    }
  },
  computed: {
    //sort the categories in the order of descending total expenses
    sortedCategories() {
      const sorted = this.categories.sort((a, b) => b.totalExpense - a.totalExpense);
      return sorted;
    }
  },
  mounted() {
    //initialise user
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        //
        const categoriesRef = collection(db, this.user.email)
        //fetching all the docs from the user's collection
        const snapshot = await getDocs(categoriesRef)
        //iterate over each doc in the snapshot
        for (const doc of snapshot.docs) {
          this.categories.push(await this.fetchCategoryData(doc.id))
        }
        console.log(this.categories[1].chartData.labels);
        console.log(this.categories[1].chartData.dataset);
      }
    })
  },

  methods: {
    //
    toggleExpand(category) {
      category.isExpanded = !category.isExpanded;
    },
    async fetchCategoryData(category) {
      try {
        //reference build to this specific category
        const docRef = doc(db, this.user.email, category);
        //get all docs in this category
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          let expenses = [];
          let monthlyBudget = 0;
          const currentMonth = new Date().toISOString().slice(0, 7);
          //const currentYear = new Date().getFullYear();
          monthlyBudget = parseFloat(data.amount);
          console.log('budget is', monthlyBudget);

          for (let key in data) {
            if (key.startsWith('field_')) {
              const expenseData = data[key];
              const expenseMonth = expenseData.Date.slice(0, 7); // Get the month of the expense

              if (expenseData.expense && expenseMonth === currentMonth) {
                expenses.push({
                  id: key,
                  date: expenseData.Date,
                  expense_title: expenseData.expense_title,
                  amount: expenseData.amount
                });
                expenses.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
                console.log(expenses);
              }
            }
          }

          const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
          const value1 = (totalExpense / monthlyBudget * 100).toFixed(2);;
          const value2 = ((monthlyBudget - totalExpense) / monthlyBudget * 100).toFixed(2);
          console.log(totalExpense);
          console.log(value1, value2);
          let colour = ['green', 'white'];
          if (value1 > 50 && value1 <= 80) {
            colour = ['orange', 'white'];
          } else if (value1 > 80) {
            colour = ['red', 'white'];
          };
          console.log(colour);
          return {
            name: category,
            isExpanded: false,
            expenses,
            totalExpense,
            colour,
            value1: value1,
            chartData: [
              {name: "Expenses", data:{"category": value1}},
              {name: "Remaining Budget", data:{"category": value2}}
            ]}
          };
      } catch (error) {
        console.error(`Error fetching data for category ${category}:`, error);
      }
    }

    
  }
}
</script>

<style scoped>
.barplotContainer{
  position:relative;
}

.label {
  display: inline-block;
  width: 80px; /* adjust this value to your needs */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.category-header {
  display: flex;
  align-items: center;
}

.barchart-display {
  width: 400px; 
}
.icon-expanded {
  transform: rotate(90deg);
}
.expenses-table {
  border-collapse: collapse;
  text-align: left;
}

.expenses-table td, .expenses-table th {
  padding:4px;
  white-space: nowrap; /* This will prevent the text from breaking into the next line */
}

.expenses-table th {
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
</style>

