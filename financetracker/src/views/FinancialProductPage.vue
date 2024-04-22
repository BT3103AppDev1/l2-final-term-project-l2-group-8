<template>
    <body>
        <div id="container">
            <ProductCard v-for="product in products" :key="product.sku" :product="product" />
        </div>
    </body>
</template>

<script>
import ProductCard from "../components/Product.vue"
export default {
    name: 'Forum',
    components: {
        ProductCard
    },
    data() {
        return {
            products: [{
                name: 'Product 1',
                description: 'This is the description of Product 1',
                price: 19.99,
                sku: 'SKU001',
                category: 'Category 1'
            },
            {
                name: 'Product 2',
                description: 'This is the description of Product 2',
                price: 29.99,
                sku: 'SKU001',
                category: 'Category 1'
            },
            {
                name: 'Product 3',
                description: 'This is the description of Product 3',
                price: 39.99,
                sku: 'SKU001',
                category: 'Category 1'
            }
            ]          
        }
    },
    created() {
        this.posts = JSON.parse(localStorage.getItem('savedData')) || [];
    },
    methods: {
        upload() {
            this.posts.push(this.post);
            localStorage.setItem('savedData', JSON.stringify(this.posts));
            this.post = {name: "", title:"", text:""};
        }
    }
}
</script>

<style scoped>
body {
    background: linear-gradient(to right top, #49eded, #95d52d);
    background-size: cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    margin: 0;
}
#container {
    margin: 30px;
    width: 60%;
    background-color: #ffffff77;
    border-radius: 20px;
}
#add-a-post {
    margin: 20px;
    background-color: #ffffff;
    text-align: center;
    border-radius: 20px;
    padding: 10px;
}
textarea {
    border: none;
    outline: none;
    background-color: #ffffff;
    resize: none;
    height: 30px;
    width: 98%;
}
#text {
    height: 200px;
}
.view-posts {
    margin: 20px;
    background-color: #ffffff;
    border-radius: 20px;
    display: inline-block;
    padding: 10px;
}
button {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 40px;
    font-size: 15px;
    margin: 0 auto;
}
button:hover {
    background-color: #aaaaaa;
}
p {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-all;
}
</style>