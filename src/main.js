import Vue from 'vue'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css"
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Paginate from 'vuejs-paginate'
import VueSmoothScroll from 'vue2-smooth-scroll'
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
 
Vue.use(VueLoaders);
// Smooth scroll
Vue.use(VueSmoothScroll,{
  duration: 700,
  updateHistory: true,
})

// Sweet alert dialog
Vue.use(VueSweetalert2);

// paginator component
Vue.component('paginate', Paginate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
