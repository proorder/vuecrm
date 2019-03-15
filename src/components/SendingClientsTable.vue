<template>
  <div>
    <div class="alert alert-dismissible alert-warning" v-if="errors !== null">
      <button type="button" class="close" v-on:click="errors = null">
        &times;
      </button>
      <h4 class="alert-heading">Файл не загружен!</h4>
      <p class="mb-0">{{ errors }}</p>
    </div>
    <div v-if="loaded">
      <table class="clients-table">
        <thead>
          <tr>
            <td>ID</td>
            <td>Полное Имя</td>
            <td>Фактический адрес</td>
            <td>Отправлен в банк</td>
            <td>Документы</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>{{ client.id }}</td>
            <td>{{ client.fullName }}</td>
            <td>{{ client.actualAddress }}</td>
            <td>{{ client.sendingTo }}</td>
            <td class="text-left">
              <div v-for="(document, key) in client.documents" :key="key">
                {{ document.filename }}
              </div>
            </td>
            <td>
              <div class="form-group m-0">
                <div class="input-group">
                  <div class="custom-file">
                    <input
                      v-on:change="change"
                      type="file"
                      class="custom-file-input"
                      id="inputGroupFile02"
                      multiple
                    />
                    <label class="custom-file-label" for="inputGroupFile02"
                      >Выбрать файлы</label
                    >
                  </div>
                  <div
                    class="input-group-append"
                    v-on:click="upload($event, client.id)"
                  >
                    <span class="input-group-text">Загрузить</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination
        :pageCount="pageCount"
        :getList="getClientsList"
        class="mt-3"
      ></pagination>
    </div>
    <div v-else class="mt-3 progress">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        style="width: 100%"
      ></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import errorProcessing from "../utils/errorProcessing";
import { DOCUMENTS, CLIENTS } from "../queries";
import Pagination from "./Pagination";

export default {
  name: "SendingClientsTable",
  data: () => ({
    loaded: false,
    clients: [],
    errors: null,
    pageCount: null
  }),
  created() {
    this.getClientsList();
  },
  methods: {
    getClientsList() {
      this.loaded = false;
      const page = this.$route.query.page ? this.$route.query.page : 1;
      axios
        .get(CLIENTS, {
          params: {
            query: `
              query {
                allClients(state: "sending", page: ${page}, search: "${
              this.search
            }") {
                  page
                  pages
                  hasNext
                  hasPrev
                  objects {
                    id
                    fullName
                    actualAddress
                    sendingTo
                    documents {
                      file
                      filename
                    }
                  }
                }
              }
            `
          }
        })
        .then(res => {
          this.pageCount = res.data.data.allClients.pages;
          this.clients = res.data.data.allClients.objects;
          this.loaded = true;
        })
        .catch(err => {
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.getClientsList
            });
          }
          errorProcessing(err);
        });
    },
    upload(event, id) {
      const input = event.target.parentNode.querySelector(".custom-file-input");
      let form = new FormData();
      for (let key in input.files) {
        form.append("file", input.files[key]);
      }
      form.append("id", id);
      const label = event.target.parentNode.parentNode.parentNode.parentNode.querySelector(
        ".text-left"
      );
      const previousValue = label.innerHTML;
      label.innerHTML = `
        <div class="progress">
          <div class="progress-bar progress-bar-striped bg-success"></div>
        </div>`;
      axios
        .post(DOCUMENTS, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: pg => {
            label.querySelector(".progress-bar").style.width =
              pg.loaded / (pg.total / 100) + "%";
          }
        })
        .then(res => {
          const label = event.target.parentNode.parentNode.parentNode.parentNode.querySelector(
            ".text-left"
          );
          label.innerHTML = this.inner(res.data);
        })
        .catch(err => {
          label.innerHTML = previousValue;
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.getClientsList.bind(this, event, id)
            });
          }
          if (err.response !== undefined) {
            if (err.response.data.file !== undefined) {
              this.errors = err.response.data.file[0];
            }
          }
          errorProcessing(err);
        });
    },
    change(event) {
      this.errors = null;
      const label = event.target.parentNode.querySelector(".custom-file-label");
      label.innerHTML = event.target.files[0].name;
    },
    inner(data) {
      let inner = "";
      data.forEach(el => {
        inner += "<div>" + el.filename + "</div>";
      });
      return inner;
    }
  },
  computed: {
    search() {
      return this.$store.getters.search;
    }
  },
  props: ["state"],
  components: { Pagination }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../scss/vars.scss";

.clients-table {
  width: 100%;
  & > thead {
    font-weight: bold;
    td {
      padding: 4px 4px;
    }
  }
  & > tbody {
    & > tr {
      &:nth-child(odd) {
        background-color: #e9ecef;
      }
      & > td {
        padding: 4px 4px;
      }
    }
  }
}
.input-group-text {
  pointer-events: none;
}
.alert {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
.custom-file-label:after {
  content: "Выбрать" !important;
}
</style>
