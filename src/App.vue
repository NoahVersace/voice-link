<template>
  <v-app>
    <div class="mvp-banner">MVP</div>
    <v-app-bar app dark>
      <v-icon>mdi-microphone</v-icon>
      <v-toolbar-title class="ml-2">Voice Link</v-toolbar-title>
      <v-divider inset vertical class="mx-5"></v-divider>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/record">Record</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
body {
  background: #121212;
}

.mvp-banner {
  position: fixed;
  opacity: 0.7;
  top: 10px;
  right: 35px;
  transform: translate(50%, 50%) rotate(40deg);
  background: white;
  z-index: 1000;
  width: 600px;
  color: black;
  text-align: center;
}
</style>
