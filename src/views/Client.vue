<template>
  <div class="client p-3">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link show"
          v-bind:class="{ active: this.state === 'raw' }"
          v-on:click="open('raw', $event)"
          href="#raw"
          >Сырой</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link show"
          v-bind:class="{ active: this.state === 'sending' }"
          v-on:click="open('sending', $event)"
          href="#sending"
          >Отправлены в банк</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link show"
          v-bind:class="{ active: this.state === 'approved' }"
          v-on:click="open('approved', $event)"
          href="#approved"
          >Одобренные</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link show"
          v-bind:class="{ active: this.state === 'client_refused' }"
          v-on:click="open('client_refused', $event)"
          href="#clientrefused"
          >Отказались клиенты</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link show"
          v-bind:class="{ active: this.state === 'bank_refused' }"
          v-on:click="open('bank_refused', $event)"
          href="#bankrefused"
          >Отказано банком</a
        >
      </li>
      <li class="nav-item ml-auto">
        <input
          class="form-control search-input"
          type="text"
          placeholder="Поиск"
          v-on:keyup="search"
        />
      </li>
    </ul>
    <div v-if="state === 'raw'">
      <clients-table></clients-table>
    </div>
    <div v-else-if="state === 'sending'">
      <sending-clients-table></sending-clients-table>
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
// @ is an alias to /src
import ClientsTable from "@/components/ClientsTable.vue";
import SendingClientsTable from "@/components/SendingClientsTable.vue";
import { mapGetters } from "vuex";

export default {
  name: "client",
  methods: {
    open(type, event) {
      event.preventDefault();
      this.$router.push({
        query: { ...this.$route.query, ...{ state: type, page: 1 } }
      });
      this.state = type;
    },
    search(event) {
      if (!this.search_bool) {
        this.search_bool = true;
        setTimeout(() => {
          this.search_bool = false;
          this.$store.commit("enterSearch", { value: event.target.value });
          // axios.post(SEARCH, { search: event.target.value }).then(res => {
          //   this.clients = res.data;
          // });
        }, 1500);
      }
    }
  },
  data: () => ({
    state: "raw",
    search_bool: false
  }),
  metaInfo: {
    title: "Клиенты"
  },
  created: function() {
    this.state = this.$route.query.state ? this.$route.query.state : "raw";
  },
  components: {
    ClientsTable,
    SendingClientsTable
  },
  computed: {
    ...mapGetters({ search_value: "search" })
  }
};
</script>
