<template>
  <div class="d-flex justify-content-center align-items-center h100">
    <div class="card border-primary mb-3" style="max-width: 20rem;">
      <div class="card-header">Авторизация</div>
      <div class="card-body">
        <p class="card-text text-left">
          <label for="login">Логин:</label>
          <input
            id="login"
            type="text"
            class="form-control"
            placeholder="Login"
            v-model="username"
          />
          <label class="mt-2" for="pass">Пароль:</label>
          <input
            id="pass"
            type="password"
            class="form-control"
            placeholder="******"
            v-model="password"
          />
          <small class="text-danger mt-2 d-block" v-if="error !== ''">{{
            error
          }}</small>
          <span class="text-center d-block">
            <span class="btn btn-outline-primary mt-2" v-on:click="login"
              >Войти</span
            >
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { LOGIN } from "../queries";
import errorProcessing from "../utils/errorProcessing";
import setAuthorizationToken from "../utils/setAuthorizationToken";

export default {
  name: "auth",
  data: () => ({
    username: "",
    password: "",
    error: ""
  }),
  metaInfo: {
    title: "Авторизация"
  },
  created: function() {},
  methods: {
    isValid() {
      let errors = {};
      let isValid = true;

      if (this.username.replace(/\s/g, "") === "") {
        this.error = 'Поле "Логин" обязательно к заполнению';
        isValid = false;
      } else if (this.password.replace(/\s/g, "") === "") {
        isValid = false;
        errors.password = 'Поле "Пароль" обязательно к заполнению';
      }

      return isValid;
    },
    login() {
      if (this.isValid()) {
        axios
          .post(LOGIN, { username: this.username, password: this.password })
          .then(res => {
            localStorage.setItem("jwtToken", res.data.token);
            localStorage.setItem("full_name", res.data.full_name);
            localStorage.setItem("is_superuser", res.data.is_superuser);
            setAuthorizationToken(res.data.token);
            this.$router.push({
              path:
                this.$store.state.lastPath !== ""
                  ? this.$store.state.lastPath
                  : "/"
            });
          })
          .catch(err => {
            if (err.response === undefined) {
              this.$store.commit("connectionRefused", { refused: this.login });
            } else if (
              err.response.status === 404 ||
              err.response.status === 400
            ) {
              this.error = "Неправильные логин или пароль";
            }
            errorProcessing(err);
          });
      }
    }
  },
  components: {}
};
</script>

<style lang="scss">
html {
  height: 100%;
}
body {
  height: 100%;
}
#app {
  height: 100%;
}
.h100 {
  height: 100%;
}
.card {
  min-width: 300px;
}
</style>
