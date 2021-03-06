<template>
  <v-card class="mx-auto mt-16 px-8 pb-8">
    <v-card-title class="px-0">
      Record voice message
    </v-card-title>

    <v-btn large light @click="toggleRecording" class="mt-5">
      {{ isRecording ? "Stop" : "Record" }}
    </v-btn>
    <div class="d-flex flex-column align-items-center">
      <template v-if="finishedRecording">
        <v-btn large @click="toggleAudio" class="mt-5">
          <v-icon v-if="!isPlaying">mdi-play</v-icon>
          <v-icon v-if="isPlaying">mdi-stop</v-icon>
        </v-btn>
        <div class="duration text-center my-5">{{ duration }}s</div>
        <v-btn large v-if="!link" @click="uploadAudio" :loading="isLoading"
          >Upload</v-btn
        >
        <div v-if="link" class="link-container">
          <v-text-field
            hide-details
            filled
            rounded
            dense
            readonly
            v-model="link"
            append-icon="mdi-content-copy"
            class="rounded-lg"
            @click="copyLink"
            @click:append="copyLink"
          >
          </v-text-field>
        </div>
      </template>
    </div>

    <v-snackbar bottom v-model="showCopied" light content-class="text-center">
      Link Copied!
    </v-snackbar>
  </v-card>
</template>

<style lang="scss" scoped>
.v-card {
  width: 400px;
}

button {
  width: 100%;
}

.link-container {
  height: 44px;
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
import getBlobDuration from "get-blob-duration";
import { db, storage } from "../db";

import firebase from "firebase/app";
import Component, { mixins } from "vue-class-component";
import Vue from "vue";
import Recorder from "recorder-js";
import AudioPlayer from "@/components/AudioPlayer";
const FirebaseBlob = firebase.firestore.Blob;

@Component({
  metaInfo: { title: "Record" },
})
export default class Record extends mixins(AudioPlayer) {
  recorder: Recorder;
  audioBlob: Blob;
  isRecording = false;
  finishedRecording = false;
  isLoading = false;
  duration: number;
  link = "";
  showCopied = false;

  mounted() {
    this.setupRecording();
  }

  setupRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();

          this.recorder = new Recorder(audioContext);
          this.recorder.init(stream);
        })

        // Error callback
        .catch((err) => {
          console.log("The following getUserMedia error occurred: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  toggleRecording() {
    if (this.isRecording) this.stopRecording();
    else this.startRecording();
  }

  startRecording() {
    this.link = "";
    this.finishedRecording = false;
    this.isRecording = true;

    this.recorder.start().then(() => (this.isRecording = true));
  }

  async stopRecording() {
    const result = await this.recorder.stop();
    this.audioBlob = result.blob;

    let duration = await getBlobDuration(result.blob);
    duration = Math.round(duration * 100) / 100;
    this.duration = duration;
    const url = window.URL.createObjectURL(result.blob);
    this.audioPlayer.src = url;

    this.finishedRecording = true;
    this.isRecording = false;
  }

  async uploadAudio() {
    this.isLoading = true;
    const arrayBuffer = await new Response(this.audioBlob).arrayBuffer();
    const storageId = this.uuidv4();
    const blobRef = storage.ref().child(storageId);

    await blobRef.put(this.audioBlob);

    const response = await db.collection("audios").add({
      type: this.audioBlob.type,
      storageId: storageId,
      date: new Date(),
      duration: this.duration,
    });

    const id = response.id;
    this.link = window.location.origin + "/listen/" + id;
    this.copyLink();
    this.isLoading = false;
  }

  copyLink() {
    navigator.clipboard.writeText(this.link).then(() => {
      this.showCopied = true;
    });
  }

  // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
</script>
