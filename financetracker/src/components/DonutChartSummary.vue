<template>
    <div class="chart-container">
        <div class="summary-text">
            <div class="total-budget">Total Budget: ${{ totalBudget.toFixed(2) }}</div><br>
            <div class="total-expense">Total Expense: ${{ totalExpense.toFixed(2) }} </div>
        </div>
        <pie-chart :donut="true" :data="chartData" legend="bottom" prefix="$" loading="Loading..." height="70vh"
            :colors="['#E9E4BF', '#B6AD90', '#AC855E', '#C0C7AB', '#f6f3e7', '#ABC09F', '#bc987e', '#E1DACA', '#D5ADA4', '#008080', '#676B6E', '#E3D7BD',  
             ]" :library="{
            cutout: '65%',
            elements: { arc: { borderWidth: 0 } },
            plugins: { legend: { labels: { color: '#36454F '}}}
        }"></pie-chart>
        <div class="balance-display">
            <span>Balance: ${{ formattedBalance }}</span>
        </div>
    </div>

</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseApp from '../firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'chartkick/chart.js'

const db = getFirestore(firebaseApp);

export default {
    name: "DonutChartSummary",
    props: ['key'],
    watch: {
        // When refreshComp changes, new user data is automatically fecthed
        key(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.fetchChartData();
            }
        }
    },
    data() {
        return {
            chartData: [], // Initialize chartData as an empty array
            user: null,
            totalBudget:0,
            totalExpense:0,
            balance: 0
        };
    },
    computed: {
        formattedBalance() {
            return (this.totalBudget-this.totalExpense).toFixed(2);
        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fetchChartData();
            }
        });
    },
    methods: {
        // fetch user data from firebase for doughnut chart and number summaries
        async fetchChartData() {
            try {
                const snapshot = await getDocs(collection(db, String(this.user.email)));
                let categoryAmounts = {};
                let expenseSum = 0;
                let budgetSum = 0;
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                snapshot.forEach(doc => {
                    const isBudget = doc.data().budget;
                    if (isBudget) {
                        const docDate = new Date(doc.data().Date);
                        if (docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
                            budgetSum += doc.data().amount;
                        }
                    }

                    for (let key in doc.data()) {
                        if (key.startsWith('field_')) {
                            const expenseData = doc.data()[key];
                            const docDate = new Date(expenseData.Date);
                            if (expenseData.expense && docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
                                let amount = parseFloat(expenseData.amount);
                                expenseSum += amount;
                                let category = doc.id;
                                if (!categoryAmounts[category]) {
                                    categoryAmounts[category] = 0;
                                }
                                categoryAmounts[category] += amount;
                            }
                        }
                    }
                });

                this.chartData = Object.keys(categoryAmounts).map(category => [category, categoryAmounts[category]]);
                this.totalExpense = expenseSum;
                this.totalBudget = budgetSum;
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
    }
}
</script>

<style scoped>
    .chart-container {
        position: relative;
        width: 100%;
        /* pointer-events: "hover"; */
        /* height: 500px; */
    }
    
    .summary-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -130%);
        text-align: center;
        width: 100%;
        font: bold;
        pointer-events: none
    }
    .total-budget {
        font-weight: bold;
        color: #186a27;
    }

    .total-expense {
        font-weight: bold;
        color: #C23B22;
    }

    .balance-display {
        width: 50vw;
        background-color: #3F704D;
        color: #f1f9ec;
        padding: 2vb 2vb;
        border-radius: 20px;
        font-size: 1.2em;
        text-align: center;
        margin: 5vh auto
        }
        
</style>
