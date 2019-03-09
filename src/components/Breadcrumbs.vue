<template>
  <ol class="breadcrumb m-3">
    <router-link
      :to="linkProp(crumb)"
      tag="li"
      class="breadcrumb-item"
      v-for="(crumb, key) in $breadcrumbs"
      v-bind:key="key"
      exact
    >
      {{ crumb | crumbText }}
    </router-link>
  </ol>
</template>
