import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Meta from "vue-meta";
import setAuthorizationToken from "./utils/setAuthorizationToken";

Vue.use(Meta);
Vue.config.productionTip = false;

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  // eslint-disable-next-line no-console
}

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
