<template>
    <v-flex class="mx-sm-5 mx-0">
        <products
            v-if="categories.length > 0"
            :headers="headers"
            :search="search"
            :filter="filter"
            :filterSupplier="filterSupplier"
            :filterSelectStatut="filterSelectStatut"
            :filterSelectActivity="filterSelectActivity"
            :filterSelectCategorie="filterSelectCategorie"
            :filterSelectImages="filterSelectImages"
            :sort="sort"
            :categories="categories"
            :onward="''"
        >
            <template v-slot:pageTitleIcon>fa fa-file-alt</template>
            <template v-slot:pageTitle> {{ $t("productsheet") }} </template>
            <template v-slot:filters="productsProps">
                <v-col v-if="$isGranted('PIM_ADMIN')" cols="12" lg="3" md="4" sm="6">
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
                <v-col cols="12" lg="2" md="4" sm="6">
                    <v-select
                        class="su-search-bar"
                        :label="$t('filterbyCategories')"
                        :items="filtersSelectCategorie"
                        v-model="filterSelectCategorie"
                        clearable
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="12" lg="1" md="4" sm="6">
                    <v-select
                        class="su-search-bar"
                        :label="$t('filterbyImages')"
                        :items="filtersSelectImages"
                        v-model="filterSelectImages"
                        clearable
                        outlined
                    ></v-select>
                </v-col>
                <v-col v-if="$isGranted('PIM_ADMIN')" cols="12" lg="2" md="4" sm="6">
                    <v-select
                            class="su-search-bar"
                            :label="$t('filterbyActivity')"
                            :items="filtersSelectActivity"
                            v-model="filterSelectActivity"
                            clearable
                            outlined
                    ></v-select>
                </v-col>
                <v-col cols="12" lg="2" md="4" sm="6">
                    <v-select
                            class="su-search-bar"
                            :label="$t('filterbyStatus')"
                            :items="filtersSelectStatut"
                            v-model="filterSelectStatut"
                            outlined
                            clearable
                    ></v-select>
                </v-col>
                <v-col cols="12" lg="2" md="8">
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
            <template v-slot:productName="productsProps">
                <router-link
                    style="height:0;"
                    :value="productsProps.item"
                    v-if="productsProps.isGranted('PIM_PRODUCT_U')"
                    :to="{
                        name: 'product-detail',
                        query: {
                            product: productsProps.item,
                            filter: filter,
                            filterSelectStatut: filterSelectStatut,
                            filterSelectCategorie: filterSelectCategorie,
                            sort: sort,
                        },
                    }"
                    >{{ productsProps.item.data.Name }}</router-link
                >
            </template>
            <template v-slot:headersAction="productsProps">
                <router-link
                    style="height:0;"
                    :value="productsProps.item"
                    v-if="productsProps.isGranted('PIM_PRODUCT_U')"
                    :to="{
                        name: 'product-detail',
                        query: {
                            product: productsProps.item,
                            filter: filter,
                            filterSelectStatut: filterSelectStatut,
                            filterSelectCategorie: filterSelectCategorie,
                            sort: sort,
                        },
                    }"
                    ><v-icon class="su-action-icon" color="white" size="19">fas fa-edit</v-icon></router-link
                >
                <v-icon
                    v-if="productsProps.isGranted('PIM_PRODUCT_D')"
                    class="su-action-icon ml-5"
                    color="white"
                    size="19"
                    @click="onDialogDeleteProduct(productsProps.item)"
                    >fas fa-trash</v-icon
                >
            </template>
        </products>
        <v-dialog v-if="dialogDeleteProduct.product.data" v-model="dialogDeleteProduct.show" max-width="500">
            <v-card>
                <v-card-title class="headline"
                    ><div>{{ $t("DoYouWantToDeleteTheProduct") }}</div>
                    :
                    <div class="error--text text-subtitle-1">{{ dialogDeleteProduct.product.data.Name }}</div>
                </v-card-title>

                <v-card-text> </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn class="primary--text" text @click="dialogDeleteProduct.show = false">
                        {{ $t("Cancel") }}
                    </v-btn>

                    <v-btn class="error--text" text @click="deleteProduct">
                        {{ $t("Delete") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
import Products from "@/components/Core/Products";
import Tools from "@/utils/Tools";
import SubscriberAutocomplete from "@/components/Core/Subscriber/SubscriberAutocomplete";
import * as _ from "lodash";
export default {

    name: "ProductsFiles",
    components: {
        Products,
        SubscriberAutocomplete,
    },
    data() {
        return {
            dialogDeleteProduct: {
                show: false,
                product: {},
            },
            search: "",
            sorts: [
                {
                    text: this.$t("name"),
                    value: "data.Name.keyword",
                },
                {
                    text: "sku",
                    value: "data.Sku",
                },
                {
                    text: "Categories",
                    value: "data.Categories.keyword",
                },
            ],
            filter: "",
            filtersSelectStatut: [
                {
                    text: this.$t("ProductComplete"),
                    value: "data.Status=1",
                },
                {
                    text: this.$t("ProductToComplete"),
                    value: "data.Status=0",
                },
            ],
            filtersSelectActivity: [
                {
                    text: this.$t("ActiveProduct"),
                    value: "data.Enabled=true",
                },
                {
                    text: this.$t("DisabledProduct"),
                    value: "data.Enabled=false",
                },
            ],
            filtersSelectImages: [
                {
                    text: this.$t("Yes"),
                    value: "data.HasImages=true",
                },
                {
                    text: this.$t("No"),
                    value: "data.HasImages=false",
                },
            ],
            filterSelectActivity: "",
            filterSelectStatut: "",
            filterSelectImages: "",
            filtersSelectCategorie: [],
            filterSelectCategorie: "",
            filterSupplier: null,
            sort: "",
            orders: [
                {
                    text: this.$t("asc"),
                    value: "asc",
                },
                {
                    text: this.$t("desc"),
                    value: "desc",
                },
            ],
            categories: [],
            order: "asc",
            searchParams: {
                search: "",
                filterSelectCategorie: undefined,
                filterSelectStatut: undefined,
                options: {}
            },
            headers: [
                { text: this.$t("name"), value: "data.Name", type: "keyword", },
                { text: this.$t("ProductCode"), value: "data.Sku", type: "keyword", },
                { text: this.$t("Categories"), value: "data.Categories", type: "keyword", },
                { text: this.$t("Images"), value: "data.HasImages", type: "", },
                { text: this.$t("ActiveProduct"), value: "data.Enabled", type: "", },
                { text: this.$t("Status"), value: "data.Status", type: "", },
                { text: "Actions", value: "data.actions", sortable: false, },
            ],
        };
    },
    watch: {},
    async created () {
        if (typeof this.$route.query.filterSupplier === "object") {
            this.filterSupplier = this.$route.query.filterSupplier;
        }
        this.filterSelectStatut = this.$route.query.filterSelectStatut;
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

        if (sessionStorage["su-search-params"]) {
            let copySearchParams = JSON.parse(sessionStorage.getItem("su-search-params"));
            if (copySearchParams.search !== "") {
                this.search = copySearchParams.search;
            }
            if (copySearchParams.filterSupplier) {
                this.filterSupplier = copySearchParams.filterSupplier;
            }
            if (copySearchParams.filterSelectCategorie) {
                this.filterSelectCategorie = copySearchParams.filterSelectCategorie;
            }
            if (copySearchParams.filterSelectActivity) {
                this.filterSelectActivity = copySearchParams.filterSelectActivity;
            }
            if (copySearchParams.filterSelectStatut) {
                this.filterSelectStatut = copySearchParams.filterSelectStatut;
            }
            if (copySearchParams.options) {
                this.options = copySearchParams.options;
            }
            if (copySearchParams.filterSelectImages) {
                this.filterSelectImages = copySearchParams.filterSelectImages;
            }
        } else {
            if (this.$isGranted("PIM_ADMIN")) {
                this.searchParams.filterSupplier = null;
                this.filterSelectActivity = "data.Enabled=true";
            }
            this.filterSelectStatut = "data.Status=1";
            sessionStorage.setItem("su-search-params",JSON.stringify(this.searchParams));
        }
    },
    methods: {
        onDialogDeleteProduct(product) {
            this.dialogDeleteProduct = { show: true, product: product, };
        },
        deleteProduct() {
            let url = `/pim/product/${this.dialogDeleteProduct.product._id}`,
                params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.productPath,
                    resourcePath: this.$store.getters.config.brand.drive.resourcePath,
                    resourcesDeleted: this.resourcesDeleted,
                    data: [],
                },
                formData = new FormData();

            formData.append("product", JSON.stringify(params));

            this.$axios
                .post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    this.$toast.success(this.$t("saveMessage"));
                })
                .catch(err => {
                    this.$toast.error(this.$t("errorMessage"));
                    console.log(err);
                });
        },
    },
};
</script>
<i18n>
    {
    "fr": {
        "Delete" : "Supprimer",
        "Cancel" : "Annuler",
        "DoYouWantToDeleteTheProduct" : "Voulez-vous supprimer le produit",
        "ProductCode" : "Code produit",
        "Categories" : "Catégories",
        "ProductToComplete" : "A compléter",
        "ProductComplete" : "Complète",
        "ActiveProduct" : "Activé",
        "DisabledProduct" : "Désactivé",
        "Status" : "Statut",
        "productsheet": "Fiches produits",
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
        "productlist": "Liste des produits",
        "asc": "Croissant",
        "desc": "Décroissant",
        "filterbyStatus" : "Statut",
        "filterbyActivity" : "Produit actif",
        "filterbyCategories" : "Catégories",
        "filterbyImages": "Images",
        "Images": "Images",
        "NoImages": "Pas d'images",
        "provider": "Fournisseur",
        "Yes": "Oui",
        "No": "Non",
        "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
    },
    "en": {
        "Delete" : "Delete",
        "Cancel" : "Cancel",
        "DoYouWantToDeleteTheProduct" : "DoYouWantToDeleteTheProduct",
        "ProductCode" : "Product code",
        "Categories" : "Categories",
        "ProductToComplete" : "Complete",
        "ProductComplete" : "Incomplete",
        "Status" : "Status",
        "ActiveProduct" : "Active",
        "DisabledProduct" : "Disabled",
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
        "asc": "Ascending",
        "desc": "Descending",
        "filterbyStatus" : "Status",
        "filterbyActivity" : "Active product",
        "filterbyCategories" : "Categories",
        "filterbyImages": "Images",
        "Images": "Images",
        "NoImages": "No images",
        "provider": "Provider",
        "Yes": "Yes",
        "No": "No",
        "StartTypingNameOfAProvider": "Start typing the name of a provider"
    }
    }
</i18n>
