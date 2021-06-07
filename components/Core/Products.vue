<template>
    <v-flex class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-inline-flex">
                <v-icon class="su-title-icon" color="white">
                    <slot name="pageTitleIcon">fa fa-file-alt</slot>
                </v-icon>
                <span class="su-title">
                    <slot name="pageTitle"> </slot>
                </span>
            </v-col>
        </v-row>
        <v-row>
            <slot name="filters"> </slot>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div class="py-0">
                    <div class="su-results" id="listProduct">
                        <v-data-table
                            fixed-header
                            height="calc(100vh - 310px)"
                            style="overflow: auto"
                            class="elevation-3"
                            :loading="loading"
                            :headers="headers"
                            :items="products"
                            :options.sync="options"
                            :server-items-length="totalProducts"
                            :footer-props="{ itemsPerPageOptions: [10, 30, 50] }"
                        >
                            <!--                            <template v-slot:item.data.Name="{ item }">-->
                            <!--                                <slot name="productName" v-bind:isGranted="isGranted" v-bind:item="item"> </slot>-->
                            <!--                            </template>-->
                            <template v-slot:item.data.HasImages="{ item }">
                                <v-icon v-if="item.data.HasImages" size="23" color="green">fas fa-check</v-icon>
                                <v-icon v-else size="23" color="red">fas fa-times</v-icon>
                            </template>
                            <template v-slot:item.data.Categories="{ item }">
                              {{ getCategoryLabel(item.data.Categories) }}
                            </template>
                            <template v-slot:item.data.Enabled="{ item }">
                                <v-chip v-if="item.data.Enabled" :color="getColor(item.data.Enabled)" class="su-status-label">{{
                                    $t("Enabled")
                                }}</v-chip>
                                <v-chip v-else :color="getColor(item.data.Enabled)" class="su-status-label">{{ $t("Disabled") }}</v-chip>
                            </template>
                            <template v-slot:item.data.Status="{ item }">
                                <v-chip v-if="item.data.Status" :color="getColor(item.data.Status)" class="su-status-label">{{
                                    $t("complete")
                                }}</v-chip>
                                <v-chip v-else :color="getColor(item.data.Status)" class="su-status-label">{{ $t("incomplete") }}</v-chip>
                            </template>
                            <template v-slot:item.metadata.starred="{ item }">
                                <slot name="headersAction" v-bind:isGranted="isGranted" v-bind:item="item"> </slot>
                            </template>
                            <template v-slot:item.data.actions="{ item }">
                                <slot name="headersAction" v-bind:isGranted="isGranted" v-bind:item="item"> </slot>
                            </template>

                            <!--                            <template v-slot:footer="{ props }">-->
                            <!--                                <v-pagination v-model="currentPage" total-visible="10" :length="props.pagination.pageCount"></v-pagination>-->
                            <!--                            </template>-->
                        </v-data-table>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-flex>
</template>

<script>
import Tools from "@/utils/Tools";

