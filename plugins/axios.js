import Axios from "axios";
import { setupCache } from "axios-cache-adapter";
import localforage from "localforage";
import * as queryString from "querystring";
import Vue from "vue";
import router from "../router";
import store from "../store/store";
import i18n from "./i18n";

const cacheStore = localforage.createInstance({
    name: process.env.VUE_APP_PREFIX.toLocaleLowerCase() + "-request",
    // List of drivers used
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

export { cacheStore }; // export to allow vuex store to access this cache store to clear it when logout

// https://www.npmjs.com/package/axios-cache-adapter#options
const cache = setupCache({
    maxAge: 60 * 60 * 1000, // default to 1 hour
    store: cacheStore,
    ignoreCache: process.env.NODE_ENV === "development",
    readOnError: true,
    key: req => req.url + (req.params ? "?" + JSON.stringify(req.params) : ""),
});

const axios = Axios.create({
    baseURL: process.env.VUE_APP_ROOT_API,
    adapter: cache.adapter,
});

axios.interceptors.request.use(
    config => {
        const tokenName = process.env.VUE_APP_PREFIX.toLocaleLowerCase() + "-user-token";
        let token = localStorage.getItem(tokenName);

        if (config.url.indexOf('s3-eu-west-1.amazonaws.com') > -1) { return config; }

        if (config.url.indexOf("send-up.net") > -1 || config.url.startsWith("/")) {
            // Add information for api and protect domain
            // no header for external site
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }

            let configHeaders = store.getters.config.headers;
            if (configHeaders) {
                config.headers = { ...config.headers, ...configHeaders };
            }

            if (config.headers.hasOwnProperty("disable") && config.headers.disable) {
                console.log("No header");
                config.headers = {};
            }
        }

        return config;
    },

    error => {
        return Promise.reject(error);
    },
);

axios.interceptors.response.use(
    async response => {
        try {
            if (response.request.fromCache) {
                const fullUrl = cache.config.key(response.config);
                let cacheItem = await cacheStore.getItem(fullUrl);
                if (cacheItem) {
                    response.request.expires = cacheItem.expires;
                    response.request.cached = cacheItem.expires - (response.config.cache?.maxAge || cache.config.maxAge);
                }
            }
        } catch (err) {
            console.error(err);
        }

        return response;
    },
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            let status = error.response.status;

            switch (status) {
                case 401: // Unauthorized
                    router.push({ name: "logout" });
                    break;
                case 403: // Forbidden
                    Vue.prototype.$toast.error(i18n.t("error.unauthorized"));
                    break;
                default:
                    Vue.prototype.$toast.error(i18n.t("error.unexpected"));
                    break;
            }
        }
        return Promise.reject(error);
    },
);

export default axios;
