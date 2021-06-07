<template>
    <v-flex class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-inline-flex">
                <v-icon class="su-title-icon" color="white">fa fa-history</v-icon>
                <span class="su-title" v-t="'records'"></span>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="$isGranted('PIM_ADMIN')" cols="12" lg="3" md="5" sm="6">
                <subscriber-autocomplete
                    class="su-search-bar"
                    :label="$t('provider')"
                    :search-extra="$store.getters.config.brand.extra.supplier"
                    :height="'56px'"
                    v-model="filterSupplier"
                    :no-data-text="$t('StartTypingNameOfAProvider')"
                    hide-no-data
                ></subscriber-autocomplete>
            </v-col>
            <v-col cols="12" lg="2" md="8">
                <v-text-field
                    class="su-search-bar"
                    :label="$t('searchrecord')"
                    v-model="search"
                    outlined
                    background-color="white"
                    clearable
                >
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div class="py-0">
                    <div class="su-results" id="listRecords">
                        <v-data-table
                            fixed-header
                            height="calc(100vh - 410px)"
                            style="overflow: auto"
                            class="elevation-3"
                            :loading="loading"
                            :items="records"
                            :options.sync="options"
                            :server-items-length="totalRecords"
                            :footer-props="{ itemsPerPageOptions: [10, 30, 50] }"
                            :headers="headers"
                        >
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    v-if="$store.getters.isGranted('PIM_PRODUCT_U')"
                                    class="su-action-icon"
                                    color="white"
                                    size="19"
                                    @click="goToProductDetail(item)"
                                    >fas fa-edit</v-icon
                                >
                                <v-icon class="su-action-icon ml-5" color="white" size="19" @click="compare(item)">fas fa-clone</v-icon>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-col>
        </v-row>
        <modal v-model="modalCompare" fullscreen>
            <template slot="title">
                {{ nameProduct }}
            </template>
            <template slot="toolbar-items">
                <span style="color:white;top: auto;margin-top: 22px;margin-right: 10px;"> {{ currentLog }} / {{ logsLength }}</span>
                <v-icon id="modif-prev" class="su-modal-arrow mx-2" @click="previousModif">fas fa-arrow-circle-up</v-icon>
                <v-icon id="modif-next" class="su-modal-arrow mx-2" @click="nextModif">fas fa-arrow-circle-down</v-icon>
            </template>
            <template style="min-width: 100%">
                <div style="min-width: 100%;">
                    <json-diff :old-json="diffOldJson" :new-json="diffNewJson" :date="logDate"></json-diff>
                </div>
            </template>
        </modal>
    </v-flex>
</template>

