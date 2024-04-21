<template>
    <div class="chart-container">
        <div class="summary-text">
            <div class="total-budget">Total Budget: ${{ totalBudget.toFixed(2) }}</div><br>
            <div class="total-expense">Total Expense: ${{ totalExpense.toFixed(2) }} </div>
        </div>
            <pie-chart :donut="true" :data="chartData" legend="bottom" prefix="$" loading="Loading..." height="70vh"
                :colors="['#e97451', '#f1f9ec', '#008080', '#bab86c', '#fff0f5', '#b0e0e6', '#f5f5dc'
            , '#2a52be', '#bc987e', '#d8bfd8' ]" :library="{
            cutout: '65%',
            elements: { arc: { borderWidth: 0 } },
            plugins: { legend: { labels: { color: '#36454F '}}}
        }"></pie-chart>
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
    data() {
        return {
            chartData: [], // Initialize chartData as an empty array
            user: null,
            totalBudget:0,
            totalExpense:0
        };
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
        async fetchChartData() {
            try {
                const snapshot = await getDocs(collection(db, String(this.user.email)));
                let data = [];
                let budgetSum = 0;
                let expenseSum = 0;
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                snapshot.forEach(doc => {
                    const docDate = new Date(doc.data().Date);
                    const isBudget = doc.data().budget;
                    if (isBudget && docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
                        data.push([doc.id, doc.data().amount]);
                        budgetSum += doc.data().amount;
                        
                        //console.log(doc.data().amount)
                        console.log("amount:", doc.data().amount, "budget:",budgetSum)
                    } else if (docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
                        expenseSum += doc.data().amount;
                    }
                });
                this.chartData = data;
                this.totalBudget = budgetSum;
                this.totalExpense = expenseSum;
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
        transform: translate(-50%, -10%);
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
        color: #d65940;
    }
        
</style>
