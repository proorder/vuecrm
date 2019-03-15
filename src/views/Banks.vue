<template>
  <div class="p-3">
    <table v-if="loaded" class="clients-table">
      <thead>
        <tr>
          <td>ID</td>
          <td>Наименование банка</td>
          <td>Условия банка</td>
          <td>Email</td>
          <td>
            <div class="btn btn-primary w-100" v-on:click="modal = true">
              Добавить
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bank in banks" v-bind:key="bank.id">
          <td>{{ bank.id }}</td>
          <td>{{ bank.fullName }}</td>
          <td>{{ bank.conditions }}</td>
          <td>{{ bank.email }}</td>
          <td>
            <router-link
              class="btn btn-outline-primary w-100"
              :to="{ name: 'Редактировать клиента' }"
              >Открыть</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="mt-3 progress">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        style="width: 100%"
      ></div>
    </div>
    <add-bank v-if="modal" :close="closeModal"></add-bank>
  </div>
</template>

<script>
import axios from "axios";
import errorProcessing from "../utils/errorProcessing";
import { CLIENTS } from "../queries";
import AddBank from "../components/AddBank";

export default {
  name: "Banks",
  data: () => ({
    modal: false,
    loaded: false,
    banks: []
  }),
  metaInfo: {
    title: "Банки"
  },
  created() {
    this.getBanksList();
  },
  methods: {
    getBanksList() {
      axios
        .post(CLIENTS, {
          query: `
              query {
                allBanks {
                  id
                  fullName
                  conditions
                  email
                }
              }
            `
        })
        .then(res => {
          this.banks = res.data.data.allBanks;
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
    closeModal(event, success = false) {
      if (success) {
        this.loaded = false;
        this.getBanksList();
      }
      this.modal = false;
    }
  },
  components: { AddBank }
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
