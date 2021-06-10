// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

Vue.createApp({
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    data() {
        return{
            api: 'https://vue3-course-api.hexschool.io/api',
            path: 'alphatest',
            products: [],
            product: {},
            loadingStatus: {
                loadingItem: '',
            },
            cart: {},
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: ''
                },
                message: ''
            }
        }
    },
    methods: {
        getData() {
            const url = `${this.api}/${this.path}/products`;
            axios.get(url).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                } else {
                    alert(res.data.message);
                }
            })
        },
        getProduct(id) {
            const url = `${this.api}/${this.path}/product/${id}`;
            this.loadingStatus.loadingItem = '';
            axios.get(url).then((res) => {
                if (res.data.success) {
                    this.loadingStatus.loadingItem = '';
                    this.product = res.data.product;
                    this.$refs.userProductModal.openModal();
                } else {
                    alert(res.data.message)
                }
            });
        },
        addToCart(id, qty = 1) {
            const url = `${this.api}/${this.path}/cart`;
            this.loadingStatus.loadingItem = id;
            const cart = {
                product_id: id,
                qty,
            };
            this.$refs.userProductModal.hideModal();
            axios.post(url, {data: cart}).then((res) => {
                if (res.data.success) {
                    alert(res.data.message);
                    this.loadingStatus.loadingItem = '';
                    this.getCart();
                } else {
                    alert(res.data.message);
                }
            })
        },
        getCart() {
            const url = `${this.api}/${this.path}/cart`;
            axios.get(url).then((res) => {
                if(res.data.success) {
                    this.cart = res.data.data;
                } else {
                    alert(res.data.message)
                }
            })
        },
        delAllCart() {
            const url = `${this.api}/${this.path}/carts`;
            axios.delete(url).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    this.getCart();
                } else {
                    alert(res.data.message)
                }
            })
        },
        removeCartItem(id) {
            const url = `${this.api}/${this.path}/cart/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.delete(url).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    this.loadingStatus.loadingItem = '';
                    this.getCart();
                } else {
                    alert(res.data.message);
                }
            })
        },
        createOrder() {
            const url = `${this.api}/${this.path}/order`;
            const order = this.form;
            axios.post(url, {data: order}).then((res) => {
                if(res.data.success) {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                } else {
                    alert(res.data.message);
                }
            });
        }
    },
    created() {
        this.getData();
        this.getCart();
    }
})

.component('userProductModal', userProductModal)
.mount('#app');