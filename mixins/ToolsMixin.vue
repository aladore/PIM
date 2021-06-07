<script>
import { subscriberService } from "@/core/services";
import Tools from "@/utils/Tools";

export default {
    methods: {
        /**
         * @param {string} role
         * @return {boolean}
         */
        $isGranted(role) {
            return this.$store.getters.isGranted(role);
        },

        /**
         * @param {number} subscriberId
         * @param {Object} subscriber
         * @param {boolean} routerReplace
         * @param {boolean} byCustomId
         * @return {Promise}
         */
        async $goToSubscriberPage(subscriberId, subscriber = null, { routerReplace = false, byCustomId = false } = {}) {
            // if subscriber not provided or doesn't have all required fields, make a request to get the subscriber
            if (
                !subscriber ||
                !Tools.hasAllKeys(["id", "customId", "customFields", "name", "type"], subscriber) ||
                subscriber.id !== subscriberId
            ) {
                let { data } = await subscriberService.getByIdOrCustomId(subscriberId, byCustomId);
                subscriber = data;
            }

            this.$store.commit("appSet", { key: "subscriber", value: subscriber });

            let route = subscriber.type === 0 ? "Third" : "Contact";
            if (this.$store.getters.config.viewLink && this.$store.getters.config.viewLink[subscriber.customFields.CodeTypeTiers]) {
                route = this.$store.getters.config.viewLink[subscriber.customFields.CodeTypeTiers];
            }

            if (routerReplace) return;

            return await this.$router.push({ name: "main", params: { page: route, id: subscriber.id } });
        },
    },
    computed: {
        /**
         * @return {boolean}
         */
        $isMobile() {
            return this.$vuetify.breakpoint.mdAndDown;
        },
        /**
         * @return {object}
         */
        $currentUser() {
            return this.$store.getters.app("user");
        },
        $isProd() {
            return process.env.NODE_ENV === "production";
        },
        $isDev() {
            return process.env.NODE_ENV === "development";
        },
    },
};
</script>
