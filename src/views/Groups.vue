<template>
  <div class="groups-page">
    <div class="basis p-3">
      <table v-if="loaded" class="clients-table">
        <thead>
          <tr>
            <td>ID</td>
            <td>Наименование группы</td>
            <td>
              <div class="btn btn-primary w-100" v-on:click="modal = true">
                Добавить группу
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in groups" v-bind:key="group.id">
            <td>{{ group.id }}</td>
            <td>{{ group.group }}</td>
            <td>
              <div
                class="btn btn-outline-primary w-100"
                v-on:click="open(group.id, $event)"
              >
                Открыть
              </div>
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
      <add-group v-if="modal" :close="closeModal"></add-group>
    </div>
    <add-user
      v-if="userside"
      :pushUser="addUser"
      :close="closeUserside"
      v-bind:top="group_top"
      v-bind:element="active_group"
    ></add-user>
  </div>
</template>

<script>
import axios from "axios";
import errorProcessing from "../utils/errorProcessing";
import { CLIENTS } from "../queries";
import AddUser from "../components/AddUser";
import AddGroup from "../components/AddGroup";
import anime from "animejs";

export default {
  name: "Groups",
  data: () => ({
    modal: false,
    loaded: false,
    groups: [],
    active_group: {},
    group_top: 0,
    userside: false
  }),
  metaInfo: {
    title: "Группы"
  },
  created() {
    this.getGroupsList();
  },
  methods: {
    getGroupsList() {
      axios
        .post(CLIENTS, {
          query: `
          query {
            allGroups {
              id
              group
              children {
                id
                username
                fullName
              }
            }
          }
        `
        })
        .then(res => {
          this.groups = res.data.data.allGroups;
          this.loaded = true;
        })
        .catch(err => {
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.getGroupsList
            });
          }
          errorProcessing(err);
        });
    },
    open(id, event) {
      //const top = event.target.getBoundingClientRect().y;
      const top = event.target.parentNode.parentNode.offsetTop;
      this.active_group = this.groups.find(el => el.id === id);
      this.group_top = top;
      this.userside = false;
      this.userside = true;
    },
    closeUserside() {
      anime({
        targets: document.querySelector(".groups-page"),
        scrollLeft: {
          value: 0,
          duration: 300,
          easing: "linear"
        }
      });
      anime({
        targets: document.querySelector(".add-user-component"),
        opacity: {
          value: 0
        },
        translateY: ["0px", "50px"],
        duration: 300
      });
      setTimeout(() => {
        this.userside = false;
      }, 300);
    },
    closeModal(event, success = false) {
      if (success) {
        this.loaded = false;
        this.getGroupsList();
      }
      this.modal = false;
    },
    addUser(data) {
      this.active_group.children.push(data);
    }
  },
  components: { AddUser, AddGroup }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../scss/vars.scss";

.groups-page {
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  & > .basis {
    min-width: 100vw;
  }
}

.clients-table {
  width: 100%;
  & > thead {
    font-weight: bold;
    td {
      padding: 4px 0px;
      &:last-of-type {
        padding: 4px;
        width: 200px;
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
          width: 200px;
        }
      }
    }
  }
}
</style>
