import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'
import 'whatwg-fetch'
import "isomorphic-fetch"
import "core-js/stable";
import "regenerator-runtime/runtime";

Vue.config.productionTip = false

window.Office.onReady(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
