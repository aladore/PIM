import ToolsMixin from "@/mixins/ToolsMixin";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import i18n from "./plugins/i18n";
import axios from "./plugins/axios";
import io from "@/plugins/socket-io";
import vuetify from "./plugins/vuetify";
import "@/plugins/vuetify-plugins";
import moment from "@/plugins/moment";
import "./plugins/vue-editor";
import VueMoment from "vue-moment";
import "./assets/css/index.scss";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import pwa from "./registerServiceWorker";
import Vuelidate from "vuelidate";

// Custom
import TransparentMixin from "./mixins/TransparentMixin";
import GridBlock from "./components/Core/GridBlock";
import "@/filters";
import "@/directives";

Vue.mixin(ToolsMixin);
Vue.mixin(TransparentMixin);
Vue.use(VueMoment, { moment });
Vue.use(Vuelidate);
Vue.component(GridBlock.name, GridBlock);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$io = io;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function main() {
    await Promise.all([store.dispatch("updateConfig", { force: process.env.NODE_ENV === "development" })]);

    new Vue({
        vuetify,
        router,
        store,
        i18n,
        render: h => h(App),
    }).$mount("#app");

    // After create Vue instance to benefit store and notification
    pwa.init();
    io.init();

    // TODO: voir pourquoi avec vincent aucun soucis d'event load et pour theo et david, l'event n'est pas émit
    // Fix pwa error, sometime the 'load' event is not triggered
    window.dispatchEvent(new Event("load"));
}

main();
