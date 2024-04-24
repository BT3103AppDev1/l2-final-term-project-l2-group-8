<template>
    <body>     
        <div class="container">
            <div class="header">
                    <p>Finance Tracker - Financial Products</p>
            </div>
            <div class="product-grid">
                <div class="product-row" v-for="(row, rowIndex) in productRows" :key="rowIndex">
                    <div v-for="(product, columnIndex) in row" :key="columnIndex" class="product-cell">
                        <ProductCard :product="product" />
                    </div>
                </div>
            </div>
        </div>  
    </body>
</template>

<script>
import ProductCard from "@/component/Product.vue"
import img1 from '@/assets/1_photo.jpg'
import img2 from '@/assets/2_photo.jpg'
import img3 from '@/assets/3_photo.jpg'
import img4 from '@/assets/4_photo.jpg'
export default {
    name: 'product',
    components: {
        ProductCard
    },
    data() {
        return {
            products: [{
                id: 1,
                image: img1,
                name: 'Currency Linked Investments',
                description: 'Potential to earn enhanced yields through Currency Linked Investments.',
                url: 'https://www.dbs.com.sg/treasures/investments/fx-and-cash-management/currency-linked-investments'
            },
            {
                id: 2,
                image: img2,
                name: 'Equity Linked Notes',
                description: 'Structured notes linked to shares, tailor-made to your risk profile and market views.',
                url: 'https://www.dbs.com.sg/treasures/investments/product-suite/equities/equity-linked-investments'
            },
            {
                id: 3,
                image: img3,
                name: 'Reverse Equity Linked Notes',
                description: 'Enhance returns from stocks when your view of the market is stable or mildly bearish.',
                url: 'https://www.dbs.com.sg/treasures/investments/product-suite/structured-investments/reverse-equity-linked-notes'
            },
            {
                id: 4,
                image: img4,
                name: 'Fixed Coupon Notes',
                description: 'Equity-based structured notes that provide regular coupons regardless of market conditions.',
                url: 'https://www.dbs.com.sg/treasures/investments/product-suite/structured-investments/fixed-coupon-notes'
            }
            ]
        }
    },
    computed: {
        productRows() {
            const rows = [];
            for (let i = 0; i < this.products.length; i += 2) {
                rows.push(this.products.slice(i, i + 2));
            }
            return rows;
        }
    }
}
</script>

<style scoped>
body {
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  min-width: 1240px;
}

.header {
  background-color: #92a579; 
  color: #FFFFFF; 
  text-align:center;
  /* border: 1px solid red; */
  min-height:80px;
  width:1240px;
  margin: 0;
}

p {
    font-size:60px;
    margin: 0;
}

.container {
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  min-height: 100vh;
  min-width: 1240px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.product-cell {
  width: 100%;
  background-color: #e3e4d4;
}
</style>