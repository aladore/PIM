<template>
    <v-app bg>
        <router-view></router-view>

        <!-- Modal refresh PWA -->
        <v-snackbar
            v-model="notification.state"
            :color="notification.color"
            :timeout="notification.timeout"
            :bottom="notification.y === 'bottom'"
            :top="notification.y === 'top'"
            :left="notification.x === 'left'"
            :right="notification.x === 'right'"
            :multi-line="notification.mode === 'multi-line'"
            :vertical="notification.mode === 'vertical'"
        >
            {{ notification.text }}

            <v-btn
                v-if="notification.btn1"
                text
                @click="
                    notification.btn1call();
                    notification.state = false;
                "
                :ripple="false"
            >
                {{ notification.btn1label }}
            </v-btn>
            <v-btn v-if="notification.close" dark text @click="notification.state = false" :ripple="false">
                <span v-t="'close'"></span>
            </v-btn>
        </v-snackbar>

        <v-bottom-sheet v-model="installPrompt">
            <div style="border: 2px solid #1E88DD;"></div>
            <v-list light>
                <v-list-item>
                    <v-list-item-title v-t="'install'" @click="installApp"></v-list-item-title>
                    <v-spacer></v-spacer>
                    <v-btn text small @click.prevent="installPrompt = false">
                        <i class="fas fa-times"></i>
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-bottom-sheet>
    </v-app>
</template>

<script>
import { subscriberService } from "@/core/services";
/* eslint-disable no-console */
export default {
    name: "App",
    components: {},
    data() {
        return {
            registration: null,
            installPrompt: false,
            deferredPrompt: null,
            notification: {},
        };
    },
    async created() {
        if (sessionStorage.getItem("su-list-suppliers") === null) {
            await this.getSuppliersList();
        }

        if (this.$store.getters.appLocal("themeDark")) {
            document.getElementsByTagName("html")[0].style.backgroundColor = "#222";
        }

        this.$vuetify.theme.themes.light = { ...this.$vuetify.theme.themes.light, ...this.$store.getters.config.theme };
        this.$vuetify.theme.themes.dark = { ...this.$vuetify.theme.themes.dark, ...this.$store.getters.config.theme };

        let themeMode = "themeLight",
            mode = "light";

        if (this.$store.getters.appLocal("themeDark")) {
            themeMode = "themeDark";
            mode = "dark";
        }

        let primaryColor = this.$store.getters.appLocal(`${themeMode}PrimaryColor`),
            accentColor = this.$store.getters.appLocal(`${themeMode}AccentColor`);

        // Define primary color
        if (this.$store.getters.config.theming && this.$store.getters.config.theming.editable && primaryColor) {
            this.$vuetify.theme.themes[mode].primary = primaryColor;
        } else {
            this.$store.commit("appLocalRm", { key: `${themeMode}PrimaryColor` });
        }

        // Define accent color
        if (this.$store.getters.config.theming && this.$store.getters.config.theming.editable && accentColor) {
            this.$vuetify.theme.themes[mode].accent = accentColor;
        } else {
            this.$store.commit("appLocalRm", { key: `${themeMode}AccentColor` });
            this.$vuetify.theme.themes[mode].accent = this.$vuetify.theme.themes[mode].primary;
        }

        this.$vuetify.theme.dark = this.$store.getters.appLocal("themeDark");

        // this.$vuetify.theme.themes.light = this.$vuetify.theme.themes.dark;
    },
    mounted() {
        document.addEventListener("PwaUpdated", this.pwaAvailable);

        let installPrompt = this.$store.getters.config.hasOwnProperty("installPrompt") ? this.$store.getters.config.installPrompt : true;
        if (installPrompt) {
            window.addEventListener("beforeinstallprompt", e => {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();

                // Stash the event so it can be triggered later.
                this.deferredPrompt = e;
                // Update UI notify the user they can add to home screen
                this.installPrompt = true;

                return false;
            });
        }

        window.addEventListener("appinstalled", () => {
            this.$toast.info(this.$t("installed"));
        });

        if (navigator.getInstalledRelatedApps) {
            navigator.getInstalledRelatedApps().then(function(apps) {
                // if(apps.length === 0) { $('#installapp').parent().show(); }

                console.log("installed apps", apps);
            });
        }

        document.addEventListener('pim:toaster', this.toasterListen, false);

        console.log("App Standalone", this.isStandalone());
    },
    beforeDestroy() {
        window.removeEventListener("PwaUpdated", this.pwaAvailable);
    },
    methods: {
        async getSuppliersList() {
            await subscriberService
                .getList({
                    maxResult: 500,
                    user: false,
                    subscriberType: null,
                    display: "",
                    searchExtra: [
                        {
                            id: "cf_Type",
                            type: "constant",
                            value: "FOURNISSEUR",
                        },
                    ],
                })
                .then(response => {
                    if (sessionStorage.getItem('su-list-suppliers') === null) {
                        sessionStorage.setItem('su-list-suppliers',JSON.stringify(response.data.hits.hits));
                    }
                }).catch((e) => {
                    console.error(e);
                });
        },
        /**
         *
         * @param {CustomEvent} evt
         */
        pwaAvailable(evt) {
            this.registration = evt.detail;
            this.notification = {
                text: this.$t("new_version"),
                color: "dark",
                y: "bottom",
                x: "center",
                mode: "vertical",
                close: true,
                timeout: 10000,
                btn1: true,
                btn1label: this.$t("refresh"),
                btn1call: this.pwaReload,
                state: true,
            };
        },
        pwaReload() {
            console.log("reload", this.registration);
            window.location.reload();
        },
        installApp() {
            if (!this.deferredPrompt) {
                return false;
            }

            this.deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === "accepted") {
                    this.$toast.info(this.$t("in_progress"));
                }

                this.deferredPrompt = null;
            });
        },
        isStandalone() {
            return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
        },
        toasterListen(evt) {
            this.$toast.info(evt.detail.payload.message, { showClose: true, queueable: true, });
        },
    },
    // computed: {
    //     notification: {
    //         get() {
    //             return this.$store.state.notification;
    //         },
    //         set(){
    //             this.$store.commit("toast", {
    //                 text: this.$t("new_version"),
    //                 color: "dark",
    //                 y: "bottom",
    //                 x: "center",
    //                 mode: "vertical",
    //                 close: true,
    //                 timeout: 10000,
    //                 btn1: true,
    //                 btn1label: this.$t("refresh"),
    //                 btn1call: this.pwaReload,
    //             });
    //         }
    //     },
    // },
};
</script>

<style scoped></style>

<i18n>
{
    "en": {
        "already": "Already installed",
        "close": "Close",
        "in_progress": "Installation in progress",
        "install": "Install application",
        "installed": "Application installed",
        "new_version": "New version available"
    },
    "fr": {
        "already": "Application déjà installée",
        "close": "Fermer",
        "in_progress": "Installation en cours",
        "install": "Installer l'application",
        "installed": "Application installée",
        "new_version": "Nouvelle version disponible"
    }
}
</i18n>
