<template>
    <v-flex class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-flex">
                <v-icon class="su-title-icon" color="white">fa-chart-line</v-icon>
                <span class="su-title" v-t="'statistics'"></span>
            </v-col>
        </v-row>
        <v-row v-if="$isGranted('PIM_ADMIN')">
            <v-col cols="12" md="4">
                <subscriber-autocomplete
                    v-model="filterSupplier"
                    :label="$t('provider')"
                    :search-extra="$store.getters.config.brand.extra.supplier"
                    :height="'56px'"
                    colorBack="white"
                    @input="getStats"
                    solo
                    flat
                    :no-data-text="$t('StartTypingNameOfAProvider')"
                    hide-no-data
                ></subscriber-autocomplete>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <card-stats
                    :filter="{ type: 'productsTotal', filterSelectStatut: `data.Enabled=true`, filterSupplier: filterSupplier }"
                    :title="$t('TotalProduct')"
                    :total="counter.numberTotal"
                ></card-stats>
            </v-col>
            <v-col cols="12" md="4">
                <card-stats
                    :filter="{
                        type: 'productsCompleted',
                        filterSelectStatut: 'data.Enabled=true AND data.Status=1',
                        filterSupplier: filterSupplier,
                    }"
                    :title="$t('FileComplete')"
                    :total="counter.numberCompleted"
                ></card-stats>
            </v-col>
            <v-col cols="12" md="4">
                <card-stats
                    :filter="{
                        type: 'productsUncompleted',
                        filterSelectStatut: 'data.Enabled=true AND data.Status=0',
                        filterSupplier: filterSupplier,
                    }"
                    :title="$t('FileUncomplete')"
                    :total="counter.numberUncompleted"
                ></card-stats>
            </v-col>
        </v-row>
        <!--        <v-row>-->
        <!--            <v-col cols="12">-->
        <!--                <div class="su-alert-block">-->
        <!--                    <span class="su-block-title" v-t="'alerts'"></span>-->
        <!--                    <div class="clear"></div>-->
        <!--                    <span class="su-alert-msg" v-t="'alertmsg'"></span>-->
        <!--                    <span class="su-alert-msg">00/00/0000</span>-->
        <!--                </div>-->
        <!--            </v-col>-->
        <!--        </v-row>-->
    </v-flex>
</template>

<script>
import CardStats from "@/components/Core/CardStats";
import SubscriberAutocomplete from "@/components/Core/Subscriber/SubscriberAutocomplete";
export default {
    name: "Statistics",
    components: {
        SubscriberAutocomplete,
        CardStats,
    },
    data() {
        return {
            counter: {
                numberTotal: "0",
                numberCompleted: "0",
                numberUncompleted: "0",
            },
            filterSupplier: null,
        };
    },
    mounted() {
        this.getStats();
    },
    methods: {
        getStats() {
            this.counter.numberTotal = "0";
            this.counter.numberUncompleted = "0";

            let isAdmin = this.$isGranted("PIM_ADMIN"),
                customField = this.$store.getters.config.brand.extra.SupplierId,
                url = `/pim/products/statistics`,
                params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.productPath,
                    aggs: "data.Status",
                };

            if (isAdmin) {
                if (this.filterSupplier) {
                    params.extra = `data.${customField}.keyword=${this.filterSupplier.customId}`;
                }
            } else {
                params.extra = `data.${customField}.keyword=${this.$store.getters.supplierId()}`;
            }

            this.$axios
                .get(url, { params: params, })
                .then(data => {
                    if (data.data.aggregations.stats.buckets.length > 0) { // fiches completes + incompletes
                        data.data.aggregations.stats.buckets.forEach((bucket) => {
                            if (bucket.key === 0) {
                                this.counter.numberUncompleted = JSON.stringify(bucket.doc_count);
                            }
                            if (bucket.key === 1) {
                                this.counter.numberCompleted = JSON.stringify(bucket.doc_count);
                            }
                        });
                    } else { // fiches incompletes
                        this.counter.numberUncompleted = JSON.stringify(data.data.aggregations.stats.buckets[0].doc_count);
                        this.counter.numberCompleted = JSON.stringify(0);
                    }
                    this.counter.numberTotal = JSON.stringify(
                        Number(this.counter.numberUncompleted) + Number(this.counter.numberCompleted),
                    );
                })
                .catch(err => {
                    console.log(err);
                });
        },
    },
};
</script>

<style scoped lang="scss">
.clear {
    clear: both;
}
.su-search-bar {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    border-radius: 10px;
    opacity: 1;
    max-height: 56px;
}

.su-title {
    text-align: left;
    font: 24px/29px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
    margin: 5px;
}

.su-title-icon {
    width: 39px;
    height: 39px;
    margin-right: 10px;
    border-radius: 20%;
    background-color: #5faad9;
}

.su-alert-block {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    border-radius: 10px;
    opacity: 1;
    padding: 15px;
    padding-left: 30px;
}

.su-block-title {
    text-align: left;
    font: 24px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}
.su-alert-msg {
    text-align: left;
    font: 17px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #023473;
    opacity: 1;
}
</style>

<i18n>
    {
        "fr": {
            "TotalProduct" : "Total produits",
            "FileComplete" : "Fiches complètes",
            "FileUncomplete" : "Fiches incomplètes",
            "alertmsg": "Merci de compléter les informations avant le ",
            "alerts": "Alertes :",
            "statistics": "Statistiques",
            "provider": "Fournisseur",
            "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
        },
        "en": {
            "TotalProduct" : "Total products",
            "FileComplete" : "File complete",
            "FileUncomplete" : "File uncomplete",
            "alertmsg": "Please complete the information before ",
            "alerts": "Alerts :",
            "statistics": "Statistics",
            "provider": "Provider",
            "StartTypingNameOfAProvider": "Start typing the name of a provider"
        }
    }
</i18n>
