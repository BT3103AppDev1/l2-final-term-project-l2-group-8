<template>
  <div class="container">
    <div class="header">
      <h1>Finance Tracker - Financial Products</h1>
    </div>
    
    <div class="product-grid">
      <div class="product" v-for="product in products" :key="product.id">
        <img :src="product.image" :alt="product.name">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <a :href="product.url" class="view-details">View Details</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceTracker',
  data() {
    return {
      products: [
        {
          id: 1,
          image: '1_photo.jpg',
          name: 'Currency Linked Investments',
          description: 'Potential to earn enhanced yields through Currency Linked Investments.',
          url: 'https://www.dbs.com.sg/treasures/investments/fx-and-cash-management/currency-linked-investments'
        },
        {
          id: 2,
          image: '2_photo.jpg',
          name: 'Equity Linked Notes',
          description: 'Structured notes linked to shares, tailor-made to your risk profile and market views.',
          url: 'https://www.dbs.com.sg/treasures/investments/product-suite/equities/equity-linked-investments'
        },
        {
          id: 3,
          image: '3_photo.jpg',
          name: 'Reverse Equity Linked Notes',
          description: 'Enhance returns from stocks when your view of the market is stable or mildly bearish.',
          url: 'https://www.dbs.com.sg/treasures/investments/product-suite/structured-investments/reverse-equity-linked-notes'
        },
        {
          id: 4,
          image: '4_photo.jpg',
          name: 'Fixed Coupon Notes',
          description: 'Equity-based structured notes that provide regular coupons regardless of market conditions.',
          url: 'https://www.dbs.com.sg/treasures/investments/product-suite/structured-investments/fixed-coupon-notes'
        }
      ]
    };
  }
};
</script>

<style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background: #f4f9f4; /* Light green background */
    margin: 0;
    padding: 0;
    color: #333; /* Standard text color for readability */
  }
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
  }
  .header {
    background-color: #86a873; /* Avocado green header */
    color: white;
    padding: 20px;
    text-align: center;
  }
  .product-grid {
    display: flex;
    flex-wrap: wrap; /* Allow multiple lines */
    justify-content: space-around; /* Space products evenly */
  }
  .product {
    width: 45%; /* Adjust width for two products per line */
    background-color: #e3e4db; /* Soft green for product background */
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* Softer shadow for depth */
    margin-bottom: 30px;
  }
  .product img {
    width: 100%; /* Adjust image to take full width of the product box */
    height: auto; /* Adjust height based on image */
    object-fit: cover; /* Cover the box without distorting the image */
    display: block;
    margin-bottom: 15px;
    border-radius: 8px; /* Slight rounding of image corners */
  }
  .product h3, .product p {
    text-align: center;
  }
  .view-details {
    text-decoration: none;
    color: white;
    background-color: #6a8759; /* Darker avocado green for buttons */
    padding: 10px 20px;
    display: block;
    width: fit-content;
    margin: 20px auto 0;
    border-radius: 4px; /* Rounded corners for buttons */
    box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Subtle shadow for buttons */
  }
</style>
