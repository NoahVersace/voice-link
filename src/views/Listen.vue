<template>
  <v-card class="mx-auto mt-16 px-8 pb-8">
    <v-card-title class="px-0">Listen to Voice Message</v-card-title>
    <div class="">{{ id }}</div>
    <div class="">{{ formattedDate }}</div>
    <div class="text-center mt-10">{{ duration }}s</div>
    <v-btn light @click="playAudio" large class="mt-5">
      <v-icon v-if="!isPlaying">mdi-play</v-icon>
      <v-icon v-if="isPlaying">mdi-stop</v-icon>
    </v-btn>
  </v-card>
</template>

<style lang="scss" scoped>
.v-card {
  width: 400px;
}

button {
  width: 100%;
}
</style>

<script lang="ts">
import { db } from "@/db";
import firebase from "firebase/app";
import Component from "vue-class-component";
import moment from "moment";
import Vue from "vue";
type FirebaseBlob = firebase.firestore.Blob;
type FirebaseTimestamp = firebase.firestore.Timestamp;
@Component
export default class Listen extends Vue {
  id = this.$route.params.id;
  duration = "";
  date: Date;
  audio = new Audio();
  isPlaying = false;

  get formattedDate() {
    return moment(this.date).format("DD.MM.yyyy");
  }

  mounted() {
    this.getAudio();
  }

  getAudio() {
    db.collection("audios")
      .doc(this.id)
      .get()
      .then((response) => {
        const data = response.data() as {
          duration: string;
          date: FirebaseTimestamp;
          blob: FirebaseBlob;
          type: string;
        };
        const blob = new Blob([(data.blob as any).toUint8Array()], {
          type: data.type,
        });
        const reader = new FileReader();
        const audioUrl = window.URL.createObjectURL(blob);
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = reader.result;
        };
        this.audio.src = audioUrl;
        this.duration = data.duration;
        this.date = data.date.toDate();
      });
  }

  playAudio() {
    this.isPlaying = true;
    this.audio.play();
    this.audio.onended = () => (this.isPlaying = false);
  }
}
</script>
