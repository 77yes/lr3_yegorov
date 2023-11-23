<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col">
          <home/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Home from "./views/home/Home";

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.css';
#app{
  display: block;
}
</style>
