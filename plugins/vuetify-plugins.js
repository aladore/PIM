import i18n from "@/plugins/i18n";
import vuetify from "@/plugins/vuetify";
import Vue from "vue";
import VuetifyToast from "vuetify-toast-snackbar-ng";
import VuetifyConfirm from "vuetify-confirm/src";

Vue.use(VuetifyConfirm, {
    vuetify,
    buttonTrueText: i18n.t("OK"),
    buttonFalseText: i18n.t("cancel"),
    color: "primary",
    // icon: 'fa-exclamation',
    title: i18n.t("warning"),
    width: 500,
    property: "$confirm",
});

Vue.use(VuetifyToast, {
    x: "right", // default
    y: "top", // default
    color: "info", // default
    icon: "fa-info",
    iconColor: "", // default
    classes: [
        // 'text-body-2'
    ],
    timeout: 3000, // default
    dismissable: true, // default
    multiLine: false, // default
    vertical: false, // default
    queueable: true, // default
    showClose: false, // default
    closeText: "", // default
    closeIcon: "fa-window-close", // default
    closeColor: "", // default
    slot: [], //default
    shorts: {
        custom: {
            // color: 'purple'
        },
    },
    property: "$toast", // default
});