<script>
    import SubscriberAutocomplete from "@/components/Core/Subscriber/SubscriberAutocomplete";
    import Tools from "@/utils/Tools";
    import Modal from "../Core/Modal";
    import JsonDiff from "@/components/Core/JsonDiff";

    export default {
    name: "Records",
    components: {
        SubscriberAutocomplete,
        Modal,
        JsonDiff,
    },
    data() {
        return {
            options: {},
            loading: true,
            sort: "",
            search: "",
            totalRecords: 0,
            headers: [
                { text: "Date", value: "date", type: "keyword", sortable: false, },
                { text: this.$t("name"), value: "name", type: "keyword", sortable: false, },
                { text: "Message", value: "message", type: "keyword", sortable: false, },
                { text: this.$t("provider"), value: "SupplierName", type: "keyword", sortable: false, },
                { text: this.$t("ProductCode"), value: "Sku", type: "keyword", sortable: false, },
                { text: this.$t("product"), value: "Name", type: "keyword", sortable: false, },
                { text: "Actions", value: "actions", sortable: false, },
            ],
            records: [],
            productLogs: [],
            filterSupplier: null,
            modalCompare: false,
            diffOldJson: {},
            diffNewJson: {},
            currentLog: 0,
            logsLength: 0,
            logDate: "",
            recKey: "0",
            nameProduct: "",
            searchParams: {
                search: "",
            },
        };
    },
    mounted() {
        if (sessionStorage["su-search-params-logs"]) {
            let copySearchParams = JSON.parse(sessionStorage.getItem("su-search-params-logs"));
            this.search = copySearchParams.search;
            if (this.$isGranted("PIM_ADMIN")) {
                this.filterSupplier = copySearchParams.filterSupplier;
            }
        }
        this.setSupplierFilter();
    },
    watch: {
        filterSupplier: "list",
        sort: "list",
        search: "list",
        options: {
            handler: Tools.debounce(function() {
                this.getRecordList();
            }),
            deep: true,
        },
    },
    methods: {
        async compare(item) {
            this.productLogs = await this.getProductLogs(item);
            this.logsLength = this.productLogs.length;
            this.recKey = this.productLogs
                .map(function (x) {
                    return x._source.data.date + x._source.data.Sku;
                })
                .indexOf(item.date + item.Sku);
            this.currentLog = this.recKey + 1;
            this.nameProduct = item.Name;
            this.logDate = item.date;
            this.renderJsonDiff(item.Info.Modification);
            if (this.productLogs.length > 1) {
                if (this.recKey === 0) {
                    document.getElementById("modif-prev").disabled = true;
                    document.getElementById("modif-prev").style.color = "gray";
                    document.getElementById("modif-next").disabled = false;
                    document.getElementById("modif-next").style.color = "white";
                } else if (this.recKey === this.productLogs.length-1) {
                    document.getElementById("modif-next").disabled = true;
                    document.getElementById("modif-next").style.color = "gray";
                    document.getElementById("modif-prev").disabled = false;
                    document.getElementById("modif-prev").style.color = "white";
                } else {
                    document.getElementById("modif-prev").disabled = false;
                    document.getElementById("modif-prev").style.color = "white";
                    document.getElementById("modif-prev").disabled = false;
                    document.getElementById("modif-prev").style.color = "white";
                }
            } else {
                document.getElementById("modif-prev").disabled = true;
                document.getElementById("modif-prev").style.color = "gray";
                document.getElementById("modif-next").disabled = true;
                document.getElementById("modif-next").style.color = "gray";
            }
            this.modalCompare = true;
        },
        async getRecordList() {
            this.records = [];
            const { page, itemsPerPage } = this.options;
            let supplierId = this.$store.getters.supplierId(),
                isAdmin = this.$isGranted("PIM_ADMIN"),
                customField = this.$store.getters.config.brand.extra.SupplierId,
                params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.historicPath,
                    kind: "pimlog",
                    size: 10,
                    page: 1,
                    sort: "data.date.keyword",
                    order: "desc",
                    extra: null,
                    depth: 1,
                },
                url = "/drive/resources";
            isAdmin
                ? (customField = this.$store.getters.config.brand.extra.SupplierId)
                : (customField = this.$store.getters.config.brand.extra.SubscriberId);
            params["extra"] = this.addExtraParams(params, supplierId, customField, isAdmin);
            params.size = itemsPerPage;
            params.page = page;

            if (this.search) {
                params["search"] = this.search;
            }

            await this.$axios
                .get(url, {
                    params: params,
                })
                .then(data => {
                    this.totalRecords = data.data.hits.total.value;

                    for (let hit of data.data.hits.hits) {
                        this.records.push(hit._source.data);
                    }

                    this.loading = false;
                });
        },
        addExtraParams(params, supplierId, customField, isAdmin) {
            let extras = [];

            if (isAdmin) {
                if (this.filterSupplier) {
                    extras.push(`data.${customField}.keyword=${this.filterSupplier.customId}`);
                }
            } else {
                extras.push(`data.subscriberId=${this.$store.state.app.user.id}`);
            }

            return extras.join(" AND ");
        },
        async goToProductDetail(item) {
            let prod = await this.getProduct(item);
            prod._source._id = prod._id;
            if (typeof prod !== "undefined") {
                await this.$router.replace({ name: "product-detail", query: { product: prod._source, logs: "true" } });
            }
        },
        async getProductLogs(item) {
            let extras = [];
            if (this.$isGranted("PIM_ADMIN")) {
                if (this.filterSupplier) {
                    extras.push(`data.SupplierId.keyword=${this.filterSupplier.customId}`);
                }
            } else {
                extras.push(`data.subscriberId=${this.$store.state.app.user.id}`);
            }
            let url = "/drive/resources",
                params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.historicPath,
                    kind: "pimlog",
                    search: `${item.Sku}`,
                    extra: extras,
                    sort: "data.date.keyword",
                    order: "desc",
                    depth: 1,
                };
            return await this.$axios
                .get(url, {
                    params: params,
                })
                .then(data => {
                    // console.log('hits',data.data.hits.hits);
                    return data.data.hits.hits;
                });
        },
        async getProduct(item) {
            let extras = [];
            if (this.$isGranted("PIM_ADMIN")) {
                if (this.filterSupplier) {
                    extras.push(`data.SupplierId.keyword=${this.filterSupplier.customId}`);
                }
            } else {
                extras.push(`data.subscriberId=${this.$store.state.app.user.id}`);
            }
            let url = "/drive/resources",
                params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.productPath,
                    kind: this.$store.getters.config.brand.search.kind,
                    size: 10,
                    page: 1,
                    search: `${item.Sku}`,
                    extra: extras,
                };
            return await this.$axios
                .get(url, {
                    params: params,
                })
                .then(data => {
                    // console.log('hits',data.data.hits.hits);
                    let prodFound = null;
                    data.data.hits.hits.forEach(prod => {
                        if (prod._source.data.Name === item.Name) {
                            prodFound = prod;
                        }
                    });
                    return prodFound;
                });
        },
        setSupplierFilter() {
            if (typeof this.$route.query.filterSupplier === "object") {
                this.filterSupplier = this.$route.query.filterSupplier;
            }
        },
        previousModif() {
            this.recKey--;
            this.currentLog = this.recKey + 1;
            this.nameProduct = this.productLogs[this.recKey]._source.data.Name;
            this.logDate = this.productLogs[this.recKey]._source.data.date;
            let nextKey = this.recKey - 1;
            let nextPrevious = this.productLogs[nextKey];
            document.getElementById("modif-next").disabled = false;
            document.getElementById("modif-next").style.color = "white";
            if (!nextPrevious) {
                document.getElementById("modif-prev").disabled = true;
                document.getElementById("modif-prev").style.color = "gray";
            }

            this.renderJsonDiff(this.productLogs[this.recKey]._source.data.Info.Modification);
        },
        nextModif() {
            this.recKey++;
            this.currentLog = this.recKey + 1;
            this.nameProduct = this.productLogs[this.recKey]._source.data.Name;
            this.logDate = this.productLogs[this.recKey]._source.data.date;
            let nextKey = this.recKey + 1;
            let nextNext = this.productLogs[nextKey];
            document.getElementById("modif-prev").disabled = false;
            document.getElementById("modif-prev").style.color = "white";
            if (!nextNext) {
                document.getElementById("modif-next").disabled = true;
                document.getElementById("modif-next").style.color = "gray";
            }
            this.renderJsonDiff(this.productLogs[this.recKey]._source.data.Info.Modification);
        },
        renderJsonDiff(modif) {
            if (Object.keys(modif[0]).length === 0 || Object.keys(modif[1]).length === 0) {
                this.$toast.error("error-json");
                this.diffOldJson = {};
                this.diffNewJson = {};
            } else {
                this.diffOldJson = modif[0];
                this.diffNewJson = modif[1];
            }
        },
        list: Tools.debounce(function() {
            this.options.page = 1;
            this.searchParams.search = this.search;
            if (this.$isGranted("PIM_ADMIN")) {
                this.searchParams.filterSupplier = this.filterSupplier;
            }
            sessionStorage.setItem("su-search-params-logs", JSON.stringify(this.searchParams));
            return this.getRecordList();
        }),
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
    /*width: 100%;*/
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

