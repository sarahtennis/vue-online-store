// product component using template literal
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>

                <p v-show="inStock">In Stock</p>
                <p v-show="!inStock" :class="{ 'line-through': !inStock }">Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>
                
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)"></div>

                <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>
            </div>

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>

        </div>
    `,
    data: function () {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'For warm feet',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-netural"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: 'green-white.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: 'blue-white.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        addReview: function (productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title: function () {
            return this.brand + ' ' + this.product
        },
        image: function () {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock: function () {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping: function () {
            if (this.premium) {
                return "Free"
            }

            return 2.99
        }
    }
})

// product reviews
Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-show="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">
                        {{ error }}
                    </li>
                </ul>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
    
            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
            </p>
    
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
        
            <p>
                <input type="submit" value="Submit">  
            </p>    
        </form>
    `,
    data: function () {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit: function () {
            if (this.name && this.review && this.rating) {

                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }

                // send up custom event
                this.$emit('review-submitted', productReview)

                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                if(!this.name) this.errors.push('Name required.')
                if(!this.review) this.errors.push('Review required.')
                if(!this.rating) this.errors.push('Rating required.')
            }
        }
    }
})

// create new Vue instance
// el: id of main Vue div
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart: function (id) {
            this.cart.push(id)
        }
    }
})