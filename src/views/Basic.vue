<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <img src="../static/CRMLogo.png" />
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact
              >Место для логотипа. Главная страница
              <span class="sr-only">(current)</span></router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item profile-label">
            <b class="text-white">{{ full_name }}</b>
            <div class="profile-menu p-3">
              <div class="list-group">
                <a
                  href="#exit"
                  class="list-group-item list-group-item-action"
                  v-on:click="exit"
                >
                  Выход
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <div v-if="clients.length !== 0">
      <table>
        <tr class="table-success" v-for="client in clients" :key="client.id">
          <th scope="row">{{ client.id }}</th>
          <td>{{ client.full_name }}</td>
          <td>{{ client.actual_address }}</td>
          <td>{{ client.registration_address }}</td>
        </tr>
      </table>
    </div>
    <ol class="breadcrumb m-3">
      <router-link
        :to="{ name: route.meta.breadcrumb, params: { id: $route.params.id } }"
        tag="li"
        class="breadcrumb-item"
        v-for="(route, key) in $route.matched.filter(
          el => el.meta !== undefined && el.meta.breadcrumb !== undefined
        )"
        v-bind:key="key"
        exact
        >{{ route.meta.breadcrumb }}</router-link
      >
    </ol>
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { SEARCH } from "../queries";
import setAuthorizationToken from "../utils/setAuthorizationToken";

export default {
  name: "basic",
  data: () => ({
    clients: [],
    full_name: ""
  }),
  created() {
    this.full_name = localStorage.getItem("full_name");
  },
  computed: mapState(["breadcrumb"]),
  methods: {
    exit() {
      setAuthorizationToken(false);
    },
    search(event) {
      setTimeout(() => {
        axios.post(SEARCH, { search: event.target.value }).then(res => {
          this.clients = res.data;
        });
      }, 1500);
    }
  }
};
</script>

<style lang="scss">
.profile-label {
  &:hover {
    & .profile-menu {
      display: block;
    }
  }
  & .profile-menu {
    position: absolute;
    top: 30px;
    right: 0px;
    display: none;
  }
}
</style>
