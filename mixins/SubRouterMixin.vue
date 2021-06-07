<script>
import * as urljoin from "url-join";
import VueRouter from "vue-router";
import mainRouter from "@/router";

/**
 * Need to add "router: new VueRouter()," to the root vue object
 */
export default {
    data() {
        return {
            routes: [],
        };
    },
    created() {
        // add a 404 page handler
        let routes = Object.assign([], this.routes);
        let routesToAdd = [];
        routes.push({
            path: "*",
            name: "404",
            beforeEnter: () => mainRouter.replace("/"),
        });

        for (let route of routes) {
            if (this.$srRouteNameAlreadyRegistered(route.name)) {
                continue;
            }
            route.path = urljoin("/", this.$srGetParentRouterPath, route.path);
            routesToAdd.push(route);
        }

        this.$router.addRoutes(routesToAdd);
    },
    methods: {
        $srRouteNameAlreadyRegistered(routeName) {
            const registered = this.$router.resolve({ name: routeName });
            // if (registered && registered.href !== "#/" && registered.href !== "/") {
            //     return true
            // }
            //
            // return false
            return registered.resolved.matched.length > 0;
        },
    },
    computed: {
        $srGetParentRouterPath() {
            try {
                // return this.$root.$route.path;
                // return instance.$parent.$route.path;
                return this.$root.$route.params.page;
            } catch (e) {
                return "";
            }
        },
    },
};
</script>
