<template>
  <v-container class="pt-16">
    <h1 class="text-h2 text-center">Voice Link</h1>
    <h3 class="mt-5 text-h5 text-center">
      Create a voice message and send it via link.
    </h3>
    <div class="d-flex justify-center mt-10">
      <v-btn x-large to="/record" class="mx-auto">Start</v-btn>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.v-btn {
  width: 300px;
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  metaInfo: { title: "Voice Link 🏠", titleTemplate: "" },
});
</script>
