<template>
    <v-flex class="mx-sm-5 mx-0">
        <products
            v-if="categories.length > 0"
            :headers="headers"
            :search="search"
            :filterSelectStatut="filterSelectStatut"
            :filterSelectCategorie="filterSelectCategorie"
            :filterSupplier="filterSupplier"
            :sort="sort"
            :categories="categories"
            :onward="'-onward'"
        >
            <template v-slot:pageTitleIcon>fa fa-star</template>
            <template v-slot:pageTitle> {{ $t("onwardProduct") }} </template>
            <template v-slot:filters="productsProps">
                <v-col cols="12" lg="3" md="4" sm="6">
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
                <v-col cols="12" lg="2" md="2" sm="6">
                    <v-select
                        class="su-search-bar"
                        :label="$t('filterbyCategories')"
                        :items="filtersSelectCategorie"
                        v-model="filterSelectCategorie"
                        clearable
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="12" lg="2" md="3" sm="6">
                    <v-select
                        class="su-search-bar"
                        :label="$t('filterbyStatus')"
                        :items="filtersSelectStatut"
                        v-model="filterSelectStatut"
                        outlined
                        clearable
                    ></v-select>
                </v-col>
                <v-col cols="12" lg="3" md="3" sm="6">
                    <v-text-field
                        class="su-search-bar"
                        :label="$t('searchproduct')"
                        v-model="search"
                        outlined
                        background-color="white"
                        clearable
                    >
                    </v-text-field>
                </v-col>
            </template>
            <template v-slot:headersAction="productsProps">
                <span v-if="productsProps.item.metadata.starred" class="ml-lg-10">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                                color="primary"
                                size="21"
                                aria-hidden="true"
                                @click="onDialogFavorite(productsProps.item)"
                                >fa fa-star</v-icon
                            >
                        </template>
                        <span>{{ $t("deleteFavorite") }}</span>
                    </v-tooltip>
                </span>
                <span v-else class="ml-lg-10">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                                color="primary"
                                size="21"
                                aria-hidden="true"
                                @click="onDialogFavorite(productsProps.item)"
                                >far fa-star</v-icon
                            >
                        </template>
                        <span>{{ $t("addFavorite") }}</span>
                    </v-tooltip>
                </span>
            </template>
        </products>
        <v-row v-if="dialogFavorite.product.data" justify="center">
            <v-dialog v-model="dialogFavorite.show" persistent max-width="500px">
                <v-card>
                    <v-card-title class="headline d-block">
                        <div>{{ $t("editFavorit") }} :</div>
                        <div class="error--text text-subtitle-1">{{ dialogFavorite.product.data.Name }}</div>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col class="py-0" cols="12" sm="12">
                                <v-switch v-model="dialogFavorite.product.metadata.starred" @change="isFav" :label="$t('AddToFavorites')"></v-switch>
                            </v-col>
                            <!--                            <v-col cols="12">-->
                            <!--                                <div class="subtitle-2 primary&#45;&#45;text">{{ $t("Planning") }} :</div>-->
                            <!--                            </v-col>-->
                            <v-col class="py-0" cols="12" sm="6">
                                <v-menu
                                    ref="menustart"
                                    v-model="menustart"
                                    :close-on-content-click="false"
                                    :return-value.sync="dialogFavorite.product.metadata.startdate"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :class="[
                                                $v.dialogFavorite.product.metadata.startdate.$error ? 'shake-horizontal input_error' : '',
                                            ]"
                                            v-model="dialogFavorite.product.metadata.startdate"
                                            :label="$t('datestart')"
                                            readonly
                                            clearable
                                            v-on="on"
                                            outlined
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        ref="picker"
                                        @change="updateDStart"
                                        v-model="dialogFavorite.product.metadata.startdate"
                                        no-title
                                        scrollable
                                    >
                                    </v-date-picker>
                                </v-menu>
                                <div class="field_error_input" v-if="$v.dialogFavorite.product.metadata.startdate.$error">
                                    {{ $t("requiredfield") }}
                                </div>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <v-menu
                                    ref="menuend"
                                    v-model="menuend"
                                    :close-on-content-click="false"
                                    :return-value.sync="dialogFavorite.product.metadata.stopdate"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="dialogFavorite.product.metadata.stopdate"
                                            :label="$t('dateend')"
                                            readonly
                                            outlined
                                            clearable
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        ref="picker"
                                        :allowed-dates="allowedDates"
                                        @change="updateDEnd"
                                        v-model="dialogFavorite.product.metadata.stopdate"
                                        no-title
                                        scrollable
                                    >
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="closeDialog">{{ $t("close") }}</v-btn>
                        <div v-if="saveFavoriteLoader" class="container_loader ml-5">
                            <rotate-square2></rotate-square2>
                        </div>
                        <v-btn v-else class="" text @click="dialogFavoriteSave">{{ $t("save") }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-flex>
</template>

<script>
import Modal from "@/components/Core/Modal";
import Products from "@/components/Core/Products";
import { required, requiredIf, } from "vuelidate/lib/validators";
import * as _ from "lodash";
import { RotateSquare2, } from "vue-loading-spinner";
import SubscriberAutocomplete from "@/components/Core/Subscriber/SubscriberAutocomplete";

export default {
    name: "Onward",
    components: {
        Modal,
        Products,
        RotateSquare2,
        SubscriberAutocomplete,
    },
    data() {
        return {
            saveFavoriteLoader: false,
            isAdmin: false,
            filtersSelectStatut: [
                {
                    text: this.$t("ActiveProduct"),
                    value: "data.Enabled=true",
                },
                {
                    text: this.$t("ProductToComplete"),
                    value: "data.Status=0",
                },
            ],
            filterSelectStatut: "",
            filtersSelectCategorie: [],
            filterSelectCategorie: "",
            filtersSelectSupplier: [],
            filterSelectSupplier: "",
            providerSearchExtra: [
                {
                    id: "cf_Type",
                    type: "constant",
                    value: "Supplier",
                },
            ],
            sorts: [
                {
                    text: this.$t("name"),
                    value: "data.Name.keyword",
                },
                {
                    text: "sku",
                    value: "data.Sku.keyword",
                },
                {
                    text: "Categories",
                    value: "data.Categories.keyword",
                },
                {
                    text: this.$t("StartDate"),
                    value: "metadata.startdate",
                },
                {
                    text: this.$t("EndDate"),
                    value: "metadata.stopdate",
                },
                {
                    text: this.$t("favorites"),
                    value: "metadata.starred",
                },
            ],
            sort: "",
            search: "",
            menustart: false,
            menuend: false,
            tmpProduct: {},
            dialogFavorite: {
                show: false,
                product: {},
            },
            headers: [
                { text: this.$t("name"), value: "data.Name", type: "keyword", },
                { text: this.$t("ProductCode"), value: "data.Sku", type: "keyword", },
                { text: this.$t("Categories"), value: "data.Categories", type: "keyword", },
                { text: this.$t("ActiveProduct"), value: "data.Enabled", type: "", },
                { text: this.$t("Status"), value: "data.Status", type: "", },
                { text: this.$t("StartDate"), value: "metadata.startdate", type: "", },
                { text: this.$t("EndDate"), value: "metadata.stopdate", type: "", },
                { text: this.$t("favorites"), value: "metadata.starred", type: "", },
            ],
            filterSupplier: null,
            categories: [],
            searchParams: {
                search: "",
                filterSelectCategorie: undefined,
                filterSelectStatut: undefined,
                options:{}
            },
        };
    },
    validations: {
        dialogFavorite: {
            product: {
                metadata: {
                    startdate: {
                        required: requiredIf(function() {
                            return this.dialogFavorite.product.metadata.starred === true;
                        }),
                    },
                },
            },
        },
    },
    async created() {
        if (!this.$store.getters.supplierId()) {
            this.isAdmin = true;
        }

        let params = { params: {
                bucket: this.$store.getters.config.brand.drive.bucket,
                path: this.$store.getters.config.brand.extra.product.categories,
            }, cache: { maxAge: 3600, exclude: { query: false, }, }, };

        await this.$axios.get("/drive/s3/resource", params).then(resp => {
            this.categories = [...resp.data.enum];
            for (let categorie of this.categories) {
                this.filtersSelectCategorie.push({
                    text: categorie.text,
                    value: `data.Categories.keyword=${categorie.id}`,
                });
            }
        });

        if (sessionStorage["su-search-params-onward"]) {
            let copySearchParams = JSON.parse(sessionStorage.getItem("su-search-params-onward"));

            if (copySearchParams.search !== "") {
                this.search = copySearchParams.search;
            }
            if (copySearchParams.filterSupplier) {
                this.filterSupplier = copySearchParams.filterSupplier;
            }
            if (copySearchParams.filterSelectCategorie) {
                this.filterSelectCategorie = copySearchParams.filterSelectCategorie;
            }
            if (copySearchParams.filterSelectStatut) {
                this.filterSelectStatut = copySearchParams.filterSelectStatut;
            }
            if (copySearchParams.sort) {
                this.sort = copySearchParams.sort;
            }
        } else {
            if (this.$isGranted("PIM_ADMIN")) {
                this.searchParams.filterSupplier = null;
                this.searchParams.filterSelectActivity = undefined;
            }
            sessionStorage.setItem("su-search-params-onward",JSON.stringify(this.searchParams));
        }
    },
    methods: {
        closeDialog(){
            this.dialogFavorite.show = false;
            this.dialogFavorite.product.metadata.starred = this.tmpProduct.star;
            this.dialogFavorite.product.metadata.startdate = this.tmpProduct.start;
            this.dialogFavorite.product.metadata.stopdate = this.tmpProduct.end;
        },
        isFav(val) {
            if (!val) {
                this.dialogFavorite.product.metadata.startdate = null;
                this.dialogFavorite.product.metadata.stopdate = null;
            }
        },
        dialogFavoriteSave() {
            if (this.$v.$invalid) {
                this.$v.$touch();
                this.saveFavoriteLoader = false;
            } else {
                if(!this.dialogFavorite.product.metadata.starred && !this.tmpProduct.star) {
                    return this.$toast.error(this.$t("enableSwitch"));
                }
                this.saveFavoriteLoader = true;
                let url = `/pim/product/${this.dialogFavorite.product._id}`,
                    params = {
                        bucket: this.$store.getters.config.brand.drive.bucket,
                        path: this.$store.getters.config.brand.drive.productPath,
                        resourcePath: this.$store.getters.config.brand.drive.resourcePath,
                        resourcesDeleted: [],
                        data: this.dialogFavorite.product,
                    },
                    formData = new FormData();

                if(this.dialogFavorite.product.metadata.startdate > this.dialogFavorite.product.metadata.stopdate) {
                    this.saveFavoriteLoader = false;
                    return this.$toast.error(this.$t("error-message"));
                }

                formData.append("product", JSON.stringify(params));
                this.$axios
                    .post(url, formData)
                    .then(data => {
                        this.saveFavoriteLoader = false;
                        this.dialogFavorite.show = false;
                        this.$toast.success(this.$t("editedFavorite"));
                    })
                    .catch(err => {
                        this.saveFavoriteLoader = false;
                        console.log(err);
                        this.$toast.error(this.$t("error-message"));
                    });
            }
        },
        onDialogFavorite(product) {
            this.tmpProduct.start = product.metadata.startdate;
            this.tmpProduct.end = product.metadata.stopdate;
            this.tmpProduct.star = product.metadata.starred;
            this.dialogFavorite.show = !this.dialogFavorite.show;

            if (!product.metadata.startdate) {
                product.metadata.startdate = "";
            }
            if (!product.metadata.stopdate) {
                product.metadata.stopdate = "";
            }
            this.dialogFavorite.product = product;
            this.dialogFavorite.product.metadata = product.metadata;
        },
        updateDStart(date) {
            this.dialogFavorite.product.metadata.startdate = date;
            this.$refs.menustart.save(date);
        },
        updateDEnd(date) {
            this.dialogFavorite.product.metadata.stopdate = date;
            this.$refs.menuend.save(date);
        },
        allowedDates(val) {
            return new Date(val) >= new Date(this.dialogFavorite.product.metadata.startdate);
        }
    },
};
</script>
<i18n>
  {
  "fr": {
    "Planning" : "Planification",
    "AddToFavorites" : "Ajouter aux produits du moment",
    "StartDate" : "Date début",
    "EndDate" : "Date fin",
    "favorites" : "Produit du moment",
    "ProductCode" : "Code produit",
    "Categories" : "Catégories",
    "ProductToComplete" : "Produit à compléter",
    "ActiveProduct" : "Produit actif",
    "Status" : "Statut",
    "addFavorite" : "Ajouter aux produits du moment",
    "deleteFavorite" : "Supprimer des produits du moment",
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
    "incomplete": "Incomplète",
    "productlist": "Liste des produits",
    "close": "Fermer",
    "save": "Sauvegarder",
    "requiredfield": "Le champ est requis",
    "asc": "Croissant",
    "desc": "Décroissant",
    "datestart": "Date début d'affichage",
    "dateend": "Date fin d'affichage",
    "editFavorit": "Edition du produit du moment",
    "editedFavorite" : "Produit du moment édité",
    "filterbyStatus" : "Filtrer par statut",
    "filterbyCategories" : "Filtrer par categories",
    "enableSwitch": "Activer 'Ajouter aux produits du moment'",
    "provider": "Fournisseur",
    "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
  },
  "en": {
    "Planning" : "Planning",
    "AddToFavorites" : "Add to onward products",
    "StartDate" : "Start date",
    "EndDate" : "End date",
    "favorites" : "Product onward",
    "ProductCode" : "Product code",
    "Categories" : "Categories",
    "ProductToComplete" : "Product to complete",
    "Status" : "Status",
    "addFavorite" : "Add to onward products",
    "deleteFavorite" : "Delete from onward products",
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
    "incomplete": "Incomplete",
    "productlist": "Product list",
    "close" : "Close",
    "save": "Save",
    "requiredfield": "This field is required",
    "asc": "Ascending",
    "desc": "Descending",
    "datestart": "Posting start date",
    "dateend": "Posting end date",
    "editFavorit": "Edit onward product",
    "editedFavorite" : "Onward product has been edited ",
    "filterbyStatus" : "Filter by status",
    "filterbyCategories" : "Filter by categories",
    "enableSwitch": "Enable 'Add to onward products'",
    "provider": "Provider",
    "StartTypingNameOfAProvider": "Start typing the name of a provider"
  }
  }
</i18n>
