<template>
  <div class="product-card">
    <!-- /*<img :src="product.image" :alt="product.name" class="product-image"> -->
    <div class="product-details">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-price">$ {{ product.price }}</p>
      <button class="view-more-button" @click="showDetails = !showDetails">
        {{ showDetails ? 'Hide Details' : 'View Details' }}
      </button>
      <div v-if="showDetails" class="more-details">
        <p>SKU: {{ product.sku }}</p>
        <p>Category: {{ product.category }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"ProductCard",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetails: false
    };
  }
};
</script>

<style scoped>
.product-card {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 1.2em;
  margin: 0;
}

.product-description {
  margin: 0 0 10px 0;
}

.product-price {
  font-weight: bold;
  margin: 0;
}

.view-more-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.more-details {
  margin-top: 10px;
}
</style>
