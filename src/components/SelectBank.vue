<template>
  <div class="popup">
    <div class="popup-container">
      <div v-if="loaded" class="list-group">
        <button
          v-for="(bank, key) in banks"
          :key="key"
          type="button"
          class="text-left list-group-item list-group-item-action"
          v-on:click="choose(bank.fullName)"
        >
          {{ bank.fullName }}
          <br />
          <small>{{ bank.conditions }}</small>
        </button>
      </div>
      <div v-else class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated w-100"
        ></div>
      </div>
    </div>
    <div class="substrate" v-on:click="close"></div>
  </div>
</template>

<script>
import axios from "axios";
import anime from "animejs";
import { CLIENTS } from "../queries";
import errorProcessing from "../utils/errorProcessing";

export default {
  name: "SelectBank",
  mounted() {
    anime({
      targets: document.querySelector(".substrate"),
      opacity: 0.3,
      easing: "linear",
      duration: 300
    });
    this.getBanksList();
  },
  data: () => ({
    loaded: false,
    banks: []
  }),
  methods: {
    choose(name) {
      this.close(false, name);
    },
    getBanksList() {
      this.loaded = false;
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
          anime({
            targets: document.querySelector(".popup-container"),
            translateY: ["50px", "0px"]
          });
        })
        .catch(err => {
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.getBanksList
            });
          }
          errorProcessing(err);
        });
    }
  },
  props: ["close"]
};
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > .popup-container {
    min-width: 320px;
    background: #fff;
    & > .list-group {
      min-width: 320px;
    }
  }
  & > .substrate {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: -1;
    background: rgb(0, 0, 0);
    opacity: 0;
  }
}
</style>
