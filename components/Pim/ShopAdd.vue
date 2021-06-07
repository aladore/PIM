<template>
    <v-flex class="mx-sm-5 mx-1">
        <v-row>
            <v-col cols="12" md="5" lg="6" class="d-flex align-center">
                <v-icon class="su-title-icon" color="white">fa fa-shopping-cart</v-icon>
                <span class="su-title" v-t="'shops'"></span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-end">
                <v-text-field
                    class="su-search-bar mr-5"
                    :label="$t('searchshop')"
                    v-model="search"
                    outlined
                    background-color="white"
                    clearable
                >
                </v-text-field>
                <v-btn class="su-btn-light float-right d-flex justify-space-around" @click="addShop">
                    <v-icon class="icon icon_default" size="15">fa fa-plus</v-icon>
                    <template v-if="!$isMobile">
                        {{ $t("shopAdd") }}
                    </template>
                </v-btn>
            </v-col>
        </v-row>
        <div class="su-import-block-white py-5 px-1 pr-sm-5">
            <div class="wrapper-sliders">
                <draggable
                    v-model="shops"
                    :scroll-sensitivity="300"
                    :force-fallback="true"
                    ghost-class="ghost"
                    handle=".icon_handle"
                    group="shops"
                    :animation="200"
                >
                    <template v-for="(shop, index) in searchShops">
                        <v-lazy :key="index" min-height="200">
                            <shop-block
                                ref="childShops"
                                :number="index"
                                :shop="shop"
                                v-model="shops"
                                v-on:remove="removeShop"
                                @update="update"
                                @removeImg="removeImg($event, index)"
                            >
                            </shop-block>
                        </v-lazy>
                    </template>
                </draggable>
            </div>
        </div>
        <v-dialog v-model="dialogDeleteShop.show" max-width="500">
            <v-card>
                <v-card-title class="headline"
                    ><div>{{ $t("delete_shop") }}</div>
                    :
                </v-card-title>
                <div class="error--text text-subtitle-1 ml-6">{{ dialogDeleteShop.shop.label }}</div>

                <v-card-text> </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn class="primary--text" text @click="dialogDeleteShop.show = false">
                        {{ $t("cancel") }}
                    </v-btn>

                    <v-btn class="error--text" text @click="deleteShop(dialogDeleteShop)">
                        {{ $t("delete") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
import draggable from "vuedraggable";
import { RotateSquare2, } from "vue-loading-spinner";
import ShopBlock from "@/components/Core/ShopBlock";
import Tools from "@/utils/Tools";

export default {
    name: "ShopAdd",
    components: { draggable, RotateSquare2, ShopBlock, },
    data() {
        return {
            dialogDeleteShop: {
                show: false,
                shop: {},
            },
            imports: [],
            shops: [
                {
                    id: 1,
                    code: "",
                    label: "",
                    opened: {
                        monday: [null, null, null, null],
                        tuesday: [null, null, null, null],
                        wednesday: [null, null, null, null],
                        thursday: [null, null, null, null],
                        friday: [null, null, null, null],
                        saturday: [null, null, null, null],
                        sunday: [null, null, null, null,],
                    },
                    telephone: "",
                    email: "",
                    fax: "",
                    comment: "",
                    address1: "",
                    address2: "",
                    zipcode: "",
                    city: "",
                    latitude: "",
                    longitude: "",
                    images: [],
                },
            ],
            newShop: {
                code: "",
                label: "",
                opened: {
                    monday: [null, null, null, null],
                    tuesday: [null, null, null, null],
                    wednesday: [null, null, null, null],
                    thursday: [null, null, null, null],
                    friday: [null, null, null, null],
                    saturday: [null, null, null, null],
                    sunday: [null, null, null, null,],
                },
                telephone: "",
                email: "",
                fax: "",
                comment: "",
                address1: "",
                address2: "",
                zipcode: "",
                city: "",
                latitude: "",
                longitude: "",
                images: [],
            },
            monday0: false,
            monday1: false,
            monday2: false,
            monday3: false,
            tuesday0: false,
            tuesday1: false,
            tuesday2: false,
            tuesday3: false,
            wednesday0: false,
            wednesday1: false,
            wednesday2: false,
            wednesday3: false,
            thursday0: false,
            thursday1: false,
            thursday2: false,
            thursday3: false,
            friday0: false,
            friday1: false,
            friday2: false,
            friday3: false,
            saturday0: false,
            saturday1: false,
            saturday2: false,
            saturday3: false,
            sunday0: false,
            sunday1: false,
            sunday2: false,
            sunday3: false,
            saveLoader: false,
            imgData: [],
            dragImg: false,
            search: "",
        };
    },
    mounted() {
        this.getShops();
    },
    computed: {
        searchShops: function() {
            let shopsFilter = this.shops,
                search = this.search;

            if (!search) {
                return shopsFilter;
            }

            search = search.trim().toLowerCase();
            shopsFilter = shopsFilter.filter(function(item) {
                if (item.label.toLowerCase().indexOf(search) !== -1) {
                    return item;
                }
            });

            return shopsFilter;
        },
    },
    methods: {
        async getShops() {
            this.saveLoader = true;

            let ecomApi = this.$store.getters.config.brand.ecom.api;
            await this.$axios
                .get("/proxy", {
                    cache: { ignoreCache: true },
                    headers: {
                        "x-su-proxyrest-url": ecomApi + "/address/shop",
                    },
                })
                .then(data => {
                    this.saveLoader = false;
                    if (Object.entries(data.data.message).length === 0) {
                        this.shops.push(this.newShop);
                    } else {
                        // console.log("SHOPS GET OK : ", data.data.message);
                        this.shops = [];
                        data.data.message.forEach(shop => {
                            let opened = shop.info.opened,
                                shopTmp = {
                                    code: shop.code,
                                    label: shop.label,
                                    opened: {
                                        monday: [opened.monday[0], opened.monday[1], opened.monday[2], opened.monday[3]],
                                        tuesday: [opened.tuesday[0], opened.tuesday[1], opened.tuesday[2], opened.tuesday[3]],
                                        wednesday: [opened.wednesday[0], opened.wednesday[1], opened.wednesday[2], opened.wednesday[3]],
                                        thursday: [opened.thursday[0], opened.thursday[1], opened.thursday[2], opened.thursday[3]],
                                        friday: [opened.friday[0], opened.friday[1], opened.friday[2], opened.friday[3]],
                                        saturday: [opened.saturday[0], opened.saturday[1], opened.saturday[2], opened.saturday[3]],
                                        sunday: [opened.sunday[0], opened.sunday[1], opened.sunday[2], opened.sunday[3],],
                                    },
                                    telephone: shop.telephone,
                                    email: shop.email,
                                    fax: shop.fax,
                                    comment: shop.comment,
                                    address1: shop.address1,
                                    address2: shop.address2,
                                    zipcode: shop.zipcode,
                                    city: shop.city,
                                    latitude: shop.latitude,
                                    longitude: shop.longitude,
                                    images: shop.info.images || [],
                                };
                            this.shops.push(shopTmp);
                        });
                    }
                })
                .catch(err => {
                    this.saveLoader = false;
                    console.log(err);
                });
        },
        addShop() {
            this.shops.push({
                id: this.shops.reduce((prev, current) => (+prev.id > +current.id ? prev : current)).id + 1,
                code: "",
                label: "",
                opened: {
                    monday: [null, null, null, null],
                    tuesday: [null, null, null, null],
                    wednesday: [null, null, null, null],
                    thursday: [null, null, null, null],
                    friday: [null, null, null, null],
                    saturday: [null, null, null, null],
                    sunday: [null, null, null, null,],
                },
                telephone: "",
                email: "",
                fax: "",
                comment: "",
                address1: "",
                address2: "",
                zipcode: "",
                city: "",
                latitude: "",
                longitude: "",
                images: [],
            });
            setTimeout(
                () => document.querySelector(".wrapper-service:last-child").scrollIntoView({ block: "start", behavior: "smooth", }),
                100,
            );
        },
        removeShop(event) {
            this.dialogDeleteShop = { show: true, shop: event.shop, id: event.id, };
        },
        deleteShop(dialog) {
            this.dialogDeleteShop.show = false;

            let ecomApi = this.$store.getters.config.brand.ecom.api;
            console.log("delete code", dialog.shop.code);
            this.$axios
                .delete("/proxy", {
                    headers: {
                        "x-su-proxyrest-url": ecomApi + "/address/shop?code=" + dialog.shop.code,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(data => {
                    console.log(data);
                    this.shops.splice(dialog.id, 1);
                });
        },
        cancel() {
            this.$refs.childShops.reset();
            this.imgData = [];
            this.newShop.images = [];
        },
        dragDropImg(e) {
            let files = e.dataTransfer.files,
                evtCopy = JSON.parse(JSON.stringify(e));
            files.forEach(file => {
                this.newShop.images.push(file);
            });
            this.dragImg = false;
            evtCopy.target = {};
            evtCopy.target.files = files;
            this.previewImage(evtCopy);
        },
        updateImg(event) {
            this.newShop.images.push(event.target.files[event.target.files.length - 1]);
        },
        previewImage(event) {
            let input = event.target;
            if (input.files && input.files[0]) {
                input.files.forEach(file => {
                    let reader = new FileReader();
                    reader.onload = e => {
                        console.log(e.target);
                        this.imgData.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });
            }
        },
        removeImg(key) {
            this.imgData.splice(key, 1);
            console.log("remove img");
        },
        removeResourcesImgFile(img) {
            this.newShop.images = this.newShop.images.filter(item => {
                return item !== img;
            });
            // this.resourcesDeleted.images.push(img);
        },
        update(id, shop) {
            this.shops[id] = shop;
        },
    },
};
</script>

<style scoped lang="scss">
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

.su-import-block-white {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    opacity: 1;
    padding-top: 0px;
    /*padding-left: 30px;*/
    /*padding-right: 30px;*/
    border-radius: 3px;
    /*min-height: 100%;*/
}

.wrapper-sliders {
    overflow: auto;
    max-height: calc(100vh - 310px);
    min-height: 310px;
    overflow-x: hidden;
    /*overflow-y: hidden;*/
    .container_loader {
        min-height: 200px;
    }
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

.su-text-field {
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 10px;
}

.su-btn-light {
    text-align: left;
    font: Medium 12px/34px Montserrat;
    letter-spacing: 0px;
    color: #011c40;
    border-radius: 7px;
    opacity: 1;
}

.su-btn-dark {
    text-align: left;
    font: Medium 12px/34px Montserrat;
    letter-spacing: 0px;
    color: #ffffff;
    border-radius: 7px;
    opacity: 1;
}

.su-block-import-img {
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
    height: 80%;
    max-height: 500px;
    /*min-height: 400px;*/
    display: flex;
    align-items: center;
}

.su-block-import-img-icon {
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
    width: 36px;
    height: 36px;
    border-radius: 50%;
}

.su-import-img-btn {
    background: #a2d4f2 0% 0% no-repeat padding-box;
    border-radius: 7px;
    opacity: 1;
    color: #011c40;
    margin-bottom: 20px;
    /*padding: 12px 35px!important;*/
}

.su-col-import-img {
    min-height: 100%;
}

.su-img-import-icon {
    opacity: 1;
    color: #ffffff;
    cursor: pointer;
    position: relative;
    top: 0px;
}

.su-img-import-icon-drag {
    color: #757575;
    opacity: 1;
    cursor: pointer;
    position: relative;
    top: 0px;
}
.su-small-img {
    margin: 10px;
    width: 99px;
    height: 96px;
    border: 1px solid #023473;
    opacity: 1;
}
.su-label {
    text-align: center;
    font: Bold 14px/18px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #023473;
    opacity: 1;
}

.su-search-bar {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    border-radius: 10px;
    opacity: 1;
    /*width: 100%;*/
    max-height: 56px;
}
</style>

<i18n>
    {
    "fr": {
    "shopAdd": "Ajouter un magasin",
    "shops": "Magasins",
    "timeOpenM": "Horaire ouverture matin",
    "timeCloseM": "Horaire fermeture matin",
    "timeOpenE": "Horaire ouverture après-midi",
    "timeCloseE": "Horaire fermeture après-midi",
    "label": "Libellé",
    "telephone": "Téléphone",
    "email": "Email",
    "fax": "Fax",
    "address1": "Adresse 1",
    "address2": "Adresse 2",
    "zipcode": "Code postal",
    "city": "Ville",
    "required": "Champs requis",
    "invalidEmail": "Email n'est pas valid",
    "code": "Code",
    "monday": "Lundi",
    "tuesday": "Mardi",
    "wednesday": "Mercredi",
    "thursday": "Jeudi",
    "friday": "Vendredi",
    "saturday": "Samedi",
    "sunday": "Dimanche",
    "searchshop": "Chercher un magasin",
    "delete_shop" : "Voulez-vous supprimer le magasin",
    "importedImg": "Images importées :",
    "importimg": "Importer une image"
    },
    "en": {
    "shopAdd": "Add a shop",
    "shops": "Shops",
    "timeOpenM": "Morning opening time",
    "timeCloseM": "Morning closing time",
    "timeOpenE": "Afternoon opening time",
    "timeCloseE": "Afternoon closing time",
    "label": "Label",
    "telephone": "Telephone",
    "email": "Email",
    "fax": "Fax",
    "address1": "Address 1",
    "address2": "Address 2",
    "zipcode": "Zip code",
    "city": "City",
    "required": "Required field",
    "invalidEmail": "Invalid email",
    "code": "Code",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "searchshop": "Search a shop :",
    "delete_shop" : "Do you want to delete this shop",
    "importedImg": "Imported images :",
    "importimg": "Import image"
    }
    }
</i18n>
