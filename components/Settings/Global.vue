<template lang="html">
    <section class="global">
        <v-row>
            <v-col cols="12" md="6">
                <v-switch
                    inset
                    :label="$t('webpush')"
                    v-if="webPushSupported"
                    :input-value="webPushEnabled"
                    @change="webPushToggleSubscription()"
                    hide-details
                ></v-switch>
            </v-col>

            <v-col cols="12" md="6">
                <v-switch
                    inset
                    :label="$t('WebAuthn')"
                    v-if="webAuthnSupported"
                    :input-value="webAuthnEnabled"
                    @change="webAuthnToggle()"
                    hide-details
                ></v-switch>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-select
                    item-text="label"
                    item-value="value"
                    :items="lang"
                    v-model="locale"
                    filled
                    :label="$t('lang')"
                    hide-details
                ></v-select>
            </v-col>
        </v-row>

        <!-- Colors -->
        <v-row v-if="theming.editable">
            <v-col cols="12" md="6">
                <strong class="mb-3 d-inline-block">{{ $t("primary-color") }}</strong>

                <v-item-group v-model="primary">
                    <v-item>
                        <v-avatar
                            class="v-settings__item"
                            :class="{ 'v-settings__item--active': primaryConfig === primary }"
                            :color="primaryConfig"
                            size="25"
                            @click="setPrimaryColor(primaryConfig)"
                        />
                    </v-item>
                    <v-item v-for="item in colors" :key="item" :value="item">
                        <v-avatar
                            class="v-settings__item"
                            :class="{ 'v-settings__item--active': item === primary }"
                            :color="item"
                            size="25"
                            @click="setPrimaryColor(item)"
                        />
                    </v-item>
                </v-item-group>
            </v-col>

            <v-col cols="12" md="6">
                <strong class="mb-3 d-inline-block">{{ $t("selected-page-color") }}</strong>

                <v-item-group v-model="accent">
                    <v-item :value="accent">
                        <v-avatar
                            class="v-settings__item"
                            :class="{ 'v-settings__item--active': !accent || accent === primaryConfig }"
                            :color="primaryConfig"
                            size="25"
                            @click="setAccentColor(primaryConfig)"
                        />
                    </v-item>
                    <v-item v-for="item in colors" :key="item" :value="item">
                        <v-avatar
                            class="v-settings__item"
                            :class="{ 'v-settings__item--active': item === accent }"
                            :color="item"
                            size="25"
                            @click="setAccentColor(item)"
                        />
                    </v-item>
                </v-item-group>
            </v-col>
        </v-row>

        <!-- Dark mode -->
        <div class="d-inline-block">{{ $t("dark-mode") }}</div>
        <v-switch v-model="darkMode" inset class="d-inline-block ml-5"></v-switch>

        <v-row>
            <v-col>
                <v-btn color="warning" @click="reinitConfig" v-t="'reinit_config'"></v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12"><span v-t="'lastcompiled'"></span>: <span v-html="$store.getters.config.LastCompiled"></span></v-col>
            <v-col cols="12"><span v-t="'revision'"></span>: <span v-html="$store.getters.config.Revision"></span></v-col>
        </v-row>

        <!-- Save -->
        <div class="d-flex justify-end">
            <v-btn color="primary" :disabled="valid" @click="submit()">
                <span v-t="'save'"></span>
            </v-btn>
        </div>
    </section>
</template>

<script lang="js">
import settingsLocal from "@/components/Settings/i18n";
import Tools from "@/utils/Tools";
import Colors from "vuetify/lib/util/colors"

