import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedInUserId: '',
    apiBaseUrl: 'https://pragma-outlook-integration-owkooxhu2q-uc.a.run.app/outlook',
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
