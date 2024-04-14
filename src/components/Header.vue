<template>
  <header class="header">
    <div class="header-container">
      <h1 class="title">{{ title }}</h1>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    title: {
      type: String,
      required: true,
      default: "Cypherdle",
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #303033;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  box-shadow: 0 1px 1px rgb(113 113 113);
}

.header-container {
  width: 100%;
}

.title {
  font-size: 24px;
  margin: 0;
  padding: 0;
}
</style>
