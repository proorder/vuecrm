import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/login",
      name: "login",
      component: function() {
        return import(/* webpackChunkName: "auth" */ "./views/Login.vue");
      }
    },
    {
      path: "/",
      meta: { breadcrumb: "Главная страница" },
      component: function() {
        return import(/* webpackChunkName: "basic" */ "./views/Basic.vue");
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("jwtToken") == null) {
          next({
            path: "/login",
            params: { nextUrl: to.fullPath }
          });
        } else {
          next();
        }
      },
      children: [
        {
          path: "",
          name: "Главная страница",
          component: function() {
            return import(/* webpackChunkName: "home" */ "./views/Home.vue");
          }
        },
        {
          path: "/client",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          meta: { breadcrumb: "Клиенты" },
          component: function() {
            return import(/* webpackChunkName: "client" */ "./views/ClientParent.vue");
          },
          children: [
            {
              path: "",
              name: "Клиенты",
              component: function() {
                return import(/* webpackChunkName: "client" */ "./views/Client.vue");
              }
            },
            {
              path: "/client/:id",
              name: "Редактировать клиента",
              meta: { breadcrumb: "Редактировать клиента" },
              component: function() {
                return import(/* webpackChunkName: "client" */ "./views/AddClient.vue");
              }
            }
          ]
        },
        {
          path: "/banks",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          meta: { breadcrumb: "Банки" },
          component: function() {
            return import(/* webpackChunkName: "client" */ "./views/ClientParent.vue");
          },
          children: [
            {
              path: "",
              name: "Банки",
              component: function() {
                return import(/* webpackChunkName: "client" */ "./views/Banks.vue");
              }
            }
          ]
        },
        {
          path: "/groups",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          meta: { breadcrumb: "Группы" },
          component: function() {
            return import(/* webpackChunkName: "client" */ "./views/ClientParent.vue");
          },
          children: [
            {
              path: "",
              name: "Группы",
              component: function() {
                return import(/* webpackChunkName: "client" */ "./views/Groups.vue");
              }
            }
          ]
        }
      ]
    }
  ]
});
export default router;
