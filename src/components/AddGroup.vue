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
                Наименование группы
              </label>
              <input
                type="text"
                class="form-control"
                placeholder="Наименование банка"
                v-model="group"
              />
              <small v-if="group_error !== ''" class="form-text text-danger">{{
                group_error
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
import { GROUPS } from "../queries";
import errorProcessing from "../utils/errorProcessing";

export default {
  name: "AddGroup",
  data: () => ({
    group: "",
    group_error: ""
  }),
  methods: {
    save() {
      if (this.group.replace(/\s/g, "") === "") {
        this.group_error = "Поле не может быть пустым";
        return;
      }
      axios
        .post(GROUPS, {
          group: this.group
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
            this.group_error =
              err.response.data.group !== undefined
                ? err.response.data.group.join(" ")
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
