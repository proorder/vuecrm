<template>
  <div class="fixed">
    <div class="modal-dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Добавить банк в список</h5>
            <button
              type="button"
              class="close"
              v-on:click="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <div class="form-group">
              <label>
                Наименование банка
              </label>
              <input
                type="text"
                class="form-control"
                placeholder="Наименование банка"
                v-model="full_name"
              />
              <small v-if="name_error !== ''" class="form-text text-danger">{{
                name_error
              }}</small>
            </div>
            <div class="form-group">
              <label>
                Условия банка
              </label>
              <textarea
                class="form-control"
                rows="3"
                v-model="conditions"
              ></textarea>
              <small
                v-if="conditions_error !== ''"
                class="form-text text-danger"
                >{{ conditions_error }}</small
              >
            </div>
            <div class="form-group">
              <label>
                Email-адрес
              </label>
              <input
                type="email"
                class="form-control"
                placeholder="email@address.com"
                v-model="email"
              />
              <small v-if="email_error !== ''" class="form-text text-danger">{{
                email_error
              }}</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-on:click="save">
              Сохранить
            </button>
            <button type="button" class="btn btn-secondary" v-on:click="close">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { BANKS } from "../queries";
import errorProcessing from "../utils/errorProcessing";

export default {
  name: "AddBank",
  data: () => ({
    full_name: "",
    conditions: "",
    email: "",
    name_error: "",
    conditions_error: "",
    email_error: ""
  }),
  methods: {
    save() {
      if (this.full_name.replace(/\s/g, "") === "") {
        this.name_error = "Поле не может быть пустым";
        return;
      } else if (this.email.replace(/\s/g, "") === "") {
        this.email_error = "Поле не может быть пустым";
        return;
      }
      axios
        .post(BANKS, {
          full_name: this.full_name,
          conditions: this.conditions,
          email: this.email
        })
        .then(() => {
          this.close(true, "success");
        })
        .catch(err => {
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.save
            });
          } else {
            this.name_error =
              err.response.data.full_name !== undefined
                ? err.response.data.full_name.join(" ")
                : "";
            this.email_error =
              err.response.data.email !== undefined
                ? err.response.data.email.join(" ")
                : "";
            this.conditions_error =
              err.response.data.conditions !== undefined
                ? err.response.data.conditions.join(" ")
                : "";
          }
          errorProcessing(err);
        });
    }
  },
  props: ["close"]
};
</script>
<style lang="scss" scoped>
.fixed {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-dialog {
  min-width: 400px;
}
</style>
