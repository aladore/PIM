<template lang="html">
    <section class="app-auth">
        <side-navigation v-model="navigationOpen" :expandOnHover="expandOnHover && !$isMobile"></side-navigation>
        <side-navigation-link v-if="$store.getters.config.menuLink" :navigationLinkOpen="navigationLinkOpen"></side-navigation-link>

        <v-app-bar
            app
            light
            :style="{
                'z-index': 15,
                'border-radius': '0px',
            }"
        >
            <v-app-bar-nav-icon
                color="primary"
                @click.stop="$isMobile ? (navigationOpen = !navigationOpen) : (expandOnHover = !expandOnHover)"
            ></v-app-bar-nav-icon>

            <v-toolbar-title light class="headline text-capitalize">
                <!-- Only on desktop -->
                <template v-if="!$isMobile">
                    <v-chip color="primary" style="color: white; margin-right: 10px;" v-if="mode !== 'prod'">{{ mode }}</v-chip>
                </template>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-title class="text-capitalize">
                <span class="username" v-if="$store.state.app.user">{{ $store.state.app.user.name }}</span>
                <!--                <pre>{{ $store.state.app.user }}</pre>-->
                <!--                <span class="status" v-if="$store.state.app.user">{{ $store.state.app.user.name }}</span>-->
            </v-toolbar-title>
        </v-app-bar>

        <v-main class="content-main">
            <v-container fluid class="py-0">
                <router-view />
            </v-container>
        </v-main>
    </section>
</template>

<script lang="js">
import SideNavigation from "@/components/SideNavigation";
import SideNavigationLink from "@/components/SideNavigationLink";
import { subscriberService, } from "@/core/services";
import axiosLocal from "axios";

export default {
    name: "AppAuth",
    components: {
        SideNavigation,
        SideNavigationLink,
        SubscriberSearch: () => import(/* webpackChunkName: "subscriberSearchToolbar" */ "@/components/Crm/Toolbar/SubscriberSearch"),
    },
    data() {
        return {
            navigationOpen: !this.$vuetify.breakpoint.smAndDown,
            navigationLinkOpen: false,
            expandOnHover: true,
            ephemerisVal: "",
            counterSyncServices: [],
        };
    },
    created() {
        this.initCounterSyncServices();
    },
    mounted() {
        if (this.$store.getters.config.ephemeride) {
            this.ephemerisVal = this.getTodayEphemeris();
        }
    },
    methods: {
        async synchronizeOffline() {
            try {
                this.$toast.clearQueue();
                this.$toast.getCmp()?.close();
                this.$toast.info(this.$t("synchronization_start"));

                await this.$store.dispatch("synchronizeOffline");
                await this.initCounterSyncServices();

                this.$toast.getCmp()?.close();
                this.$toast.success(this.$t("synchronization_success"));
            } catch (e) {
                console.debug(e);
                this.$toast.getCmp()?.close();
                this.$toast.error(this.$t("synchronization_error"));
            }
        },
        async initCounterSyncServices() {
            let offlineConfig = this.$store.getters.offlineConfig,
                syncServices = [];


            if (offlineConfig) {
                for (let serviceName of Object.keys(offlineConfig)) {
                    switch (serviceName) {
                    case "subscriber":
                        syncServices.push({
                            name: "subscribers",
                            count: await subscriberService.tableCount(),
                            needSync: await subscriberService.needSync(),
                        });
                        break;
                    default:
                        break;
                    }
                }
            }

            this.counterSyncServices = syncServices;
        },
        getTodayEphemeris() {
            const today = new Date();
            let month = today.getMonth() + 1;
            let day = today.getDate();

            let source = axiosLocal.get("ephemeride.json").then((source) => {
                source = source.data;
                let valueTab = null;

                if (month === 1)
                    valueTab = source.january;
                if (month === 2)
                    valueTab = source.february;
                if (month === 3)
                    valueTab = source.march;
                if (month === 4)
                    valueTab = source.april;
                if (month === 5)
                    valueTab = source.may;
                if (month === 6)
                    valueTab = source.june;
                if (month === 7)
                    valueTab = source.july;
                if (month === 8)
                    valueTab = source.august;
                if (month === 9)
                    valueTab = source.september;
                if (month === 10)
                    valueTab = source.october;
                if (month === 11)
                    valueTab = source.november;
                if (month === 12)
                    valueTab = source.december;

                try {

                    var prefix = valueTab[day - 1][1];

                    this.ephemerisVal = (prefix === "") ?
                        valueTab[day - 1][0] :
                        prefix + " " + valueTab[day - 1][0];
                } catch (err) {
                    console.error(err);
                }
            });

        },

    },
    computed: {
        iconMenuLink() {
            let menuLink = this.$store.getters.config.menuLink;
            if (menuLink && menuLink.hasOwnProperty("items") && menuLink.items && menuLink.items.length) {
                if (menuLink.icon && menuLink.icon.type === "picture") {
                    return menuLink.icon;
                }
                return { src: "fas fa-external-link-alt", type: "fa", };
            }
            return null;
        },
        mode() {
            return this.$store.getters.config.mode ? this.$store.getters.config.mode : "prod";
        },
        colorBar() {
            if (this.$vuetify.theme.dark) {
                return "#ffffff !important";
            } else {
                return this.$transparentPrimary90 + "!important";
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.v-app-bar {
    background-color: white !important;
}
.username {
    font-size: 18px;
    font-family: Montserrat;
    color: #011c40;
    font-weight: 400;
    // color: var(--v-secondary-base);
}
</style>