export default {
    name: "Products",
    data: function() {
        return {
            filter: "",
            totalProducts: 0,
            // currentPage: 1,
            options: {},
            loading: true,
            products: [],
            searchParams: {
                search: "",
                filterSelectCategorie: undefined,
                filterSelectStatut: undefined,
            },
            categoriesMap : {}
        };
    },
    props: {
        headers: {
            type: Array,
        },
        search: {
            type: String,
        },
        sorts: {
            type: Array,
        },
        sort: {
            type: String,
        },
        orders: {
            type: Array,
        },
        order: {
            type: String,
        },
        filterSelectStatut: {
            type: String,
        },
        filterSelectActivity: {
            type: String,
        },
        filterSelectCategorie: {
            type: String,
        },
        filterSelectImages: {
            type: String,
        },
        filterSupplier: {
            type: Object,
        },
        categories: {
            type: Array,
        },
        onward: {
            type: String,
        },
    },
    watch: {
        search: "list",
        sort: "list",
        order: "list",
        filterSelectStatut: "list",
        filterSelectActivity: "list",
        filterSelectCategorie: "list",
        filterSelectImages: "list",
        filterSupplier: "list",
        options: {
            handler: Tools.debounce(function(val) {
                this.searchParams.options = val;
                sessionStorage.setItem("su-search-params"+this.onward,JSON.stringify(this.searchParams));
                this.getProducts();
            }),
            deep: true,
        },
    },
    created() {
        if (sessionStorage["su-search-params"]) {
            let copySearchParams = JSON.parse(sessionStorage.getItem("su-search-params"));
            if (copySearchParams.options) {
                this.options = copySearchParams.options;
            }
        }
    },
    mounted() {
        if (this.$route.query.filter) {
            this.filter = this.$route.query.filter;
        }

        for (let cat of this.categories) {
            this.categoriesMap[cat.id] = cat.text;
        }

    },
    methods: {
        list: Tools.debounce(function() {
            this.options.page = 1;
            this.searchParams.search = this.search;
            this.searchParams.filterSelectCategorie = this.filterSelectCategorie;
            this.searchParams.filterSelectStatut = this.filterSelectStatut;
            this.searchParams.filterSelectImages = this.filterSelectImages;
            if (this.$isGranted("PIM_ADMIN")) {
                this.searchParams.filterSupplier = this.filterSupplier;
                this.searchParams.filterSelectActivity = this.filterSelectActivity;
            }
            sessionStorage.setItem("su-search-params"+this.onward,JSON.stringify(this.searchParams));

            return this.getProducts();
        }),
        getCategoryLabel(categories) {
            let cats = [];
            for (let cat of categories) {
              cats.push(this.categoriesMap[cat]);
            }

            return cats.join(',');
        },
        getSortType(sortBy) {
            let type = "";
            this.headers.forEach(header => {
                if (header.value === sortBy && header.type !== "") {
                    type = `.${header.type}`;
                }
            });
            return type;
        },
        async getProducts() {
            const { sortBy, sortDesc, page, itemsPerPage } = this.options;

            let supplierId = this.$store.getters.supplierId(),
                isAdmin = this.$isGranted("PIM_ADMIN"),
                customField = this.$store.getters.config.brand.extra.SupplierId,
                url = `/drive/resources`,
                params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.productPath,
                    kind: this.$store.getters.config.brand.search.kind,
                };
            params["extra"] = this.addExtraParams(params, supplierId, customField, isAdmin);

            if (this.search) {
                params["search"] = this.search;
            }

            params["sort"] = this.sort + this.getSortType(this.sort);
            params["order"] = this.order;
            params.size = itemsPerPage;
            params.page = page;
            if (sortBy.length === 1 && sortDesc.length === 1) {
                params["sort"] = sortBy + this.getSortType(sortBy[0]);
                sortDesc[0] === false ? (params["order"] = "asc") : (params["order"] = "desc");
            }
            // console.log("axios params", params);
            return await this.$axios
                .get(url, {
                    params: params,
                })
                .then(data => {
                    const products = [];

                    if (data.data.hits.hits) {
                        data.data.hits.hits.forEach((product) => {
                            product["_source"]["_id"] = product["_id"];
                            products.push(product["_source"]);
                        });

                        this.totalProducts = data.data.hits.total.value;
                        this.products = products;
                    }
                    this.loading = false;
                })
                .catch(err => {
                    console.error(err);
                });
        },
        addExtraParams(params, supplierId, customField, isAdmin) {
            let extras = [];

            if (this.filter) {
                extras.push(`${this.filter}`);
            }
            if (this.filterSelectCategorie) {
                extras.push(`${this.filterSelectCategorie}`);
            }
            if (this.filterSelectStatut) {
                extras.push(`${this.filterSelectStatut}`);
            }
            if (this.filterSelectImages) {
                extras.push(`${this.filterSelectImages}`);
            }

            if (isAdmin) {
                if (this.filterSelectActivity) {
                    extras.push(this.filterSelectActivity);
                }
                if (this.filterSupplier) {
                    extras.push(`data.${customField}.keyword=${this.filterSupplier.customId}`);
                }
            } else {
                extras.push(`data.${customField}.keyword=${this.$store.getters.supplierId()}`);
                extras.push("data.Enabled=true");
            }

            return extras.join(" AND ");
        },

        isGranted(role) {
            return this.$store.getters.isGranted(role);
        },
        getColor(enabled) {
            if (enabled) return "green";
            else return "red";
        },
    },
};
</script>
<style scoped lang="scss">
#listProduct {
    .v-data-table__wrapper {
        height: calc(100vh - 430px);
        overflow: auto;
    }
}
.clear {
    clear: both;
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

.su-search-bar {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    border-radius: 10px;
    opacity: 1;
    /*width: 100%;*/
    max-height: 56px;
}

.su-search-bar-icon {
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    margin-bottom: 2px;
}

.su-block-list {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    opacity: 1;
    padding: 15px 30px;
    /*height: calc(100vh - 260px);*/
    /*overflow-x: hidden;*/
    /*overflow: auto;*/
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
    /*max-height: 600px;*/
    /*overflow-y: auto;*/
    /*overflow-x: hidden;*/
    /*max-height: calc(100vh - 450px);*/
}

.su-edit-btn {
    border-radius: 7px;
    opacity: 1;
    color: #011c40;
    letter-spacing: 0px;
    font-family: Medium Montserrat, sans-serif;
    font-size: 12px;
}

.su-status-ok {
    background: #6e9f58 0% 0% no-repeat padding-box;
    border-radius: 7px;
    opacity: 1;
    width: 90px;
    height: 30px;
    text-align: center;
    padding-top: 3px;
}

.su-status-ko {
    background: #bc485a 0% 0% no-repeat padding-box;
    border-radius: 7px;
    opacity: 1;
    width: 90px;
    height: 30px;
    text-align: center;
    padding-top: 3px;
}

.su-status-label {
    /*text-align: left;*/
    font-family: Bold Montserrat, sans-serif;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
}
</style>
<i18n>
    {
    "fr": {
    "Enabled" : "Activé",
    "Disabled" : "Désactivé",
    "onwardProduct": "Produits du moment",
    "productsheet": "Fiche produits",
    "searchproduct": "Chercher un produit",
    "filterby": "Filtrer par",
    "orderby": "Trier par ordre",
    "results": "Résultats : ",
    "name": "Nom du produit",
    "code": "Code produit",
    "category": "Catégorie",
    "status": "Statut fiche",
    "editsheet": "Editer la fiche",
    "complete": "Complète",
    "incomplete": "A compléter",
    "requiredfield": "Le champ est requis",
    "productlist": "Liste des produits",
    "asc": "Croissant",
    "desc": "Décroissant",
    "datestart": "Date début d'affichage",
    "dateend": "Date fin d'affichage"
    },
    "en": {
    "Enabled" : "Enabled",
    "Disabled" : "Disabled",
    "onwardProduct": "Onward products",
    "productsheet": "Product sheet",
    "searchproduct": "Search a product :",
    "filterby": "Filter by",
    "orderby": "Order by",
    "results": "Results : ",
    "name": "Product name",
    "code": "Product code",
    "category": "Category",
    "status": "Sheet status",
    "editsheet": "Edit sheet",
    "complete": "Complete",
    "incomplete": "incomplete",
    "requiredfield": "the field is require",
    "productlist": "Product list",
    "asc": "Ascending",
    "desc": "Descending",
    "datestart": "Posting start date",
    "dateend": "Posting end date"
    }
    }
</i18n>
