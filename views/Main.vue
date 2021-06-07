<template>
    <v-layout style="margin-top: 15px;">
        <v-flex xs12 v-if="currentPage">
            <draggable
                v-model="currentPage.layout"
                :group="'currentPage.layout'"
                :disabled="!$store.state.isEditableLayout || currentPage.layout.length <= 1"
                @choose="onChoose(true)"
                @unchoose="onChoose(false)"
                @start="disabledHover = true"
                @end="disabledHover = false"
                class="row"
                ghost-class="ghost"
            >
                <template v-for="layout in currentPage.layout">
                    <v-col
                        class="pt-0 pb-0"
                        :key="layout.id"
                        v-if="!layout.breakpoint || $vuetify.breakpoint[layout.breakpoint]"
                        :cols="$isMobile || currentPage.layout.length <= 1 ? 12 : layout.w"
                    >
                        <v-hover v-slot:default="{ hover }">
                            <div style="position: relative">
                                <v-overlay v-if="$store.state.isEditableLayout && hover && !disabledHover" absolute opacity=".3">
                                    <!-- Width - -->
                                    <v-btn
                                        small
                                        absolute
                                        style="left: 10px; margin-top: -14px"
                                        :disabled="layout.w <= 3 || currentPage.layout.length <= 1"
                                        @mousedown="resizeIsClick = true"
                                        @click="
                                            layout.w--;
                                            onMouseUp();
                                        "
                                    >
                                        <v-icon small>fa fa-minus</v-icon>
                                    </v-btn>
                                    <!-- Width + -->
                                    <v-btn
                                        small
                                        absolute
                                        style="right: 10px; margin-top: -14px"
                                        :disabled="layout.w >= 12 || currentPage.layout.length <= 1"
                                        @mousedown="resizeIsClick = true"
                                        @click="
                                            layout.w++;
                                            onMouseUp();
                                        "
                                    >
                                        <v-icon small>fa fa-plus</v-icon>
                                    </v-btn>
                                    <!-- Height - -->
                                    <v-btn
                                        small
                                        absolute
                                        style="top: 10px; margin-left: -25px"
                                        :disabled="layout.h <= 2 || currentPage.layout.length <= 1"
                                        @mousedown="resizeIsClick = true"
                                        @click="
                                            layout.h--;
                                            onMouseUp(layout.i, 'dec');
                                        "
                                    >
                                        <v-icon small>fa fa-minus</v-icon>
                                    </v-btn>
                                    <!-- Height + -->
                                    <v-btn
                                        small
                                        absolute
                                        style="bottom: 10px; margin-left: -25px"
                                        :disabled="layout.h >= 40 || currentPage.layout.length <= 1"
                                        @mousedown="resizeIsClick = true"
                                        @click="
                                            layout.h++;
                                            onMouseUp(layout.i, 'inc');
                                        "
                                    >
                                        <v-icon small>fa fa-plus</v-icon>
                                    </v-btn>
                                </v-overlay>
                                <component
                                    :is="layout.content"
                                    v-bind="propsComponent(layout)"
                                    :update-height="updateHeight[layout.i] || 0"
                                    :style="
                                        currentPage.layout.length <= 1
                                            ? `height: calc(100vh - (${$vuetify.application.top}px + 24px))`
                                            : `height: ${layout.h * 40}px;`
                                    "
                                ></component>
                            </div>
                        </v-hover>
                    </v-col>
                </template>
            </draggable>
        </v-flex>
    </v-layout>
</template>

<script>
import Tools from "@/utils/Tools";
import Draggable from "vuedraggable";

