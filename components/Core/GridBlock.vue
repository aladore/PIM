<template>
    <section :class="['grid-block', elevation ? 'elevation-2' : '']">
        <div
            v-if="icon"
            class="icon text-start v-card--material__heading mb-n5 pa-4 elevation-10"
            :class="[iconColor && iconColor.startsWith('#') ? iconColor : 'primary']"
            :style="{
                background: iconColor && iconColor.startsWith('#') ? iconColor : 'primary',
                position: 'absolute',
                zIndex: 6,
                left: '10px',
            }"
        >
            <v-icon dark size="32">{{ icon }}</v-icon>
        </div>
        <v-toolbar v-if="header" ref="toolbar" dense flat class="pr-0 transparent-bg" style="z-index: 10">
            <v-toolbar-title style="margin-left: 90px">
                {{ title }}
                <slot name="toolbar-title" v-bind:expended="searchOpen"></slot>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="toolbar-items">
                <v-btn
                    v-if="btnSearch"
                    depressed
                    class="primary pa-0"
                    @click="toolbarItemExpandedData !== 'search' ? (toolbarItemExpandedData = 'search') : (toolbarItemExpandedData = null)"
                    :ripple="false"
                >
                    <v-icon small>fas fa-search</v-icon>
                </v-btn>

                <v-tooltip bottom v-if="btnAdd">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" depressed class="primary pa-0" :ripple="false" @click="$emit('click:add')">
                            <v-icon small>fas fa-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t("add") }}</span>
                </v-tooltip>

                <v-flex shrink v-if="btnSearch">
                    <v-expand-x-transition>
                        <div v-show="toolbarItemExpandedData === 'search'">
                            <v-text-field
                                v-model="search"
                                :background-color="$transparentSecondary70"
                                :autofocus="true"
                                :label="$t('search')"
                                flat
                                solo
                                hide-details
                                clearable
                                clear-icon="fa fa-times"
                                @click:clear="$emit('search', '')"
                                @keydown.esc="searchOpen = false"
                                @keyup="$emit('search', $event.target.value)"
                                autocomplete="nope"
                            ></v-text-field>
                        </div>
                    </v-expand-x-transition>
                </v-flex>

                <dropdown-buttons
                    v-if="buttonsLink"
                    icon-menu="fas fa-ellipsis-h"
                    :buttons="buttonsLink"
                    depressed
                    :ripple="false"
                    color="primary"
                    full-height
                ></dropdown-buttons>

                <slot name="toolbar-items-end" v-bind:expended="searchOpen"></slot>

                <dropdown-buttons
                    :buttons="buttonsList"
                    v-on="buttonsListener"
                    depressed
                    :ripple="false"
                    color="primary"
                    full-height
                ></dropdown-buttons>

                <!--<v-btn v-if="configurable" depressed class="primary pa-0" @click="config">-->
                <!--<v-icon>fas fa-cog</v-icon>-->
                <!--</v-btn>-->
            </v-toolbar-items>
        </v-toolbar>

        <div :class="['wrapper', wrapperClass, header ? '' : 'no-header']" style="overflow:hidden;" v-bind="$attrs">
            <template v-if="displayContent">
                <template v-if="noScroll">
                    <slot></slot>
                </template>
                <template v-else>
                    <scrollbar>
                        <slot></slot>
                    </scrollbar>
                </template>
            </template>

            <v-overlay absolute :value="!displayContent"><span v-t="'offline'"></span></v-overlay>
        </div>

        <modal v-model="dialog">
            <v-form v-model="configValid">
                <v-jsonschema-form v-if="schema && dataObject" :schema="schema" :model="dataObject" />
            </v-form>
        </modal>
    </section>
</template>

