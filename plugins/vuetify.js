import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import fr from "vuetify/es5/locale/fr";
import Vuetify, { VIcon, VSnackbar } from "vuetify/lib";

Vue.use(Vuetify, {
    components: {
        // for vuetify-toast-snackbar
        VSnackbar,
        VIcon,
        //
    },
});

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#39454e",
                secondary: "#FFFFFF",
                accent: "#546E7A",
                error: "#f44336",
                warning: "#FFC107",
                info: "#2196f3",
                success: "#4caf50",
                color0: "#ad46b6",
                color1: "#f04379",
                color2: "#055395",
                color3: "#0096a5",
                color4: "#8e6d64",
                color5: "#5e4339",
                color6: "#74919b",
                color7: "#f75329",
                color8: "#679e44",
            },
            dark: {
                primary: "#011C40",
                secondary: "#707070",
                accent: "#546E7A",
                error: "#f44336",
                warning: "#FFC107",
                info: "#2196f3",
                success: "#4caf50",
            },
        },
        options: {
            customProperties: true,
            // TODO: david: j'ai repris la version donnée dans la doc, à tester ;)
            // minifyTheme: function (css) {
            //     return process.env.NODE_ENV === 'production'
            //         ? css.replace(/[\r\n|\r|\n]/g, '')
            //         : css
            // },
        },
    },
    icons: {
        iconfont: "fa",
        values: {
            event: "fa-calendar",
            user: "fas fa-id-card-alt",
            contact: "fas fa-user",
            third: "fas fa-building",
        },
    },
    lang: {
        locales: { fr },
        current: "fr",
    },
});

// {
//     addCss: function() {
//         let css = `
// :root {
//     --v-primary-base: ${store.getters.config.theme.primary};
//     --v-secondary-base: ${theme.themes.dark.secondary};
//     --v-primary-background: ${theme.themes.dark.background};
// }`;
//
//         let style = window.document.createElement("style");
//         style.setAttribute("type", "text/css");
//         style.setAttribute("id", "su-css");
//         style.appendChild(document.createTextNode(css));
//
//         let head = document.getElementsByTagName("head")[0];
//         head.insertBefore(style, head.childNodes[0]);
//     },
//     init: function() {
//         return ;
//     },
// }
