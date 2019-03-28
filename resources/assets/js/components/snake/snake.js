import Vue from "vue/dist/vue";
import game from './game';

var snake = Vue.component('snake', {
    data: function () {
        return {
            play: false,
            score: 0,
        }
    },
    methods: {
        playToggle() {
            this.play = !this.play;
        },
        onPlayChange(val) {
            this.play = val;
        },
        onScoreChange(val) {
            this.score = val;
        }
    },
    template: `
        <div>
            <div class="snake-container">
                <div class="snake">
                    <div class="top-bar flex align-vertical-center align-horizontal-space-between">
                        <div class="score">
                            Score: {{score}}
                        </div>
                        <div class="butons">
                            <button v-on:click="playToggle" v-bind:class="['button','small', play ? 'pause-button' : 'play-button']">
                                <span v-if="play">Pause</span>
                                <span v-else>Play</span>
                            </button>
                        </div>
                    </div>
                    <game v-bind:play="play" v-on:onPlayChange="onPlayChange" v-on:onScoreChange="onScoreChange"></game>
                </div>
            </div>
        </div>
    `
})

export default snake;
