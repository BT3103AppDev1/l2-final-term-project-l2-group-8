<template>
    <div>
        <button id="createBudget" @click="showModal = true">Add Budget</button>
        <div v-if="showModal" class="modal">
            <!-- modal content -->
            <form class="modal-content">
                <span @click="closeModal" class="close">&times;</span><br>
                <!-- 1. Dropdown for selecting or adding a new category -->
                <div class="formli">
                    <label for="category">Category:</label>
                    <select v-model="selectedCategory">
                        <option disabled value="" selected>Select a category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name
                            }}
                        </option>
                        <option value="new">Add a new budget category</option>
                    </select>
                </div>
                <!-- Conditional input for new category with validation message -->
                <div v-if="selectedCategory === 'new'" id="newCategory" class="formli">
                    <label for="newCategory">New Category:</label>
                    <input type="text" v-model="newCategory" placeholder="Enter new category name">
                </div>
                <div>
                    <!-- Warning message for invalid category -->
                    <span v-if="newCategory && !isValidNewCategory" class="warning">New category name must be less
                        than
                        20 characters and contain only letters, numbers, and spaces.</span>
                </div>
                <!--2. Amount-->
                <div class="formli">
                    <label for="amount">Amount:</label>
                    <input type="text" v-model="amount" @input="formatAmount">
                </div>
                <div>
                    <!-- Warning message for invalid amount -->
                    <span v-if="!isValidAmount" class="warning">Budget amount must be between 0 and
                        1,000,000.</span><br><br>
                </div>
                <button id="addBudget" @click.prevent="addBudget">Add</button>
            </form>
        </div>
    </div>
</template>

<script>
import { getFirestore, collection, query, getDocs, setDoc, doc, deleteDoc, writeBatch,getDoc, addDoc } from 'firebase/firestore';
import firebaseApp from '../firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "AddBudget",
    data() {
        return {
            user: false,
            showModal: false,
            selectedCategory: '',
            newCategory: '',
            amount: '',
            categories: [] // Start with an empty array, will be populated from Firestore
        };
    }, 
    mounted() {
        // Add event listener to close modal when clicking outside of it
        document.body.addEventListener('click', this.handleClickOutside);
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                const db = getFirestore(firebaseApp);
                const userEmailList = `${user.email}list`; // Collection name based on user's email
                const collectionRef = collection(db, userEmailList);
                const categories = [
                    "Food",
                    "Transport",
                    "Utilities",
                    "Housing",
                    "Fashion",
                    "Entertainment",
                    "Communication",
                    "Gifts",
                    "Health",
                    "Pets",
                    "Grocery",
                    "Education",
                    "Others"
                ];

                categories.forEach(async (category) => {
                    const docRef = doc(collectionRef, category);
                    try {
                        await setDoc(docRef, { name: category });
                        console.log(`${category} document created successfully.`);
                    } catch (error) {
                        console.error(`Error creating ${category} document:`, error);
                    }
                });
                this.fetchCategories();         
            } 
        });
    },
    methods: {
        // Method to fetch user's stored category list from firebase
        async fetchCategories() {
            if (!this.user || !this.user.email) {
                console.error("User or user email is undefined.");
                return;  // Exit if no user or userEmail is defined
            }

            const db = getFirestore(firebaseApp);
            const userEmail = this.user.email;
            const categoriesCollectionRef = collection(db, `${this.user.email}list`);

            try {
                const querySnapshot = await getDocs(categoriesCollectionRef);
                this.categories = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                console.log("Categories fetched successfully:", this.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },

        // Method to handle clicks outside the modal
        handleClickOutside(event) {
            const modal = document.querySelector('.modal');
            if (modal && !modal.contains(event.target)) {
                const createBudgetButton = document.getElementById('createBudget');
                // Check if the click target is outside the modal and not the button
                if (event.target !== createBudgetButton) {
                    this.closeModal();
                }
            }
        },
        // Method to handle submission of new budget
        async addBudget() {
            console.log("Starting addBudget method");
            console.log("Selected Category:", this.selectedCategory);
            console.log("Amount:", this.amount);
            console.log("Is Valid Amount:", this.isValidAmount);

            if (!this.selectedCategory || !this.amount) {
                console.log("Validation failed: Category or amount not provided.");
                alert('Please select a category and enter an amount.');
                return;
            }

            const numAmount = parseFloat(this.amount);
            if (isNaN(numAmount) || numAmount < 0 || numAmount > 1000000) {
                console.log("Validation failed: Amount out of range.");
                alert("Budget amount is out of allowed range.");
                return;
            }

            const db = getFirestore(firebaseApp);
            const userEmail = this.user.email;

            try {
                if (this.selectedCategory === 'new') {
                    const helloCollectionRef = collection(db, `${this.user.email}list`);
                    const categoryDocRef = doc(helloCollectionRef, this.newCategory);

                    // Check if the category already exists in the collection
                    const docSnap = await getDoc(categoryDocRef);
                    if (!docSnap.exists()) {
                        await setDoc(categoryDocRef, { name: this.newCategory });
                        console.log("New category added to 'hello' collection:", this.newCategory);
                    }
                }
                        const categoryName = this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory; // The category name
                        const budgetAmount = numAmount; // The numerical budget amount

                        // Path to the category document within the user's email collection
                        const catDocRef = doc(collection(db, userEmail), categoryName);

                        // Prepare the budget data with the amount and timestamp
                        const budgetData = {
                            Date: new Date().toISOString(),
                            amount: budgetAmount,
                            budget: true,
                            expense: false,
                            expense_title: ""  
                        };

                // Add the budget document to the category subcollection
                await setDoc(catDocRef, budgetData, { merge: true });
                this.closeModal();
                this.fetchCategories();
                alert('Budget added successfully!');
                this.$emit("added");
            } catch (error) {
                console.error('Error adding budget or category: ', error);
                alert('Failed to add budget or category. Please try again.');
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
            if (decimalCheck.length > 2) {
                value = decimalCheck[0] + '.' + decimalCheck[1];
            }
            // Limit to two decimal places
            if (decimalCheck.length > 1 && decimalCheck[1].length > 2) {
                value = decimalCheck[0] + '.' + decimalCheck[1].substring(0, 2);
            }
            // Update the input field's value and the Vue model
            event.target.value = value;
            this.amount = value;
        }
    },
    beforeUnmount() {
        // Remove event listener when component is unmounted
        document.body.removeEventListener('click', this.handleClickOutside);
    },
    computed: {
        isValidNewCategory() {
            return !this.newCategory || (this.newCategory.length <= 20 && /^[a-zA-Z0-9 ]+$/.test(this.newCategory));
        },
        isValidAmount() {
            const numAmount = parseFloat(this.amount);
            return this.amount && !isNaN(numAmount) && numAmount >= 0 && numAmount <= 1000000;
        }
    }
    
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

/*.form-group {
    margin-bottom: 20px;
}*/

.formli {
    display: flex;
    align-items: center;
    margin-bottom: 20px
}

.formli label {
    width: 120px;
    text-align: right;
    margin-right: 10px;
}

.formli select,
.formli input[type="number"],
.formli input[type="text"] {
    flex: 1;
    padding: 10px;
    font-size: 16px;
}
.save {
    text-align: center;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #e3e4d4;
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
    margin-inline-end: 20px;
}

#addBudget {
    display: block;
    margin: 0 auto;
}

.warning {
    color: red;
    font-size: small;
    display: block;
    margin-top: 0.5em;
    text-align: center;
}
</style>
