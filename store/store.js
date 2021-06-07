import i18n, { setI18nLanguage } from "@/plugins/i18n";
import ConfigModule from "@/store/modules/config";
import productsModule from "./modules/products";
import { Tools } from "@/utils/Tools";
import jwt_decode from "jwt-decode";
import Vue from "vue";
import Vuex from "vuex";
import axios, { cacheStore as axiosCacheStore } from "../plugins/axios";
export const strict = false;
Vue.use(Vuex);

const tokenName = process.env.VUE_APP_PREFIX.toLocaleLowerCase() + "-user-token";
const token = localStorage.getItem(tokenName) || null;
let user = null,
    dtoken = null;

if (token) {
    dtoken = jwt_decode(token);
    user = dtoken.subscriber;
    if (dtoken.subscriber.language && dtoken.subscriber.language !== i18n.locale) {
        setI18nLanguage(dtoken.subscriber.language);
    }
}

export default new Vuex.Store({
    strict: process.env.NODE_ENV === "development",
    modules: {
        configModule: ConfigModule,
        productsModule,
    },
    state: {
        status: "",
        app: {
            token: token,
            user: user,
            subscriber: null, // current subscriber
        },
        memory: {},
        isEditableLayout: false,
    },
    mutations: {
        AUTH_REQUEST: state => {
            state.status = "loading";
        },
        AUTH_SUCCESS: (state, token) => {
            state.app.token = token;
            dtoken = jwt_decode(token);
            state.app.user = dtoken.subscriber;
            if (dtoken.subscriber.language && dtoken.subscriber.language !== i18n.locale) {
                setI18nLanguage(dtoken.subscriber.language);
            }
            localStorage.setItem(tokenName, token); // store the token in localstorage
        },
        AUTH_LOGOUT: state => {
            state.app.token = undefined;
            localStorage.removeItem(tokenName);
            axiosCacheStore.clear();
            sessionStorage.clear();
        },
        appLocalSet(state, payload) {
            // if (!window.localStorage) {
            //     console.log("localStorage doesn't work with your browser");
            //     return;
            // }

            state.app[payload.key] = payload.value;
            localStorage.setItem(`${process.env.VUE_APP_PREFIX}.${payload.key}`, JSON.stringify(payload.value));
        },
        appLocalRm(state, payload) {
            delete state.app[payload.key];
            localStorage.removeItem(`${process.env.VUE_APP_PREFIX}.${payload.key}`);
        },
        appSet(state, payload) {
            state.app[payload.key] = payload.value;
            sessionStorage.setItem(process.env.VUE_APP_PREFIX + "." + payload.key, JSON.stringify(payload.value));
        },
        appRm(state, payload) {
            delete state.app[payload.key];
            sessionStorage.removeItem(process.env.VUE_APP_PREFIX + "." + payload.key);
        },
        appMemorySet(state, payload) {
            state.memory[payload.key] = payload.value;
        },
        appMemoryRm(state, payload) {
            delete state.memory[payload.key];
        },
        toggleEditableLayout(state) {
            state.isEditableLayout = !state.isEditableLayout;
        },
        userAvatar(state, value) {
            state.app.user.info.avatar = value;
        },
    },
    actions: {
        changeAvatarValue({ state }, value) {
            this.commit("userAvatar", value);
        },
        updatePrimaryColor({ state }, args) {
            if (!window.localStorage) {
                console.log("localStorage doesn't work with your browser");
            } else if (args.color === undefined) {
                // Remove ${args.themeMode}PrimaryColor to keep the color of the config.json
                this.commit("appLocalRm", { key: `${args.themeMode}PrimaryColor` });
            } else {
                this.commit("appLocalSet", { key: `${args.themeMode}PrimaryColor`, value: args.color });
            }
        },
        updateAccentColor({ state }, args) {
            if (!window.localStorage) {
                console.log("localStorage doesn't work with your browser");
            } else if (!args.color) {
                // Remove themePageColor to keep the color by default
                this.commit("appLocalRm", { key: `${args.themeMode}AccentColor` });
            } else {
                this.commit("appLocalSet", { key: `${args.themeMode}AccentColor`, value: args.color });
            }
        },
        updateDarkMode({ commit }, darkMode) {
            this.commit("appLocalSet", { key: "themeDark", value: darkMode });
        },
        AUTH_REQUEST: ({ commit, state }, data) => {
            return new Promise((resolve, reject) => {
                data._type = state.configModule.config.brand.api.type;
                data._typeToken = state.configModule.config.brand.api.id;
                // The Promise used for router redirect in login
                commit("AUTH_REQUEST");
                // console.log(data);
                axios
                    .request({ url: "/login", data: data, method: "POST" })
                    .then(resp => {
                        const token = resp.data.token;
                        commit("AUTH_SUCCESS", token);

                        // you have your token, now log in your user :)
                        // dispatch("USER_REQUEST");
                        resolve(resp);
                    })
                    .catch(err => {
                        // commit("AUTH_ERROR", err);
                        commit("AUTH_LOGOUT"); // if the request fails, remove any possible user token if possible
                        reject(err.response);
                    });
            });
        },
        AUTH_REQUEST_WEBAUTHN: ({ commit, state }, data) => {
            return new Promise((resolve, reject) => {
                data._type = state.configModule.config.brand.api.type;
                data._typeToken = state.configModule.config.brand.api.id;
                // The Promise used for router redirect in login
                commit("AUTH_REQUEST");
                axios
                    .request({ url: "/webauthn/login/challenge", data: data, method: "POST" })
                    .then(publicKey => {
                        publicKey = publicKey.data;
                        publicKey.challenge = Tools.urlBase64ToUint8Array(publicKey.challenge).buffer;
                        publicKey.allowCredentials = publicKey.allowCredentials.map(function(data) {
                            return {
                                ...data,
                                id: Tools.urlBase64ToUint8Array(data.id).buffer,
                            };
                        });

                        return navigator.credentials.get({ publicKey: publicKey });
                    })
                    .then(cred => {
                        let publicKeyCredential = {
                            id: cred.id,
                            type: cred.type,
                            rawId: Tools.arrayToBase64String(new Uint8Array(cred.rawId)),
                            response: {
                                authenticatorData: Tools.arrayToBase64String(new Uint8Array(cred.response.authenticatorData)),
                                clientDataJSON: Tools.arrayToBase64String(new Uint8Array(cred.response.clientDataJSON)),
                                signature: Tools.arrayToBase64String(new Uint8Array(cred.response.signature)),
                                userHandle: null,
                                //     userHandle: data.response.userHandle ? Tools.arrayToBase64String(new Uint8Array(cred.response.userHandle)) : null
                            },
                        };

                        data = { user: data, publicKey: publicKeyCredential };

                        axios
                            .request({ url: "/webauthn/login/check", data: data, method: "POST" })
                            .then(resp => {
                                const token = resp.data.token;

                                commit("AUTH_SUCCESS", token);

                                // you have your token, now log in your user :)
                                // dispatch("USER_REQUEST");
                                resolve(resp);
                            })
                            .catch(err => {
                                // commit("AUTH_ERROR", err);
                                commit("AUTH_LOGOUT"); // if the request fails, remove any possible user token if possible
                                reject(err);
                            });
                    })
                    .catch(err => {
                        // commit("AUTH_ERROR", err);
                        commit("AUTH_LOGOUT"); // if the request fails, remove any possible user token if possible
                        reject(err);
                    });
            });
        },
    },
    getters: {
        appMemory: state => key => {
            if (state.memory[key]) {
                return state.memory[key];
            }

            return "";
        },
        appLocal: state => key => {
            if (state.app[key]) {
                return state.app[key];
            }

            let value = localStorage.getItem(`${process.env.VUE_APP_PREFIX}.${key}`);
            if (value) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    value = null;
                }
            }

            return value;
        },
        app: state => key => {
            if (state.app[key]) {
                return state.app[key];
            }

            let value = sessionStorage.getItem(process.env.VUE_APP_PREFIX + "." + key);
            if (value) {
                value = JSON.parse(value);
            }

            return value;
        },
        supplierId: state => key => {

            if (sessionStorage["su-supplier-id"]) {
                return sessionStorage["su-supplier-id"];
            }

            const supplier = state.configModule.config.brand.extra.SupplierId;
            if (state.app.user.customFields.hasOwnProperty(supplier)) {
                return state.app.user.customFields[supplier] || null;
            }

            return null;
        },
        isAuthenticated: state => !!state.app.token,
        isGranted: state => role => {
            let roles = state.app.user.customFields.Roles;
            if (!roles) {
                return false;
            }
            return roles.includes("ROLE_" + role);
        },
        authStatus: state => state.status,
    },
});
