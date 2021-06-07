<template>
    <v-card class="mx-auto su-card-stats" min-width="300px" shaped>
        <v-list-item two-line>
            <v-list-item-avatar size="66" color="#011C40">
                <v-icon color="#fff" size="30">{{ icon }}</v-icon>
            </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
            <v-list-item-content class="su-card-content mb-10">
                <v-list-item-title class="text-h5 mb-1">{{ title }}</v-list-item-title>
                <v-list-item-title class="total mb-1">
                    <animated-number :number="total"></animated-number>
                </v-list-item-title>
            </v-list-item-content>
            <v-card-actions class="mt-12">
                <v-btn
                    v-if="total !== '0'"
                    class="text-none su-card-btn"
                    color="#A2D4F2"
                    :to="{
                        name: 'main',
                        params: { page: 'ProductsFiles' },
                        query: { filterSelectStatut: filter.filterSelectStatut, filterSupplier: filter.filterSupplier },
                    }"
                    bottom
                    link
                    >{{ btnLabel }}</v-btn
                >
            </v-card-actions>
        </v-list-item>
    </v-card>
</template>

<script>
import AnimatedNumber from "@/components/Core/AnimatedNumber";
export default {
    name: "CardStats",
    components: { AnimatedNumber },
    props: {
        title: {
            type: String,
        },
        total: {
            type: String,
        },
        btnAction: {
            type: String,
        },
        btnLabel: {
            type: String,
            default: function() {
                return this.$t("details");
            },
        },
        filter: {
            type: Object,
        },
    },
    data() {
        return {
            titleicon: "./custom/Statistics-hov.svg",
        };
    },
    mounted() {},
    methods: {},
    computed: {
        icon() {
            if (this.filter.type === "productsTotal") {
                return "fas fa-boxes";
            }
            if (this.filter.type === "productsCompleted") {
                return "fas fa-file-alt";
            }
            if (this.filter.type === "productsUncompleted") {
                return "fas fa-file";
            }
            return "";
        },
    },
};
</script>

<style scoped lang="scss">
.su-card-stats {
    background: url(~@/assets/Circle-pim.svg) right bottom no-repeat,
        transparent linear-gradient(260deg, #5faad9 0%, #023473 100%) 0% 0% no-repeat;
    background-size: 300px 300px, auto;
    border-radius: 13px;
    opacity: 1;
    padding: 0 21px;
}

.su-card-content {
    text-align: left;
    color: #ffffff;
}

.text-h5 {
    font: 500 35px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
}

.total {
    font: 500 39px/65px Montserrat, sans-serif;
    letter-spacing: 0px;
    min-width: 500px;
}

.su-card-btn {
    float: right;
    background-color: #a2d4f2;
    border-radius: 7px;
    opacity: 1;
    font: Medium 12px/34px Montserrat;
    letter-spacing: 0px;
    color: #011c40;
    padding: 12px 35px !important;
}
</style>

<i18n>
    {
    "fr": {
    "logout": "Déconnexion",
    "details": "Voir le détail",
    "editMode": "Mode édition"
    },
    "en": {
    "logout": "Logout",
    "details": "See the details",
    "editMode": "Edit mode"
    }
    }
</i18n>
