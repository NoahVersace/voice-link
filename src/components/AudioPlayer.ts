import Vue from "vue";
import Component from "vue-class-component";

@Component({
  beforeRouteLeave(this: AudioPlayer, from, to, next) {
    if (this.isPlaying) this.stopPlayback();
    next();
  },
})
export default class AudioPlayer extends Vue {
  audioPlayer = new Audio();
  isPlaying = false;

  toggleAudio() {
    if (this.isPlaying) this.stopPlayback();
    else {
      this.audioPlayer.play();
      this.isPlaying = true;
      this.audioPlayer.onended = () => {
        this.isPlaying = false;
      };
    }
  }

  stopPlayback() {
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
    this.isPlaying = false;
  }
}
