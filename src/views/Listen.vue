<template>
  <v-card class="mx-auto mt-16 px-8 pb-8">
    <v-card-title class="px-0">Listen to Voice Message</v-card-title>
    <div class="">{{ id }}</div>
    <div class="">{{ formattedDate }}</div>
    <div class="text-center mt-10">{{ duration }}s</div>
    <v-btn light @click="toggleAudio" large class="mt-5" :loading="isLoading">
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
import { db, storage } from "@/db";
import firebase from "firebase/app";
import Component, { mixins } from "vue-class-component";
import moment from "moment";
import Vue from "vue";
import AudioPlayer from "../components/AudioPlayer";
type FirebaseBlob = firebase.firestore.Blob;
type FirebaseTimestamp = firebase.firestore.Timestamp;

@Component({
  metaInfo(this: Listen) {
    return {
      title: "Listen " + (this.isPlaying ? "🔊" : "🔈"),
      meta: [{ name: "description", content: this.description }],
    };
  },
})
export default class Listen extends mixins(AudioPlayer) {
  id = this.$route.params.id;
  duration = "0";
  date: Date;
  isLoading = false;

  get formattedDate() {
    return moment(this.date).format("hh:mm - DD.MM.yyyy");
  }

  get description() {
    return (
      "Listen to " +
      this.id +
      " (" +
      this.duration +
      "s) recorded on " +
      this.formattedDate
    );
  }

  mounted() {
    this.getAudio();
  }

  async getAudio() {
    this.isLoading = true;
    db.collection("audios")
      .doc(this.id)
      .get()
      .then((response) => {
        const data = response.data() as {
          duration: string;
          date: FirebaseTimestamp;
          storageId: string;
          type: string;
        };
        let blob: Blob;
        // const blob = await storage.ref(data.storageId).getDownloadURL;
        storage
          .ref(data.storageId)
          .getDownloadURL()
          .then((url) => {
            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
              blob = xhr.response;
              const reader = new FileReader();
              const audioUrl = window.URL.createObjectURL(blob);
              reader.readAsDataURL(blob);
              this.audioPlayer.src = audioUrl;
              this.duration = data.duration;
              this.date = data.date.toDate();
            };
            xhr.open("GET", url);
            xhr.send();
          })
          .catch(function(error) {
            // Handle any errors
            console.error(error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      });
  }
}
</script>
