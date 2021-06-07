<script>
export default {
    props: {
        properties: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            propertiesForm: {},
        };
    },
    methods: {
        hasOfflineService(serviceName) {
            return !!this.$store.getters.offlineConfig[serviceName]?.enabled;
        },
    },
    computed: {
        title() {
            if (this.subsAggregate) {
                return this.subsAggregate.name + " - " + this.subsAggregate.customId;
            } else {
                if (!this.properties.title) return "";

                if (this.properties.title.hasOwnProperty(this.$i18n.locale)) {
                    // return title with local
                    return this.properties.title[this.$i18n.locale];
                } else {
                    // return first title
                    return this.properties.title[Object.keys(this.properties.title)[0]];
                }
            }
        },
    },
};
</script>
