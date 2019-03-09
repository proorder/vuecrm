<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li
        v-bind:class="{
          'page-item': true,
          disabled: $route.query.page ? +$route.query.page === 1 : true
        }"
        v-on:click="prevPage"
      >
        <a class="page-link">Предыдущая</a>
      </li>
      <li
        class="page-item"
        v-for="(number, key) in paginationGenerator"
        v-bind:key="key"
        v-bind:class="{
          'page-item': true,
          active: $route.query.page
            ? number === +$route.query.page
            : number === 1
        }"
        v-on:click="setPage(number)"
      >
        <a class="page-link">{{ number }}</a>
      </li>
      <li
        v-bind:class="{
          'page-item': true,
          disabled: $route.query.page
            ? +$route.query.page === +pageCount
            : 1 === +pageCount
        }"
        v-on:click="nextPage"
      >
        <a class="page-link">Следующая</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Pagination",
  methods: {
    setPage(number) {
      this.$router.push({
        query: { ...this.$route.query, ...{ page: number } }
      });
      this.getList();
    },
    nextPage() {
      const nextPage = this.$route.query.page ? +this.$route.query.page + 1 : 2;
      this.setPage(nextPage);
    },
    prevPage() {
      const prevPage = this.$route.query.page ? +this.$route.query.page - 1 : 1;
      this.setPage(prevPage);
    }
  },
  computed: {
    paginationGenerator() {
      const page = this.$route.query.page ? +this.$route.query.page : 1;
      switch (page) {
        case 1:
        case 2: {
          let pages = [1];
          if (this.pageCount > 1) {
            pages.push(2);
          }
          if (this.pageCount > 2) {
            pages.push(3);
          }
          if (this.pageCount > 3) {
            pages.push(+this.pageCount);
          }
          return pages;
        }
        case +this.pageCount:
        case +this.pageCount - 1: {
          let pagesEnd = [+this.pageCount];
          if (this.pageCount > 1) {
            pagesEnd.unshift(+this.pageCount - 1);
          }
          if (this.pageCount > 2) {
            pagesEnd.unshift(+this.pageCount - 2);
          }
          if (this.pageCount > 3) {
            pagesEnd.unshift(0);
          }
          return pagesEnd;
        }
        default:
          return [1, page - 1, page, page + 1, +this.pageCount];
      }
    }
  },
  props: ["pageCount", "getList"]
};
</script>
