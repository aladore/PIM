<template>
    <grid-block :title="title" :header="title ? true : false">
        <iframe v-if="properties.url" :src="url" width="100%" height="1000px;" frameborder="0"></iframe>
    </grid-block>
</template>

<script>
import CrmComponentMixin from "@/mixins/CrmComponentMixin";

export default {
    name: "Iframe-View",
    components: {},
    mixins: [CrmComponentMixin],
    props: {
        properties: {
            type: Object,
            default() {
                return {
                    background: false,
                    url: "",
                };
            },
        },
    },
    data() {
        return {};
    },
    computed: {
        url: {
            get() {
                let user = this.$store.state.app.user,
                    url = this.properties.url;

                if (this.properties.hasOwnProperty("condition")) {
                    let field = this.properties.condition.field,
                        value = null;
                    if (field.startsWith("cf_")) {
                        field = field.replace("cf_", "");
                        value = user.customFields[field];
                    } else {
                        value = user[field];
                    }

                    url = this.properties.condition.into.hasOwnProperty(value) ? this.properties.condition.into[value] : url;
                }

                url = this.$options.filters.renderTemplate(url, {
                    user: user,
                    subscriber: this.$store.getters.app("subscriber"),
                });

                return url;
            },
        },
    },
};
</script>

<style scoped lang="scss"></style>
