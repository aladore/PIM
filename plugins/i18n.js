import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "@/locales/fr";
import axios from "axios";

Vue.use(VueI18n);

const dateTimeFormats = {
    fr: {
        long: {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        },
        medium: {
            weekday: "long",
            day: "numeric",
            month: "long",
        },
    },
};

const i18n = new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "en",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    // locale: this.$store.getters.locale || "en",
    // fallbackLocale: this.$store.getters.localeFallback || "en",
    messages, // set locale messages
    dateTimeFormats,
    silentTranslationWarn: true,
});

const loadedLanguages = ["fr"]; // our default language that is preloaded

export function setI18nLanguage(lang) {
    i18n.locale = String(lang).toLowerCase();
    axios.defaults.headers.common["Accept-Language"] = lang;
    document.querySelector("html").setAttribute("lang", lang);
    return lang;
}

export function loadLanguageAsync(lang) {
    if (i18n.locale !== lang) {
        if (!loadedLanguages.includes(lang)) {
            return import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}`).then(msgs => {
                i18n.setLocaleMessage(lang, msgs.default);
                loadedLanguages.push(lang);
                return setI18nLanguage(lang);
            });
        }
        return Promise.resolve(setI18nLanguage(lang));
    }
    return Promise.resolve(lang);
}

export default i18n;