.su-block-list {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    opacity: 1;
    padding: 15px 30px;
    overflow-x: auto;
}

.su-block-list-title {
    text-align: left;
    font: 24px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-results-label {
    text-align: right;
    font: Regular 13px/16px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
}

.su-results-total {
    text-align: right;
    font: Bold 15px/18px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #5faad9;
}

.su-results-header {
    text-align: left;
    font-family: SemiBold Montserrat, sans-serif;
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 0px;
    color: #023473;
    opacity: 1;
    min-width: 430px;
}

.su-results-text {
    font-family: Light Montserrat, sans-serif;
    font-size: 15px;
    letter-spacing: 0px;
    color: #023473;
    opacity: 1;
}

.su-results {
    text-align: left;
    max-height: 600px;
    min-width: 430px;
    overflow-y: auto;
    /*overflow-x: auto;*/
}

.su-modal-arrow {
    color: white;
    &:hover {
        color: gray;
    }
}
</style>

<i18n>
    {
        "fr": {
            "records": "Historique",
            "imports": "Imports : ",
            "filterbySupplier": "Filtrer par fournisseur :",
            "importdate": "Date de l'import",
            "errorMessage": "Une erreur est survenue. Veuillez réessayer ultérieurement.",
            "results": "Résultats : ",
            "recordslist": "Historique des imports",
            "provider": "Fournisseur",
            "ProductCode" : "Code produit",
            "product" : "Produit",
            "searchrecord" : "Chercher un produit",
            "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
        },
        "en": {
            "records": "Records",
            "imports": "Imports : ",
            "filterbySupplier": "Filter by supplier :",
            "importdate": "Import date",
            "errorMessage": "An error has occurred. Please try again.",
            "results": "Results : ",
            "recordslist": "Import records",
            "provider": "Supplier",
            "ProductCode" : "Product code",
            "product" : "Product",
            "searchrecord" : "Search for a product",
            "StartTypingNameOfAProvider": "Start typing the name of a provider"
        }
    }
</i18n>
