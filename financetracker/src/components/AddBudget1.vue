<template>
    <div>
        <!-- Your modal content here -->
        <button id="createBudget" @click="showModal = true">Add Budget</button>
        <v-dialog v-model="showModal" max-width="500px">
            <template v-slot:activator="{ on }">
                <span id="createBudget" @click="showModal = true">Add Budget</span>
            </template>
            <v-card>
                <v-card-title>Add Budget</v-card-title>
                <v-card-text>
                    <v-combobox v-model="selectedCategory" label="Category"
                        :items="categories.map(category => category.name)" return-object></v-combobox>
                    <v-text-field v-if="selectedCategory === 'new'" v-model="newCategory"
                        label="New Category Name"></v-text-field>
                    <v-text-field v-model="amount" label="Amount" type="number" min="0" max="1000000"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <span id="addBudget" @click="addBudget" style="cursor: pointer; color: blue;">Add</span>
                    <span id="closeModal" @click="closeModal" style="cursor: pointer; color: blue;">Close</span>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from '../firebase.js';
// import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VCombobox, VTextField } from 'vuetify';

export default {
    components: {
        VDialog,
        VCard,
        VCardTitle,
        VCardText,
        VCardActions,
        VCombobox,
        VTextField
    },
    data() {
        return {
            showModal: false,
            selectedCategory: null,
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
                // location.reload();

                // Close modal
                this.closeModal();
            } catch (error) {
                console.error('Error adding budget: ', error);
            }
        },
        closeModal() {
            this.showModal = false;
            this.selectedCategory = null;
            this.newCategory = '';
            this.amount = null;
        }
    },
};
</script>

<style scoped>
#createBudget {
    cursor: pointer;
}
</style>
