import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Snippets from '../views/Snippets.vue'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/snippets',
    name: 'Snippets',
    component: Snippets
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
