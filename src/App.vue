<template>
  <div id="app">
    <router-view></router-view>
    <div v-if="$store.state.connectionRefused" class="modal-dialog absolute">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Соединение потеряно</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            v-on:click="closeRefuse"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>
            Сервер не ответил на ваш запрос.<br />Проверьте соединение с
            интернетом.
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            v-on:click="repeatConnect"
          >
            Повторить попытку
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            v-on:click="closeRefuse"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    repeatConnect() {
      this.$store.state.connectionRefused();
      this.$store.commit("connectionRefused", { refused: false });
    },
    closeRefuse() {
      this.$store.commit("connectionRefused", { refused: false });
    }
  }
};
</script>

<style lang="scss">
@import "static/bootstrap.min.css";
@import "scss/vars.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.active {
      color: #42b983;
    }
  }
}
.breadcrumb li:not(.active) {
  cursor: pointer;
}
.modal-dialog.absolute {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
