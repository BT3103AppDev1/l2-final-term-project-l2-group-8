<template>
    <div>
        <button id="createExpense" @click="showModal = true">Add Expense</button>
        <div v-if="showModal" class="modal">
            <!--modal content-->
            <form class="modal-content">
                <span @click="closeModal" class="close">&times;</span><br>
                <div class="formli">
                    <!--1. category: drop down menu options-->
                    <label for="category">Category:</label>
                    <select v-model="selectedCategory">
                        <option disabled value="" selected>Select a category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name
                            }}</option>
                        <option value="new">Add a new category</option>
                    </select>
                </div>
                <!--Create and customise new category-->
                <div v-if="selectedCategory === 'new'" id="newCategory" class="formli">
                    <label for="newCategory">New Category:</label>
                    <input type="text" v-model="newCategory" placeholder="Enter new category name">
                </div>
                <div>
                    <!-- Warning message for invalid category -->
                    <span v-if="newCategory && !isValidNewCategory" class="warning">New category name must be less than
                        20 characters and contain only letters, numbers, and spaces.</span>
                </div>
                <div class="formli">
                    <!--2. Title-->
                    <label for="title">Title:</label>
                    <input type="text" v-model="title" placeholder="Enter expense title name" @input="formatTitle">
                </div>
                <div>
                    <!-- Warning message for invalid title -->
                    <span v-if="!isValidTitle" class="warning">Title must be less than 20 characters</span>
                </div>
                <div class="formli">
                    <!--3. Amount-->
                    <label for="amount">Amount:</label>
                    <input type="text" v-model="amount" placeholder="00.00" @input="formatAmount">
                </div>
                <div>
                    <!-- Warning message for invalid amount -->
                    <span v-if="!isValidAmount" class="warning">Expense must be between 0 and 1,000,000.</span>
                </div>
                <div class="formli">
                    <!--4. Date-->
                    <label for="time">Select Time:</label>
                    <input type="date" id="time" v-model="selectedTime">
                </div>
                <div class="save">
                    <button id="addExpense" type="button" @click.prevent="addExpense">Add</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore, doc, setDoc, getDocs, getDoc, collection, addDoc} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
    name:"AddExpense",
    data() {
        return {
            user: null,
            showModal: false,
            selectedCategory: '',
            newCategory: '',
            amount: '',
            title: '',
            categories: [],
            selectedTime: new Date().toISOString().substring(0, 10) // Set default value to current date (YYYY-MM-DD format)
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
            })
    },
    computed: {
        isValidNewCategory() {
            return !this.newCategory || (this.newCategory.length <= 20 && /^[a-zA-Z0-9 ]+$/.test(this.newCategory));
        },
        isValidTitle() {
            return !this.title || this.title.length <= 20;
        },
        isValidAmount() {
            const numAmount = parseFloat(this.amount);
            return this.amount && !isNaN(numAmount) && numAmount >= 0 && numAmount <= 1000000;
        },
        selectedMonth() {// Extract month from selectedTime
            return this.selectedTime.split('-')[1];
        }
    },
    methods: {
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
                const createExpenseButton = document.getElementById('createExpense');
                // Check if the click target is outside the modal and not the button
                if (event.target !== createExpenseButton) {
                    this.closeModal();
                }
            }
        },

        async addExpense() {
            // Validate input
            if (!this.selectedCategory || !this.amount || !this.title || !this.selectedTime) {
                alert('Please fill in all the above fields.');
                return;
            }

            const numAmount = parseFloat(this.amount);
            if (isNaN(numAmount) || numAmount < 0 || numAmount > 1000000) {
                alert("Expense amount is out of allowed range.");
                return;
            }


            if (this.selectedCategory === 'new') {
                if (!this.newCategory) {
                    alert('New category name cannot be empty.');
                    return;
                } else if (this.newCategory.length > 20) {
                    alert('Category name exceeds the maximum symbol limit (20 characters).');
                    return;
                } else if (!/^[a-zA-Z0-9 ]+$/.test(this.newCategory)) {
                    alert('Category cannot contain special characters.');
                    return;
                }
            }

            const db = getFirestore(firebaseApp);
            const userEmail = this.user.email;
            // Generate a random field name using current timestamp
            const randomFieldName = `field_${Date.now()}`;
         
            try {
                if (this.selectedCategory === 'new') {
                    const helloCollectionRef = collection(db, `${this.user.email}list`);
                    const categoryDocRef = doc(helloCollectionRef, this.newCategory);

                    // Check if the category already exists in the collection
                    const docSnap = await getDoc(categoryDocRef);
                    if (!docSnap.exists()) {
                        await setDoc(categoryDocRef, { name: this.newCategory });
                        //this.categories.push({ id: this.newCategory, name: this.newCategory }); // Update local categories array
                        console.log("New category added to 'hello' collection:", this.newCategory);
                    }
                }
                // Get the category
                const userCategory = this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory;
                // Get a reference to the document
                const docRef = doc(db, userEmail, userCategory);
                const expenseField = {
                    Date: this.selectedTime,
                    amount: this.amount,
                    budget: false,
                    expense: true,
                    expense_title: this.title
                }
                await setDoc(docRef, { [randomFieldName]: expenseField }, { merge: true });

                alert(" Saving your expense for: " + this.title)
                this.fetchCategories();
                this.closeModal();
                this.$emit("added");
            } catch (error) {
                console.error('Error adding expense: ', error);
                alert('Failed to add expense. Please try again.');
            }
        },
        
        closeModal() {
            this.showModal = false;
            this.selectedCategory = '';
            this.newCategory = '';
            this.amount= '';
            this.title= ''
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
    beforeUnmount() {
        // Remove event listener when component is unmounted
        document.body.removeEventListener('click', this.handleClickOutside);
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
    width: 400px;
    margin: 0 auto;
}

.close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 20px;
    cursor: pointer;
}

.formli {
    display: flex;
    align-items: center;
    margin-bottom: 20px
}

.formli label {
    width:120px;
    text-align:right;
    margin-right:10px;
}

.formli select,
.formli input[type="text"],
.formli input[type="date"] {
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

#createExpense {
    float: inline-end;
    margin-right: 20px;
}

#addExpense {
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