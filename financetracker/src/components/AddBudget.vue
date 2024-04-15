<template>
    <div>
        <!--  modal content  -->
        <button id="createBudget" @click="showModal = true">Add Budget</button>
        <div v-if="showModal" class="modal">

            <form class="modal-content">
                <span @click="closeModal" class="close">&times;</span><br>
                <!-- <h3>Add Budget</h3> -->
                <label for="category">Category:</label>
                <select v-model="selectedCategory">
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                    </option>
                    <option value="new">Add a new budget category</option>
                </select>
                <div v-if="selectedCategory === 'new'" id="newCategory">
                    <label for="newCategory">New Category:</label>
                    <input type="text" v-model="newCategory" placeholder="Enter new category name">
                    <!-- Warning message for new category -->
                    <span v-if="newCategory && !isValidNewCategory" class="warning">New category name must be less than
                        20 characters and contain only letters, numbers, and spaces.</span>
                </div><br><br>
                <label for="amount">Amount:</label>
                <input type="text" v-model="amount" @input="formatAmount">
                <!-- <input type="text" v-model="amount" min="0" max="1000000"> -->
                <span v-if="!isValidAmount" class="warning">Budget amount must be between 0 and
                    1,000,000.</span><br><br>
                <button id="addBudget" @click="addBudget">Add</button>
            </form>

        </div>
    </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// import { doc, setDoc } from "firebase/firestore";
import firebaseApp from '../firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name:"AddBudget",
    data() {
        return {
            user: false,
            userID: null,
            showModal: false,
            selectedCategory: '',
            newCategory: '',
            amount: '',
            categories: [
                // default categories
                { id: 'food', name: 'Food' },
                { id: 'transportation', name: 'Transportation' },
                { id: 'utilities', name: 'Utilities'},
                { id: 'housing', name: 'Housing'},
                { id: 'fashion', name: "Fashion"},
                { id: 'entertainment', name: "Entertainment" },
                { id: 'communication', name: "Communication" },
                { id: 'gifts', name: "Gifts" },
                { id: 'health', name: "Health" },
                { id: 'pets', name: "Pets" },
                { id: 'grocery', name: "Grocery" },
                { id: 'education', name: "Education" },
                { id: 'others', name: "Others" },
                // Add more default categories as needed
            ]
        };
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                // this.userID = user.uid;
                // console.log(this.user.email)
            }
        })
    },
    computed: {
        // Check if new category name is valid
        isValidNewCategory() {
            return !this.newCategory || (this.newCategory.length <= 20 && /^[a-zA-Z0-9 ]+$/.test(this.newCategory));
        },
        // Check if amount is valid
        isValidAmount() {
            const numAmount = parseFloat(this.amount);
            return this.amount && !isNaN(numAmount) && numAmount >= 0 && numAmount <= 1000000;
            // return !this.amount || (this.amount >= 0 && this.amount <= 1000000);
        }
    },
    methods: {
        async addBudget() {
            // Validate input
            if (!this.selectedCategory || !this.amount) {
                alert('Please select a category and enter an amount.');
                return;
            }

            const numAmount = parseFloat(this.amount);
            if (isNaN(numAmount) || numAmount < 0 || numAmount > 1000000) {
                alert("Budget amount is out of allowed range.");
                return;
            }

            // if (this.amount < 0 || this.amount > 1000000) {
            //     alert("Budget amount is out of allowed range.")
            // }

            if (this.selectedCategory === 'new') {
                if (!this.newCategory) {
                    alert('New budget category name cannot be empty.');
                    return;
                } else if (this.newCategory.length > 20) {
                    alert('Budget category name exceeds the maximum symbol limit (20 characters).');
                    return;
                } else if (!/^[a-zA-Z0-9 ]+$/.test(this.newCategory)) {
                    alert('Budget category cannot contain special characters.');
                    return;
                }
            }

            // Initialize Firestore
            const db = getFirestore(firebaseApp);

            try {
                // Add budget to Firestore
                // const docRef = await addDoc(collection(db, String(this.user.email), 'budgets', 
                // String(this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory)), {
                //     category: this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory,
                //     amount: numAmount/*this.amount*/,
                // });

                const currentYearMonth = new Date().toISOString().slice(0, 7); // Format as 'YYYY-MM'
                const userCategory = this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory;

                // Constructing the full path dynamically without "time"
                const budgetCollectionPath = [
                    String(this.user.email), // Root collection by user email
                    currentYearMonth,        // Directly use year-month as subcollection
                    userCategory             // Specific category for the budget
                ];

                // Data to be added to Firestore
                const budgetData = {
                    amount: numAmount, // Replace 'numAmount' with your actual amount variable
                    timestamp: new Date().getMonth() + 1 // Month as a number (1-12)
                };

                // Add the document to the correct Firestore path
                const docRef = await addDoc(collection(db, ...budgetCollectionPath), budgetData);


                // Refresh the page
                // location.reload();

                // Close modal
                this.closeModal();
                this.$emit("added");
            } catch (error) {
                console.error('Error adding budget: ', error);
            }
        },
        closeModal() {
            this.showModal = false;
            this.selectedCategory = '';
            this.newCategory = '';
            this.amount = '';
        },
        formatAmount(event) {
            // Get the current input value
            let value = event.target.value;

            // Replace any non-digit characters except the decimal point
            value = value.replace(/[^0-9.]/g, '');

            // Check if the input includes more than one decimal point
            const decimalCheck = value.split('.');
            if (decimalCheck.length > 2) {  // More than one decimal point
                value = decimalCheck[0] + '.' + decimalCheck[1];
            }

            // Limit to two decimal places
            if (decimalCheck.length > 1 && decimalCheck[1].length > 2) {
                value = decimalCheck[0] + '.' + decimalCheck[1].substring(0, 2);
            }

            // Update the input field's value
            event.target.value = value;

            // Update the Vue model
            this.amount = value;
            }
    },
};
</script>

<style scoped>
.modal {
    position: absolute;
    top: 5em;
    right: 0.5em;
    background-color: #fefefe;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    z-index: 1000; /* modal appears above other content */
}

.modal-content {
    max-width: 400px;
    margin: 0 auto;
    display:inline-block;
    text-align: center;
    align-items:center;
    /* margin: auto; */
}

.close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 20px;
    cursor: pointer;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: inline-block;
    /* margin-bottom: 0em; */
    margin-right: 1em;
}

label {
    /* margin-bottom: 5px; */
    text-align: center;
}
label[for="amount"] {
    margin-left: 1.2em;
    margin-right: 1.5em;
}

select,
input[type="number"],
input[type="text"] {
    width: 60%;
    padding: 10px;
    font-size: 16px;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #ffffff;
    color: black;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: #404040;
    color: white;
}

#createBudget {
    float: inline-end;
}

#addBudget {
    display: block;
    margin: 0 auto;
}

#newCategory {
    display: flex;
    align-items: center;
    margin-top: 1em;
}

#newCategory label {
    margin-right: 0em;
    /* margin-bottom: 0; */
}

.warning {
    color: red;
    margin: 0 auto;
    font-size: small;
    display: inline-flex;
}
</style>
