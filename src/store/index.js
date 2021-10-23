import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedInUserId: '',
    apiBaseUrl: process.env.VUE_APP_BACKEND_URL,
    highlightedText: ''
  },
  mutations: {
    SET_USER_ID (state, val) {
      state.loggedInUserId = val
    },
    SET_SELECTED_TEXT (state, val) {
      state.highlightedText = val
    }
  },
  actions: {
  },
  modules: {
  }
})
