<template lang="html">
    <v-btn @click="playInfo" class="mx-2" fab dark small color="primary" v-if="false">
        <v-icon small dark>{{ $text2speech.isPlaying(value) ? "fas fa-pause" : "fas fa-volume-up" }}</v-icon>
    </v-btn>
</template>

<script lang="js">
export default  {
    name: 'text-2-speech',
    props: {
        value: [String, Function,],
    },
    mounted() {

    },
    data() {
        return {

        }
    },
    methods: {
        playInfo(){
            this.$text2speech.play(this.value);
            this.$text2speech.setPlayPauseStopListener(() => {
                this.$forceUpdate();
            });
            this.$forceUpdate();
        },

    },
    computed: {

    },
}
</script>

<style scoped lang="scss">
.text-2-speech {
}
</style>
