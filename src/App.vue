<template>
  <div id="app" class="open-sans">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans&display=swap');
.open-sans {
  font-family: 'Open Sans', sans-serif;
}
.montserrat {
  font-family: 'Montserrat, sans-serif';
}
</style>
