import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedInUserId: '',
    apiBaseUrl: 'https://pragma-outlook-integration-owkooxhu2q-uc.a.run.app/outlook'
  },
  mutations: {
    SET_USER_ID (state, val) {
      state.loggedInUserId = val
    }
  },
  actions: {
  },
  modules: {
  }
})
