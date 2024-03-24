<template>
    <div>
        <!-- Your modal content here -->
        <button id= "createBudget" @click="showModal = true">Add Budget</button>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span @click="closeModal" class="close">&times;</span>
                <!-- <h3>Add Budget</h3> -->
                <label for="category">Category:</label>
                <select v-model="selectedCategory">
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                    </option>
                    <option value="new">Add a new budget category</option>
                </select>
                <div v-if="selectedCategory === 'new'" id="newCategory">
                    <label for="newCategory">New Category Name:</label>
                    <input type="text" v-model="newCategory" placeholder="Enter new category name">
                </div><br><br>
                <label for="amount">Amount:</label>
                <input type="number" v-model="amount" min="0" max="1000000"><br><br>
                <button @click="addBudget" >Add</button>
            </div>
        </div>
    </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from '../firebase.js';

export default {
    data() {
        return {
            showModal: false,
            selectedCategory: '',
            newCategory: '',
            amount: null,
            categories: [
                { id: 'food', name: 'Food' },
                { id: 'transportation', name: 'Transportation' },
                // Add more default categories as needed
            ]
        };
    },
    methods: {
        async addBudget() {
            // Validate input
            if (!this.selectedCategory || !this.amount) {
                alert('Please select a category and enter an amount.');
                return;
            }

            // Initialize Firestore
            const db = getFirestore(firebaseApp);

            try {
                // Add budget to Firestore
                const docRef = await addDoc(collection(db, 'budgets'), {
                    category: this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory,
                    amount: this.amount,
                });

                // Optionally refresh the page
                location.reload();

                // Close modal
                this.closeModal();
            } catch (error) {
                console.error('Error adding budget: ', error);
            }
        },
        closeModal() {
            this.showModal = false;
            this.selectedCategory = '';
            this.newCategory = '';
            this.amount = null;
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
    display: inline-block;
    text-align: left;
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
    margin-bottom: 5px;
}

label {
    margin-bottom: 5px;
    text-align: center;
    /* Align labels to the right */
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

#newCategory {
    display: inline-block;
}
</style>

