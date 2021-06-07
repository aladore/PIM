<template lang="html">
    <section class="modal">
        <v-dialog
            v-model="dialog"
            :fullscreen="fullscreen"
            :hide-overlay="fullscreen"
            persistent
            :width="width || 500"
            transition="dialog-bottom-transition"
            :eager="eager"
        >
            <v-card class="modal-box" :style="{ minHeight: '100%', height: 'auto' }">
                <v-toolbar color="primary" :class="{ 'v-toolbar--fixed': fixed }" v-if="fullscreen">
                    <v-toolbar-title style="color: white !important;">
                        <slot name="title"></slot>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <slot name="toolbar-items"></slot>
                        <v-btn v-define-text-color v-if="btnAction1" text @click="$emit('action1')"><span v-t="'save'"></span></v-btn>
                    </v-toolbar-items>
                    <v-btn icon @click="dialog = false" class="mr-4">
                        <v-icon color="white">fas fa-times</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-toolbar v-if="fixed"></v-toolbar>

                <v-card-title
                    dark
                    style="padding: 0"
                    v-if="!fullscreen"
                    class="headline  lighten-2 subheading secondary--text font-weight-bold border-bottom border-secondary"
                >
                    <v-layout>
                        <v-flex class="title-box primary--text text-capitalize" style="padding: 8px 8px 8px 18px;">
                            <slot name="title"></slot>
                        </v-flex>

                        <v-spacer></v-spacer>

                        <v-btn depressed large class="fill-height primary pa-0 ma-0 btn-close" style="border-radius: 0;" @click="close()">
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-layout>
                </v-card-title>

                <v-card-text class="height-wrapper pa-2" :style="{ 'padding: 2rem;': true, ...wrapperStyle }" v-if="!fullscreen">
                    <!--<scrollbar>-->
                    <slot></slot>
                    <!--</scrollbar>-->
                </v-card-text>
                <v-card-text v-else :style="wrapperStyle">
                    <slot></slot>
                </v-card-text>

                <v-card-actions v-if="$slots.actions">
                    <slot name="actions"></slot>
                    <!--                    <v-spacer></v-spacer>-->
                    <!--                    <v-btn-->
                    <!--                        dark-->
                    <!--                        color="primary"-->
                    <!--                        depressed-->
                    <!--                        class="fill-height primary secondary&#45;&#45;text pa-0 ma-0 btn-close"-->
                    <!--                        style="border-radius: 0"-->
                    <!--                        @click="close()"-->
                    <!--                        v-if="!fullscreen"-->
                    <!--                    >-->
                    <!--                        <slot name="button"></slot-->
                    <!--                    ></v-btn>-->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </section>
</template>

<script lang="js">
// import Scrollbar from "./Scrollbar";
export default {
    name: "modal",
    props: {
        value: Boolean,
        fullscreen: {
            type: Boolean,
            default: false,
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        btnAction1: {
            type: Boolean,
            default: false,
        },
        eager: {
            type: Boolean,
            default: true,
        },
        width: {
            type: Number,
            default: 500,
        },
        wrapperStyle: [String, Array, Object,],
    },
    data() {
        return {
            dialog: this.value,
        };
    },
    // components: {Scrollbar,},
    mounted() {

    },
    methods: {
        close() {
            this.$emit("input", false);
            this.$emit("close", true);
        },
    },
    watch: {
        value(val) {
            this.dialog = val;
        },
        dialog(val) {
            this.$emit("input", val);
        },
    },
};
</script>

<style scoped lang="scss">
.modal {
    .modal-box {
        .btn-close {
            height: 100% !important;
            border-radius: 0;
        }
    }

    .height-wrapper {
        max-height: 80vh;
    }
}

.v-toolbar--fixed {
    position: fixed;
    z-index: 2;
    width: 100%;
    border-radius: 0 !important;

    .v-card__text {
        margin: 8px !important;
    }
}
</style>
