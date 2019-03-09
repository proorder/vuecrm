<template>
  <div class="add-user-component p-3">
    <ul class="list-group">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <p class="m-0">Менеджеры</p>
        <button
          type="button"
          class="close"
          v-on:click="close"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </li>
      <li
        v-for="(user, key) in element.children"
        v-bind:key="key"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <p class="m-0 text-left">
          <b>{{ user.username }}</b
          ><br />
          <small>{{ user.fullName || user.full_name }}</small>
        </p>
        <div class="btn btn-outline-danger btn-sm">Удалить</div>
      </li>
      <li class="list-group-item">
        <div class="form-group text-left mb-1">
          <label><small>Новый логин</small></label>
          <input
            type="text"
            class="form-control"
            placeholder="Логин"
            v-model="username"
          />
          <small v-if="username_error !== ''" class="form-text text-danger">{{
            username_error
          }}</small>
        </div>
        <div class="form-group text-left mb-1">
          <label><small>Полное Имя</small></label>
          <input
            type="text"
            class="form-control"
            placeholder="Ф.И.О."
            v-model="full_name"
          />
          <small v-if="full_name_error !== ''" class="form-text text-danger">{{
            full_name_error
          }}</small>
        </div>
        <div class="form-group text-left">
          <label><small>Пароль</small></label>
          <input
            type="text"
            class="form-control"
            placeholder="******"
            v-model="password"
          />
          <small v-if="password_error !== ''" class="form-text text-danger">{{
            password_error
          }}</small>
        </div>
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          v-on:click="addUser"
        >
          Добавить
          <div v-if="loaded" class="progress">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated w-100"
            ></div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import anime from "animejs";
import axios from "axios";
import errorProcessing from "../utils/errorProcessing";
import { MANAGERS } from "../queries";

export default {
  name: "AddUser",
  data: () => ({
    username: "",
    full_name: "",
    password: "",
    username_error: "",
    full_name_error: "",
    password_error: "",
    loaded: false
  }),
  methods: {
    addUser() {
      if (this.full_name.replace(/\s/g, "") === "") {
        this.full_name_error = "Поле не может быть пустым";
        return;
      } else if (this.username.replace(/\s/g, "") === "") {
        this.username_error = "Поле не может быть пустым";
        return;
      } else if (this.password.replace(/\s/g, "") === "") {
        this.password_error = "Поле не может быть пустым";
        return;
      }
      this.loaded = true;
      axios
        .post(MANAGERS, {
          group: this.element.group,
          username: this.username,
          full_name: this.full_name,
          password: this.password
        })
        .then(res => {
          this.pushUser(res.data);
          this.loaded = false;
        })
        .catch(err => {
          this.loaded = false;
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.addUser
            });
          } else {
            this.full_name_error =
              err.response.data.full_name !== undefined
                ? err.response.data.full_name.join(" ")
                : "";
            this.username_error =
              err.response.data.username !== undefined
                ? err.response.data.username.join(" ")
                : "";
            this.password_error =
              err.response.data.password !== undefined
                ? err.response.data.password.join(" ")
                : "";
          }
          errorProcessing(err);
        });
    }
  },
  mounted() {
    document.querySelector(".add-user-component").style.marginTop =
      this.top + "px";
    const el = document.querySelector(".groups-page");
    anime({
      targets: el,
      scrollLeft: {
        value: el.offsetWidth - el.offsetLeft,
        easing: "linear"
      }
    });
    anime({
      targets: document.querySelector(".add-user-component"),
      opacity: {
        value: 1
      },
      translateY: ["50px", "0px"],
      delay: 200
    });
  },
  watch: {
    top(newTop) {
      anime({
        targets: document.querySelector(".add-user-component"),
        marginTop: newTop + "px"
      });
    }
  },
  props: ["element", "top", "close", "pushUser"]
};
</script>

<style lang="scss" scoped>
.add-user-component {
  min-width: 320px;
  opacity: 0;
}
</style>
