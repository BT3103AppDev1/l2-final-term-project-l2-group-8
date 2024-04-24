<template>
  <div class='parent'>
    <div class="barplotContainer">
      <div class="header">
        <h3 style="color: ivory;">Expense Details by Category</h3>
      </div>
      <!--loop over the categories in the order of descending total expenses-->
      <div v-for="category in sortedCategories" :key="category.name">
      <!-- Alert if the expense has exceeded 80% of the budget -->
        <div v-if="category.value1 > 80" style="color: #b30900; text-align: center;">
          Alert: {{ category.name }} expenses has reached {{ category.calculatedValue1 }}%
        </div>
      </div>
      <div v-for="category in sortedCategories" :key="category.name">
        <div class="category-header">
          <!-- category name: barplot-->
          <span :class="{ 'icon-expanded': category.isExpanded }" @click="toggleExpand(category)">▶</span>
          <div class="label">
            <span>{{ category.name }}</span>
          </div>
          <div class="barchart-display" v-if="!isNaN(category.value1)">
            <bar-chart :data="category.chartData" :colors="category.colour" :stacked="true" :horizontal="true"
              :library="chartOptions" height="13px"></bar-chart>
          </div>
          <div class="reminder" v-if="isNaN(category.value1)">
            <h6>Please set a budget for {{ category.name }}</h6>
          </div>
          <div class="progress" v-if="!isNaN(category.value1)">
            <span>{{ category.calculatedValue1 + '%' }}</span>
          </div>
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
  name: "BarplotDisplay",
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

      //use current month to filter out relevant data
      user: null,
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
      return this.categories.sort((a, b) => {
        // Handle potential undefined or null values
        const valueA = a.calculatedValue1 || 0;
        const valueB = b.calculatedValue1 || 0;
        return valueB - valueA;
      });
    }
  },
  mounted() {
    //initialise user
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
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
    //Handle toggle expansion
    toggleExpand(category) {
      category.isExpanded = !category.isExpanded;
    },
    //Fetch user's stored category lists
    async fetchCategoryData(category) {
      try {
        //reference build to this specific category
        const docRef = doc(db, this.user.email, category);
        //get all docs in this category
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          let expenses = [];
          const currentMonth = new Date().toISOString().slice(0, 7);
          const monthlyBudget = parseFloat(data.amount);
          console.log('budget is', monthlyBudget);

          //loop over the keys in document get all expenses
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
          console.log(totalExpense);
          let calculatedValue1 = (totalExpense / monthlyBudget * 100).toFixed(2);
          let calculatedValue2 = ((monthlyBudget - totalExpense) / monthlyBudget * 100).toFixed(2);

          let value1, value2, colour;

          if (calculatedValue1 > 100) {
            colour = ['black', 'white'];
            value1 = 100;
            value2 = 0;
          } else {
            colour = calculatedValue1 > 80 ? ['maroon', 'ivory'] : calculatedValue1 > 50 ? ['goldenrod', 'ivory'] : ['seagreen', 'ivory'];
            value1 = calculatedValue1;
            value2 = calculatedValue2;
          }
          console.log(colour);
          console.log(value1, value2);
          return {
            name: category,
            isExpanded: false,
            expenses,
            totalExpense,
            colour,
            value1: value1,
            calculatedValue1: calculatedValue1,
            chartData: [
              { name: "Expenses", data: { "category": value1 } },
              { name: "Remaining Budget", data: { "category": value2 } }
            ]
          }
        };
      } catch (error) {
        console.error(`Error fetching data for category ${category}:`, error);
      }
    }


  }
}
</script>

<style scoped>
.parent {
  display: flex;
  justify-content: center;
  padding-bottom: 5%;
}

.barplotContainer {
  position: relative;
}

.label {
  display: inline-block;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  margin-left: 10px;
}

.reminder {
  width: 500px;
  margin: 0px;
}

.category-header {
  display: flex;
  align-items: center;
  height: 30px;
}

.barchart-display {
  width: 500px;
  margin-right: 10px;
}

.icon-expanded {
  transform: rotate(90deg);
}

.expenses-table {
  border-collapse: collapse;
  text-align: left;
  margin-left: 140px;
}

.expenses-table td,
.expenses-table th {
  padding: 4px;
  white-space: nowrap;
  /* prevent the text from breaking into the next line */
}

.expenses-table th {
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}

.icon-expanded {
  transform: rotate(90deg);
}

.header{
  text-align: center;
}
</style>