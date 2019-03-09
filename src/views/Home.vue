<template>
  <div class="home m-3 row">
    <div class="col-4" v-if="is_superuser">
      <div class="card border-info mb-3">
        <div class="card-header">Группы</div>
        <div class="card-body">
          <p class="card-text">
            Какая-то необходимая информация, для краткого ознакомления.
            <br />
            <router-link
              class="btn btn-outline-info mt-3"
              :to="{ name: 'Группы' }"
              >Просмотреть</router-link
            >
          </p>
        </div>
      </div>
    </div>
    <div class="col-4" v-if="is_superuser">
      <div class="card border-success mb-3">
        <div class="card-header">Банки</div>
        <div class="card-body">
          <p class="card-text">
            Какая-то необходимая информация, для краткого ознакомления.
            <br />
            <router-link
              class="btn btn-outline-success mt-3"
              :to="{ name: 'Банки' }"
              >Просмотреть</router-link
            >
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card border-primary mb-3">
        <div class="card-header">Клиенты</div>
        <div class="card-body">
          <p class="card-text">
            Какая-то необходимая информация, для краткого ознакомления.
            <br />
            <router-link
              class="btn btn-outline-primary mt-3"
              :to="{ name: 'Клиенты' }"
              >Просмотреть</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data: () => ({
    is_superuser: false
  }),
  created() {
    this.is_superuser = localStorage.getItem("is_superuser") === "admin";
  },
  mounted: function() {},
  metaInfo: {
    title: "Главная страница"
  }
};
</script>