<script>
import DropdownButtons from "@/components/DropdownButtons";
import Modal from "./Modal";
import Scrollbar from "./Scrollbar";
import { VExpandXTransition } from "vuetify/lib";
export default {
    name: "GridBlock",
    inheritAttrs: false,
    components: { DropdownButtons, Modal, Scrollbar, VExpandXTransition },
    props: {
        title: String,
        icon: String,
        iconColor: String,
        btnRefresh: Boolean,
        btnEdit: Boolean,
        btnAdd: Boolean,
        btnSearch: Boolean,
        btnFold: Boolean,
        btnLink: Boolean,
        toolbarItemExpanded: [String, Number],
        elevation: {
            type: Boolean,
            default: true,
        },
        /**
         * @see DropdownButtons
         */
        buttons: {
            type: Array,
            default() {
                return []; // {name, icon}
            },
        },
        buttonsLink: {
            type: Array,
            default() {
                return []; // {text, icon, url}
            },
        },
        wrapperClass: String,
        background: {
            type: Boolean,
            default: true,
        },
        header: {
            type: Boolean,
            default: true,
        },
        noScroll: {
            type: Boolean,
            default: false,
        },
        offlineSupport: Boolean,
    },
    data() {
        return {
            search: "",
            searchOpen: false,
            dialog: false,
            configValid: false,
            dataObject: {},
            toolbarItemExpandedData: this.toolbarItemExpanded,
            buttonsListener: {},
            dropdown_icon: [
                { text: "list", callback: () => console.log("list") },
                { text: "favorite", callback: () => console.log("favorite") },
                { text: "delete", callback: () => console.log("delete") },
            ],
        };
    },
    mounted() {
        // to remove the title attribute "[object Object]"
        this.$el.removeAttribute("title");
    },
    updated() {
        // to remove the title attribute "[object Object]"
        this.$el.removeAttribute("title");
    },
    methods: {
        config() {
            this.dialog = true;
        },
    },
    computed: {
        schema() {
            return this.$parent.propertiesForm;
        },
        buttonsList() {
            let buttons = this.buttons;

            if (this.btnEdit) {
                buttons.push({
                    name: "edit",
                    icon: "fas fa-pen",
                    tooltip: this.$t("edit"),
                });
            }

            if (this.btnLink) {
                buttons.push({
                    name: "link",
                    icon: "fas fa-link",
                    tooltip: this.$t("link"),
                });
            }

            if (this.btnRefresh) {
                buttons.push({
                    name: "refresh",
                    icon: "fas fa-sync",
                    tooltip: this.$t("refresh"),
                });
            }

            if (this.btnFold) {
                buttons.push({
                    name: "fold",
                    icon: "fas fa-filter",
                    tooltip: this.$t("fold"),
                });
            }

            return buttons;
        },
        displayContent() {
            return this.$isOnline || (this.offlineSupport && this.$isGranted("OFFLINE"));
        },
    },
    watch: {
        toolbarItemExpanded(val) {
            this.toolbarItemExpandedData = val;
        },
        toolbarItemExpandedData(val) {
            this.$emit("update:toolbarItemExpanded", val);
        },
        buttonsList: {
            handler(val) {
                let buttonsListener = {};
                for (let btn of val) {
                    buttonsListener["click:" + btn.name] = () => this.$emit("click:" + btn.name);
                }

                this.buttonsListener = buttonsListener;
            },
            immediate: true,
        },
    },
};
</script>

<style scoped lang="scss">
.theme--light .grid-block {
    background-color: #fff;
}

.theme--dark .grid-block {
    background-color: #424242;
}

.grid-block {
    height: 100%;
    border-radius: 4px;

    .icon {
        max-height: 60px;
        width: auto;
        border-radius: 4px;
    }

    .v-card--material__heading {
        transform: translateY(-15px);
    }

    .toolbar-items {
        & >>> button {
            border-radius: 0 !important;
            min-width: calc(48px * 1.5) !important;
        }
    }

    .wrapper {
        max-width: 100%;
        height: calc(100% - 49px);

        &.no-header {
            height: 100%;
        }
    }
}

.v-list-item__title.center {
    text-align: center;
}
</style>

<i18n>
    {
        "fr": {
            "search": "Recherche",
            "fold": "Plier / déplier",
            "link": "Associer",
            "offline": "Composant non disponible hors connexion"
        },
        "en":{
            "search": "Search",
            "fold": "Fold / unFold",
            "link": "Associer",
            "offline": "Component not available offline"
        }
    }
</i18n>
