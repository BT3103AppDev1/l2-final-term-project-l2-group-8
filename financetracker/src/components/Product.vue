<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="product.image" class="product-image">
    </div>
    <div class="product-details">
      <div class="vertical-text">
        <h3 class="product-name">{{ product.name }}</h3><br>
        <p class="product-description">{{ product.description }}</p>
      </div>
      <a :href="product.url" target="_blank" class="view-more-button">
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
  border-radius: 5%;
  padding: 10px;
  margin-bottom: 7vh;
  border-width: 0;

}

.product-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.5em;
}

.product-image {
  width: 25vw;
  height: 30vh;
  border-radius: 5px;
}

.product-details {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column; 
  text-align:justify;
  padding: 1em;
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
  height: 5vh;
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

</style>