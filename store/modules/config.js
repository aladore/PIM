import i18n from "@/plugins/i18n";
import axiosLocal from "axios";
import jmespath from "jmespath";
import setValue from "set-value";

export default {
    state: {
        config: {
            s: {},
            menu: {},
            addons: {},
        },
    },
    mutations: {
        setConfig(state, config) {
            for (let key of Object.keys(config.i18n)) {
                i18n.mergeLocaleMessage(key, config.i18n[key]);
            }

            state.config = config;
            localStorage.setItem(process.env.VUE_APP_PREFIX.toLocaleLowerCase() + "-config", JSON.stringify(config));
        },
    },
    actions: {
        async updateConfig(store, options = { force: false }) {
            let config = localStorage.getItem(process.env.VUE_APP_PREFIX.toLocaleLowerCase() + "-config");
            const { data: configOrigin } = await axiosLocal.get("config.json");

            try {
                config = JSON.parse(config);

                if (
                    config?.LastCompiled !== configOrigin.LastCompiled ||
                    config?.LastModified !== configOrigin.LastModified ||
                    options?.force
                ) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error();
                }
            } catch (e) {
                config = configOrigin;
            }

            let primaryColor = localStorage.getItem(process.env.VUE_APP_PREFIX.toLocaleLowerCase() + ".themePrimaryColor");
            if (primaryColor) {
                setValue(config, "theme.themes.dark.primary", primaryColor);
            }
            store.commit("setConfig", config);
        },
        savePageLayout({ state, commit, rootState }, page) {
            page = JSON.parse(JSON.stringify(page));

            if (!rootState.isEditableLayout) return;

            const indexOf = state.config.pages.findIndex(item => item.name === page.name);

            let config = JSON.parse(JSON.stringify(state.config));
            config.pages[indexOf] = page;
            commit("setConfig", config);
        },
    },
    getters: {
        config(state) {
            return state.config;
        },
        brand(state) {
            return state.config.brand;
        },
        views(state) {
            return state.config.brand.subscriber.ui.views;
        },
        fields(state) {
            return state.config.brand.subscriber.Fields;
        },
        customFields(state) {
            return state.config.brand.subscriber.CustomFields;
        },
        menu(state) {
            return state.config.menu;
        },
        pages(state) {
            return state.config.pages;
        },
        extra(state) {
            return state.config.extra.SupplierId;
        },
        /**
         * Search and return the page with the pageTitle
         * @returns {{title, layout}}
         * @param state
         */
        getPageByName: state => name => {
            const page = state.config.pages.find(page => page.name === name);
            return page ? { ...page } : null;
        },
        hasRightOnPage: (state, getters) => page => {
            if (!page) return true;

            // CHECK RIGHTS
            if (Array.isArray(page.roles) && page.roles.length) {
                let hasRightToAccessPage = false;

                for (const roles of page.roles) {
                    const splitedRoles = roles.split(",").map(role => role.trim());

                    let hasRight = true;
                    for (const role of splitedRoles) {
                        if (!getters.isGranted(role)) {
                            hasRight = false;
                        }
                    }

                    if (hasRight) {
                        hasRightToAccessPage = true;
                        break;
                    }
                }

                return hasRightToAccessPage;
            }

            return true;
        },
        toolbar(state) {
            return state.config.toolbar;
        },
        globalProperties: state => key => {
            return jmespath.search(state.config.globalProperties, key);
        },
        offlineConfig: state => {
            return state.config.offline || {};
        },
    },
};