// noinspection JSUnusedGlobalSymbols
export default {
    name: "Main",
    components: {
        Draggable,
        // Core
        Modal: () => import(/* webpackChunkName: "core" */ "@/components/Core/Modal"),
        IframeView: () => import(/* webpackChunkName: "core" */ "@/components/Core/IframeView"),
        Dashboard: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Dashboard"),
        Statistics: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Statistics"),
        Imports: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Imports"),
        ProductsFiles: () => import(/* webpackChunkName: "core" */ "@/components/Pim/ProductsFiles"),
        Records: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Records"),
        SupplierAdd: () => import(/* webpackChunkName: "core" */ "@/components/Pim/SupplierAdd"),
        Product: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Product"),
        Slider: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Slider"),
        ProductsOnward: () => import(/* webpackChunkName: "core" */ "@/components/Pim/ProductsOnward"),
        Alert: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Alert"),
        Services: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Services"),
        ShopAdd: () => import(/* webpackChunkName: "core" */ "@/components/Pim/ShopAdd"),
    },
    data() {
        return {
            currentPage: null,
            dialog: false,
            showModal: false,
            lastPage: null,
            disabledHover: false,
            resizeIsClick: false,
            updateHeight: {},
            isCurrentPageFirstWatch: true,
        };
    },
    created() {
        this.$axios.post("/check", { brand: this.$store.getters.config.brand.api.id }).catch();
        this.updateCurrentPage(this.$route.params.page, this.$route.params.id, this.$route);
    },
    beforeRouteUpdate(to, from, next) {
        this.updateCurrentPage(to.params.page, to.params.id, to).then(() => next());
    },
    methods: {
        onMouseUp(id, operator) {
            this.resizeIsClick = false;
            if (operator) {
                if (this.updateHeight[id] === undefined) {
                    this.$set(this.updateHeight, id, 0);
                }
                if (operator === "inc") this.updateHeight[id]++;
                else if (operator === "dec") this.updateHeight[id]--;
            }
        },
        onChoose: Tools.debounce(
            async function(val) {
                if (!this.resizeIsClick && navigator.userAgent.toLowerCase().indexOf("firefox") === -1) {
                    this.disabledHover = val;
                }
            },
            navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? 200 : 0,
        ),
        async updateCurrentPage(name, paramsId, route = null) {
            let page = this.$store.getters.getPageByName(name);

            this.lastPage = name;

            if (!page) {
                if (this.pages.length) {
                    const idPage = this.$store.getters.menu[0].idpage;
                    this.$router.replace({ name: "main", params: { page: this.$store.getters.pages[idPage].name } });
                }
            } else {
                // If go to page of one subscriber
                if (paramsId !== undefined && (name === "Third" || name === "Contact")) {
                    let subscriber = this.$store.getters.app("subscriber");
                    if (subscriber?.id !== paramsId) {
                        try {
                            await this.$goToSubscriberPage(paramsId, this.$store.getters.app("subscriber"), {
                                routerReplace: true,
                                byCustomId: !!route?.query.customId,
                            });
                        } catch (e) {
                            this.$toast.error(this.$t("error.not_found"));
                            this.$router.replace("/");
                            return;
                        }
                    }
                }

                if (!this.$store.getters.hasRightOnPage(page)) {
                    await this.$router.replace("/");
                    return;
                }

                this.currentPage = null;
                this.$nextTick(() => {
                    this.currentPage = JSON.parse(JSON.stringify(page));
                });
            }
        },
        propsComponent(item) {
            return {
                properties: item.properties || {},
                ...item.properties,
            };
        },
        saveLayout: Tools.debounce(async function() {
            await this.$store.dispatch("savePageLayout", this.currentPage);
        }),
    },
    computed: {
        pages() {
            return this.$store.getters.pages;
        },
    },
    watch: {
        currentPage: {
            handler() {
                if (this.isCurrentPageFirstWatch) {
                    this.currentPage.layout.forEach((layout, index) => {
                        Object.assign(layout, { id: index });
                    });
                    this.isCurrentPageFirstWatch = false;
                } else {
                    this.saveLayout();
                }
            },
            deep: true,
        },
    },
};
</script>

<style lang="scss">
.v-overlay__content {
    position: static;
}
.ghost {
    .grid-block {
        border: lightslategrey solid 4px;
    }
}
</style>
