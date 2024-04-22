<template>
  <div>
    <h3>Category</h3>
    <!--loop the categories in the order of descending total expenses-->
    <div v-for="category in sortedCategories" :key="category.name">
      <div class="category-header">
        <!--▶ category name: barplot-->
        <span :class="{'icon-expanded': category.isExpanded}" @click="toggleExpand(category)">▶</span>
        <span>{{ category.name }}</span>
      </div>
      <bar-chart :data="category.chartData" :stacked="true" :horizontal="true" :options="chartOptions"></bar-chart>
      <!--expense table below barchart-->
      <table v-if="category.isExpanded" class="expenses-table">
        <tr v-for="expense in category.expenses" :key="expense.id">
          <!--table columns-->
          <td>{{ expense.date }}</td>
          <td>{{ expense.expense_title }}</td>
          <td>{{ expense.amount }}</td>
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

const db = getFirestore(firebaseApp);

export default {
  name:"BarplotDisplay",
  //props: ['key'],
  // watch: {
  //     // Watch for changes in the key prop, which is the refreshComp from the parent
  //     key(newValue, oldValue) {
  //         if (newValue !== oldValue) {
  //             this.fetchChartData();
  //         }
  //     }
  // },
  data() {
    return {
      //save a list of category objects constructed by fetchCategoryData()
      categories: [],
      //save the data to be displayed for each category
      //chartData: [],
      //use current month to filter out relevant data
      currentMonth: new Date().getMonth() + 1,
      chartOptions: {
        //options
      },
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
      return this.categories.sort((a, b) => b.totalExpense - a.totalExpense)
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
                expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
                console.log(expenses);
              }
            }
          }

          const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
          const value1 = totalExpense / monthlyBudget * 100;
          const value2 = (monthlyBudget - totalExpense) / monthlyBudget * 100;
          console.log(totalExpense);
          console.log(value1, value2);

          return {
            name: category,
            isExpanded: false,
            expenses,
            totalExpense,
            chartData: {
              labels: ['Expenses', 'Remaining Budget'],
              datasets: [{
                data: [value1, value2],
                backgroundColor: ['black', 'white']
              }]
            }
          };
        }  
      } catch (error) {
        console.error(`Error fetching data for category ${category}:`, error);
      }
    }

    
  }
}
</script>

<style scoped>
.category-header {
  display: flex;
  align-items: center;
}
.icon-expanded {
  transform: rotate(90deg);
}
.expenses-table {
  max-height: 200px;
  overflow-y: auto;
}
</style>

// //fetch all the necessary data from one category
    // async fetchChartData(category) {
    //   //reference build to this specific category
    //   const categoryRef = collection(db, this.user.email, category)
    //   //get all docs in this category
    //   const snapshot = await getDocs(categoryRef)
    //   let expenses = [] //store list of expenses
    //   let monthlyBudget = 0
    //   //for each category
    //   snapshot.forEach(doc => {
    //     const data = doc.data();
    //     const monthlyBudget = data.budget; //this is the budget for this category. that's all for budget
    //     const monthlyExpense = 0;
    //     //for each field of expenses
    //     for (let key in doc.data()) {
    //       if (key.startsWith('field_')) {
    //         const expenseData = doc.data()[key];//inner value of each expense field
    //         const docDate = new Date(expenseData.Date);
    //         //filter out this month's expenses
    //         if (expenseData.expense && docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
    //           let amount = parseFloat(expenseData.amount);
    //           monthlyExpense += amount; //add to total expense
    //           expenses.push({ //push into expense table
    //             id: key,
    //             date: expenseData.Date, 
    //             expense_title: expenseData.expense_title, 
    //             amount: expenseData.amount
    //           })
    //           value1 = (monthlyBudget - totalExpense) / monthlyBudget * 100
    //           value2 = totalExpense / monthlyBudget * 100
    //           return {
    //             name: category,
    //             isExpanded: false,
    //             expenses,
    //             totalExpense,
    //             chartData: {
    //             labels: ['Remaining Budget', 'Expenses'],
    //             datasets: [{
    //             data: [value1, value2],
    //             backgroundColor: ['black', 'white']
    //           }]
    //     }
    //   }
    // },
                  //               let category = doc.id;
                  //               if (!categoryAmounts[category]) {
                  //                   categoryAmounts[category] = 0;
                  //               }
                  //               categoryAmounts[category] += amount;
                  //           }
                  //       }
                  //   }
    // data() {
    // return {
    //   chartData: {
    //     'Category A': [30, 70],
    //     'Category B': [80, 20]
    //   }
    // };

      //   if (data.expense && data.Date.slice(0, 7) === this.currentMonth) {
      //     expenses.push({
      //       id: doc.id,
      //       date: data.Date,
      //       expense_title: data.expense_title,
      //       amount: data.amount
      //     })
      //   } else if (data.budget) {
      //     monthlyBudget = data.amount
      //   }
      // })
      // const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)
      
