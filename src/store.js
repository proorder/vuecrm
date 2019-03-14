import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastPath: "",
    breadcrumb: [],
    connectionRefused: false,
    search: ""
  },
  getters: {
    search: state => state.search
  },
  mutations: {
    connectionRefused(state, payload) {
      state.connectionRefused = payload.refused;
    },
    addCrumb(state, payload) {
      state.breadcrumb.unshift(payload);
    },
    delCrumb(state, payload) {
      const crumb = state.breadcrumb.find(el => {
        if (el.name === payload) return el;
      });
      state.breadcrumb.splice(state.breadcrumb.indexOf(crumb), 1);
    },
    enterSearch(state, payload) {
      state.search = payload.value;
    }
  },
  actions: {}
});
