<script lang="ts">
import ToDo from "../../components/ToDo.vue";
export default {
  name: `Home`,
  components: {ToDo}
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-center">
      <img src="../../assets/logo.png" alt="logo">
    </div>
    <to-do/>
  </div>
</template>

<style scoped>

</style>