<template>
  <div v-if="show" class="custom-alert">
    <div class="alert-content">
      <p>{{ message }}</p>
      <button @click="closeAlert">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: ""
    };
  },
  methods: {
    showAlert(message) {
      this.message = message;
      this.show = true;
    },
    closeAlert() {
      this.show = false;
      this.message = "";
    }
  }
};

async function getExpensesAndBudget(customAlertComponent) {
    try {
        const { expenses, budgetAmount } = await getExpensesAndBudgetFromBackend();

        if (expenses >= budgetAmount * 0.9) {
            customAlertComponent.showAlert('Your expenses have exceeded 90% of your budget!');
        }
    } catch (error) {
        console.error('Error fetching expenses and budget: ', error);
    }
}

export { getExpensesAndBudget };

</script>

<style>
.custom-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 5px;
}

.alert-content {
  text-align: center;
}

button {
  margin-top: 10px;
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>