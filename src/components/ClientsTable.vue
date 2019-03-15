<template>
  <div>
    <div v-if="loaded">
      <table class="clients-table">
        <thead>
          <tr>
            <td>ID</td>
            <td>Полное Имя</td>
            <td>Фактический адрес</td>
            <td>Email</td>
            <td>Сотовый телефон</td>
            <td>Паспортные данные</td>
            <td>Желаемый вид кредита</td>
            <td>Отправка в банк</td>
            <td>
              <router-link to="/client/add" class="btn btn-primary w-100"
                >Добавить</router-link
              >
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" v-bind:key="client.id">
            <td>{{ client.id }}</td>
            <td>{{ client.fullName }}</td>
            <td>{{ client.actualAddress }}</td>
            <td>{{ client.email }}</td>
            <td>
              {{
                client.phone.replace(
                  /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
                  "+$1 ($2) $3-$4-$5"
                )
              }}
            </td>
            <td>{{ client.passport }}</td>
            <td>
              <span
                v-if="client.wishfulCredit === 'Потребительский'"
                class="badge badge-success"
                >{{ client.wishfulCredit }}</span
              >
              <span
                v-else-if="client.wishfulCredit === 'Автокредит'"
                class="badge badge-warning"
                >{{ client.wishfulCredit }}</span
              >
              <span
                v-else-if="client.wishfulCredit === 'Ипотека'"
                class="badge badge-info"
                >{{ client.wishfulCredit }}</span
              >
              <span v-else class="badge badge-light">Не выбрано</span>
            </td>
            <td>
              <div class="btn btn-link" v-on:click="move(client.id)">
                Отправить
              </div>
            </td>
            <td>
              <router-link
                class="btn btn-outline-primary w-100"
                :to="{
                  name: 'Редактировать клиента',
                  params: { id: client.id }
                }"
                >Открыть</router-link
              >
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
    <select-bank :close="closeModal" v-if="modal"></select-bank>
  </div>
</template>

<script>
import axios from "axios";
import anime from "animejs";
import errorProcessing from "../utils/errorProcessing";
import { CLIENT, CLIENTS } from "../queries";
import SelectBank from "./SelectBank";
import Pagination from "./Pagination";

export default {
  name: "ClientsTable",
  data: () => ({
    loaded: false,
    clients: [],
    modal: false,
    client_id: null,
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
        .post(CLIENTS, {
          query: `
                    query {
                      allClients(state: "raw", page: ${page}, search: "${
            this.$store.getters.search
          }") {
                        page
                        pages
                        hasNext
                        hasPrev
                        objects {
                          id
                          fullName
                          actualAddress
                          email
                          phone
                          passport
                          wishfulCredit
                        }
                      }
                    }
                  `
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
    move(id) {
      this.client_id = id;
      this.modal = true;
    },
    closeModal(event, name = false) {
      if (name) {
        this.loaded = false;
        axios
          .put(CLIENT, {
            client_id: this.client_id,
            state: "sending",
            bank_name: name
          })
          .then(() => {
            for (let key in this.clients) {
              if (this.clients[key].id === this.client_id) {
                this.clients.splice(key, 1);
                break;
              }
            }
            this.loaded = true;
          })
          .catch(err => {
            if (err.response === undefined) {
              this.$store.commit("connectionRefused", {
                refused: this.closeModal.bind(this, event, name)
              });
            }
            errorProcessing(err);
          });
      }
      anime({
        targets: document.querySelector(".substrate"),
        opacity: 0,
        easing: "linear",
        duration: 300
      });
      setTimeout(() => {
        this.modal = false;
      }, 300);
    }
  },
  components: {
    SelectBank,
    Pagination
  },
  computed: {
    search() {
      return this.$store.getters.search;
    }
  },
  watch: {
    search() {
      this.getClientsList();
    }
  }
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
      padding: 4px 0px;
      &:last-of-type {
        padding: 4px;
        width: 120px;
      }
    }
  }
  & > tbody {
    & > tr {
      &:nth-child(odd) {
        background-color: #e9ecef;
      }
      & > td {
        padding: 4px 0px;
        &:last-of-type {
          padding: 4px;
          width: 120px;
        }
      }
    }
  }
}
</style>
