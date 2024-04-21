import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseApp from 'path-to-your-firebase-config';

async function getExpensesAndBudgetFromFirebase() {
    try {
        const db = getFirestore(firebaseApp);

        // 获取总费用
        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        let totalExpenses = 0;
        expensesSnapshot.forEach(doc => {
            totalExpenses += doc.data().amount;
        });

        // 获取预算金额
        const budgetSnapshot = await getDocs(collection(db, 'budgets'));
        let totalBudget = 0;
        budgetSnapshot.forEach(doc => {
            totalBudget += doc.data().amount;
        });

        return { expenses: totalExpenses, budgetAmount: totalBudget };
    } catch (error) {
        console.error('Error fetching expenses and budget from Firebase: ', error);
        throw error;
    }
}

export { getExpensesAndBudgetFromFirebase };