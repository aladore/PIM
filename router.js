import NotFoundPage from "@/views/NotFoundPage";
import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next();
        return;
    }
    next("/");
};

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next();
        return;
    }
    next("/login");
};

const router = new Router({
    routes: [
        {
            path: "/login",
            name: "login",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "core" */ "./views/Login.vue"),
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: "/logout",
            name: "logout",
            beforeEnter: function(to, from, next) {
                store.commit("AUTH_LOGOUT");
                next("/login");
            },
        },
        {
            path: "",
            name: "auth",
            component: () => import(/* webpackChunkName: "core" */ "./views/AppAuth.vue"),
            beforeEnter: ifAuthenticated,
            children: [
                {
                    path: "/404",
                    name: "404",
                    component: NotFoundPage,
                },
                {
                    path: "settings",
                    name: "settings",
                    component: () => import(/* webpackChunkName: "core" */ "./views/Settings.vue"),
                },
                {
                    path: ":page?/:id?/:refresh?",
                    name: "main",
                    component: () => import(/* webpackChunkName: "core" */ "./views/Main.vue"),
                    // afterEach: (to, from) => {console.log("afterEach:", to, from);},
                    // beforeEach: (to, from, next) => {console.log("beforeEach:", to, from); next()},
                    // beforeResolve: (to, from, next) => {console.log("beforeResolve:", to, from); next()},
                },
                {
                    path: "product-detail",
                    name: "product-detail",
                    component: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Product"),
                },
                {
                    path: "productsFiles",
                    name: "productsFiles",
                    component: () => import(/* webpackChunkName: "core" */ "@/components/Pim/ProductsFiles"),
                },
                // {
                //     path: "Products",
                //     name: "Products",
                //     meta: { authorize: "DRIVE3", },
                //     component: () => import(/* webpackChunkName: "core" */ "@/components/Pim/Products"),
                // },
            ],
        },
    ],
});

// router.beforeEach((to, from, next) => {
//     const lang = to.params.lang;
//     loadLanguageAsync(lang).then(() => next());
// });

router.beforeEach((to, from, next) => {
    if (!to.matched.length) {
        next("/404");
    } else {
        next();
    }
});

export default router;