export default {
    name: "global",
    props: [],
    i18n: { sharedMessages: settingsLocal, },
    created() {
        this.theming = this.$store.getters.config.theming || {};
        this.darkMode = this.$store.getters.appLocal("themeDark");
        // Get primary color
        this.primary = this.$store.getters.appLocal(`${this.themeMode}PrimaryColor`) || this.$vuetify.theme.themes.dark.primary;
        this.accent = this.$store.getters.appLocal(`${this.themeMode}AccentColor`) || this.$vuetify.theme.themes.dark.primary;

        if ("Notification" in window && "serviceWorker" in navigator) {
            this.webPushSupported = true;
        }

        if ("credentials" in navigator) {
            this.webAuthnSupported = true;
        }
    },
    mounted() {
        // Find out if the user has a webPushSubscription at the moment.
        // If so, update the enabled flag in data
        this.webPushFindSubscription()
            .then(sub => {
                if (sub === null) {
                    // console.log("no active webPushSubscription found on the client", sub);
                    this.webPushButtonDisabled = false;
                    this.webPushEnabled = false;
                } else {
                    // retrieve user info from API
                    // console.log("Active webPushSubscription found", sub);
                    this.webPushButtonDisabled = false;
                    this.webPushEnabled = true;
                    this.webPushSubscription = sub;
                }
            });


        this.webAuthnEnabled = this.$store.getters.appLocal("settings.webauthn");

    },
    data() {
        return {
            primaryConfig: this.$store.getters.config.theme.primary,
            valid: false,
            serviceWorkerRegistation: null,
            webPushSupported: false,
            webPushEnabled: false,
            webPushButtonDisabled: false,
            webPushSubscription: null,
            webAuthnSupported: false,
            webAuthnEnabled: false,
            message: null,
            lang: [{ "label": "Français", "value": "fr", }, { "label": "English", "value": "en", },],
            locale: this.$i18n.locale,
            primary: undefined,
            accent: undefined,
            colors: [
                '#000',
                Colors.red.base,
                Colors.pink.base,
                Colors.purple.base,
                Colors.deepPurple.base,
                Colors.indigo.base,
                Colors.blue.base,
                Colors.lightBlue.base,
                Colors.cyan.base,
                Colors.teal.base,
                Colors.green.base,
                Colors.lightGreen.base,
                Colors.lime.base,
                Colors.yellow.base,
                Colors.amber.base,
                Colors.orange.base,
                Colors.deepOrange.base,
                Colors.brown.base,
                Colors.blueGrey.base,
                Colors.grey.base,
            ],
            theming: {},
            darkMode: false,
        }
    },
    computed: {
        themeName() {
            return this.darkMode ? "dark" : "light";
        },
        themeMode() {
            return this.darkMode ? "themeDark" : "themeLight";
        },
    },
    methods: {
        setPrimaryColor(color) {
            this.primary = color;
            this.$store.dispatch("updatePrimaryColor", {themeMode: this.themeMode, color: color,});
            this.$vuetify.theme.themes[this.themeName].primary = color;
        },
        setAccentColor(color) {
            this.accent = color;
            this.$store.dispatch("updateAccentColor", {themeMode: this.themeMode, color: color,});
            this.$vuetify.theme.themes[this.themeName].accent = color;
        },
        submit() {
            if (this.locale !== this.$i18n.locale) {
                this.$axios.patch("/subscriber/language", { "locale": this.locale, }).then(() => {
                    this.$root.$i18n.locale = this.locale;
                }).catch(err => {
                    console.error(err);
                });
            }
        },

        webPushToggleSubscription() {
            if (this.webPushSupported) {
                this.webPushButtonDisabled = true;
                // Find out if we need to create a webPushSubscription or delete it
                if (!this.webPushEnabled) {
                    // Ask permission and when granted, create new webPushSubscription
                    Notification.requestPermission()
                        .then(result => {
                            // if granted, create new webPushSubscription
                            if (result === "granted") {
                                this.webPushCreateSubscription()
                                    .then(sub => {
                                        console.log("webPushSubscription created on the client", sub);
                                        this.webPushSubscription = sub;

                                        return this.$axios.post(`/webpush/subscribe`, {
                                            type: process.env.VUE_APP_WEBPUSH,
                                            subscription: this.webPushSubscription,
                                        });
                                    })
                                    .then(() => {
                                        this.webPushShowNotification();
                                        this.webPushButtonDisabled = false;
                                        this.webPushEnabled = true;
                                    });
                            } else {
                                console.log("User did not granted permission");
                            }
                        });
                } else {
                    // Destroy webPushSubscription
                    console.log("Disable webPushSubscription");
                    if (this.webPushSubscription !== null) {
                        // destroy on the server
                        return this.$axios.post(`/webpush/unsubscribe`, {
                            type: process.env.VUE_APP_WEBPUSH,
                            endpoint: this.webPushSubscription.endpoint,
                        })
                        // unsubscribe on the client
                            .then(() => this.webPushSubscription.unsubscribe())
                            .then(() => {
                                // update the data
                                this.webPushEnabled = false;
                                this.webPushButtonDisabled = false;
                                this.webPushSubscription = null;
                            });
                    }
                }
            }
        },
        webPushCreateSubscription() {
            console.log("ask for active service worker registration");
            if (this.serviceWorkerRegistation === null) {
                return navigator.serviceWorker.ready // returns a Promise, the active SW registration
                    .then(swreg => {
                        this.serviceWorkerRegistation = swreg;
                        return this.webPushSubscribe(this.serviceWorkerRegistation);
                    });
            } else {
                return this.webPushSubscribe(this.serviceWorkerRegistation);
            }
        },
        webPushGetSubscription(swreg) {
            // Ask for available webPushSubscription
            return swreg.pushManager.getSubscription();
        },
        webPushSubscribe(swreg) {
            console.log("create new webPushSubscription for this browser on this device");
            // create new webPushSubscription for this browser on this device
            const vapidPublicKey = process.env.VUE_APP_VAPID_PUBLIC_KEY;
            const convertedVapidPublicKey = Tools.urlBase64ToUint8Array(vapidPublicKey);
            // return the webPushSubscription promise, we chain another then where we can send it to the server
            return swreg.pushManager.subscribe({
                userVisibleOnly: true,
                // This is for security. On the backend, we need to do something with the VAPID_PRIVATE_KEY
                // that you can find in .env to make this work in the end
                applicationServerKey: convertedVapidPublicKey,
            });
        },
        webPushShowNotification() {
            this.serviceWorkerRegistation.showNotification(this.$t("first-notif-title"), {
                body: this.$t("first-notif"),
                icon: "./img/android-chrome-192x192.png",
                vibrate: [300, 200, 300,],
                badge: "./img/badge-96x96.png",
            });
        },
        webPushFindSubscription() {
            // Get active service worker registration
            return navigator.serviceWorker.ready
                .then(swreg => {
                    this.serviceWorkerRegistation = swreg;
                    return this.webPushGetSubscription(this.serviceWorkerRegistation);
                });
        },
        webPushCreate() {
            // dont work at this time. Not activated
            // get the textarea content and send it to the server.
            // The server will create a notifications that will be pushed
            return this.$axios.post(`/webpush/notify`, {
                message: this.message,
            })
                .then(() => {
                    this.message = null;
                });
        },
        async webAuthnToggle() {
            if (this.webAuthnSupported) {
                // Find out if we need to create a webPushSubscription or delete it
                if (!this.webAuthnEnabled) {

                    let user = this.$store.getters.app("user");
                    let publicKey = await this.$axios.get("/webauthn/register/challenge");
                    publicKey = publicKey.data;
                    // publicKey.challenge = Uint8Array.from(Tools.urlBase64ToUint8Array(publicKey.challenge), c=>c.charCodeAt(0));
                    publicKey.challenge = Tools.urlBase64ToUint8Array(publicKey.challenge).buffer;
                    publicKey.user.id = Tools.urlBase64ToUint8Array(publicKey.user.id).buffer; // Uint8Array.from(publicKey.user.id, c=>c.charCodeAt(0));
                    // publicKey.rp.id = Uint8Array.from(publicKey.rp.id, c=>c.charCodeAt(0));
                    // delete publicKey.rp.id;

                    if (publicKey.excludeCredentials) {
                        publicKey.excludeCredentials = publicKey.excludeCredentials.map(function(data) {
                            return {
                                ...data,
                                "id": Tools.urlBase64ToUint8Array(data.id).buffer, // Uint8Array.from(data.id, c=>c.charCodeAt(0)),
                            };
                        });
                    }
                    // delete publicKey.rp.id;
                    publicKey = { publicKey: publicKey, };

                    // register / create a new credential - select and choice fingerprint interface
                    navigator.credentials.create(publicKey)
                        .then((cred) => {

                            let publicKeyCredential = {
                                id: cred.id,
                                type: cred.type,
                                rawId: Tools.arrayToBase64String(new Uint8Array(cred.rawId)),
                                response: {
                                    clientDataJSON: Tools.arrayToBase64String(new Uint8Array(cred.response.clientDataJSON)),
                                    attestationObject: Tools.arrayToBase64String(new Uint8Array(cred.response.attestationObject)),
                                },
                            };

                            return this.$axios.post("/webauthn/register/check", publicKeyCredential);
                        })
                        .then((data) => {
                            this.webAuthnEnabled = true;
                            this.$store.commit("appLocalSet", { key: "settings.webauthn", value: this.webAuthnEnabled, });
                            this.$store.commit("appLocalSet", { key: "login.email", value: user.email, });
                        })
                        .catch((err) => {
                            console.log("ERROR", err);
                            this.webAuthnEnabled = false;
                            this.$store.commit("appLocalSet", { key: "settings.webauthn", value: this.webAuthnEnabled, });
                        });
                } else {

                    // this.$axios.post('/webauthn/register/remove');
                    // Remove
                    this.$store.commit("appLocalRm", { key: "login.email", });
                    this.$store.commit("appLocalSet", { key: "settings.webauthn", value: this.webAuthnEnabled, });
                }


            }
        },
        async reinitConfig() {
            const c = await this.$confirm(this.$t("confirm_reinit_config"));

            if (c) {
                await this.$store.dispatch("updateConfig", { force: true, });
                this.$toast.success(this.$t("success.saved"));
            }
        },
    },
    watch: {
        darkMode(darkMode) {
            this.$store.dispatch("updateDarkMode", darkMode);
            this.$vuetify.theme.dark = this.$store.getters.appLocal("themeDark");

            if (this.$store.getters.appLocal("themeDark")) {
                document.getElementsByTagName("html")[0].style.backgroundColor = "#222";
            } else {
                document.getElementsByTagName("html")[0].style.backgroundColor = "#fafafa";
            }

            this.primary = this.$store.getters.appLocal(`${this.themeMode}PrimaryColor`) || this.$vuetify.theme.themes[this.themeName].primary;
            this.accent = this.$store.getters.appLocal(`${this.themeMode}AccentColor`) || this.$vuetify.theme.themes[this.themeName].primary;

            this.$vuetify.theme.themes[this.themeName].primary = this.primary;
            this.$vuetify.theme.themes[this.themeName].accent = this.accent;
        },
    },
};
</script>

<style scoped lang="scss">
.global {
    .v-item-group > * {
        cursor: pointer;
    }
    .v-settings__item {
        border-width: 1px;
        border-style: solid;
        border-color: #fff !important;
    }

    .v-settings__item--active {
        border-color: gray !important;
        border-width: 3px;
        height: 35px !important;
        width: 35px !important;
    }
}
</style>

<i18n>
    {
    "fr": {
        "primary-color": "Couleur primaire",
        "selected-page-color": "Couleur de la page sélectionnée",
        "dark-mode": "Thème sombre :"
    },
    "en": {
        "primary-color": "Primary color",
        "selected-page-color": "Selected page color",
        "dark-mode": "Dark mode :"
    }
    }
</i18n>
