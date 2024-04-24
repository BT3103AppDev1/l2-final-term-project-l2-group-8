<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="product.image" class="product-image">
    </div>
    <div class="product-details">
      <div class="vertical-text">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
      </div>
      <a :href="product.url" class="view-more-button" >
        View Details
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
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
  },
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.product-image-container {
  display: flex;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 320px;
  height: 320px;
  border-radius: 5px;
}

.product-details {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column; 
}

.vertical-text {
  display: flex;
  align-items: center;
  flex-direction: column;
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
  background-color: #92a579;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.more-details {
  margin-top: 10px;
}

</style>