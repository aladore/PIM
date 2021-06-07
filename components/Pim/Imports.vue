<template>
    <v-flex class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-inline-flex">
                <v-icon class="su-title-icon" color="white">fa fa-download</v-icon>
                <span class="su-title"> Imports </span>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-col class="col-md-7 col-12">
                <div class="su-import-block-white">
                    <span v-t="'dragfiles'" class="font-weight-bold su-import-block-white-title"></span>
                    <!--                    <v-btn @click="payload()">Payload</v-btn>-->
                    <v-row>
                        <v-col class="d-flex col-sm-6 col-12" align="center">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label for="import_excel">
                                            <span
                                                class="su-label"
                                                v-t="'excellfile'"
                                                style="cursor: pointer; position: relative; top: 0px;"
                                            ></span>
                                        </label>
                                    </v-col>
                                    <v-col cols="12">
                                        <label for="import_excel">
                                            <v-divider class="su-divider" style="color: #023473;"></v-divider>
                                        </label>
                                    </v-col>
                                    <v-col cols="12">
                                        <label for="import_excel">
                                            <v-icon
                                                :class="[dragExcel ? 'su-import-icon-drag' : 'su-import-icon']"
                                                @drop.prevent="dragDropExcel"
                                                @dragover.prevent
                                                @dragenter="dragExcel = true"
                                                @dragend="dragExcel = false"
                                                @dragleave="dragExcel = false"
                                                color="white"
                                                size="50"
                                                style="cursor: pointer; position: relative; top: 0px;"
                                                >fas fa-download
                                            </v-icon>
                                        </label>
                                        <input
                                            type="file"
                                            id="import_excel"
                                            name="import_excel"
                                            accept=".xlsx"
                                            style="position:absolute;display: none; opacity: 0;"
                                            @input="importExcel"
                                        />
                                    </v-col>
                                    <v-col v-if="files.excel" class="pb-0" cols="12">
                                        <v-icon class="su-imported-file-icon" size="15">fas fa-file</v-icon>
                                        <span class="su-imported-file-name">{{ files.excel.name }}</span>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                        <v-col class="d-flex col-sm-6 col-12" align="center">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" class="pb-0">
                                        <label for="import_img">
                                            <span
                                                class="su-label"
                                                v-t="'image'"
                                                style="cursor: pointer; position: relative; top: 0px;"
                                            ></span>
                                        </label>
                                    </v-col>
                                    <v-col cols="12">
                                        <label for="import_img">
                                            <v-divider class="su-divider" style="color: #023473;"></v-divider>
                                        </label>
                                    </v-col>
                                    <v-col cols="12">
                                        <label for="import_img">
                                            <v-icon
                                                :class="[dragZip ? 'su-import-icon-drag' : 'su-import-icon']"
                                                @drop.prevent="dragDropZip"
                                                @dragover.prevent
                                                @dragenter="dragZip = true"
                                                @dragend="dragZip = false"
                                                @dragleave="dragZip = false"
                                                color="white"
                                                size="50"
                                                style="cursor: pointer; position: relative; top: 0px;"
                                                >fas fa-download</v-icon
                                            >
                                        </label>
                                        <input
                                            type="file"
                                            id="import_img"
                                            name="import_img"
                                            accept=".zip"
                                            style="position:absolute;display: none; opacity: 0;"
                                            @input="importImage"
                                        />
                                    </v-col>
                                    <v-col v-if="files.zip" class="pb-0" cols="12">
                                        <v-icon class="su-imported-file-icon" size="15">fas fa-file</v-icon>
                                        <span class="su-imported-file-name">{{ files.zip.name }}</span>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                        <v-col v-if="filesImported" class="d-flex col-12 pt-0" align="center">
                            <v-container class="pt-0">
                                <v-btn
                                    class="text-none su-import-file-btn px-8 mt-8"
                                    color="#A2D4F2"
                                    v-t="'send'"
                                    @click="sendFiles"
                                ></v-btn>
                            </v-container>
                        </v-col>
                        <v-col v-if="inProgress" class="d-flex col-12 pt-0" align="center">
                            <v-container class="pt-0">
                                <span class="su-label" v-t="'in_progress'" style="position: relative; top: 0px;"></span>
                            </v-container>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col class="col-md-5 col-12">
                <div class="su-import-block-blue">
                    <v-row>
                        <span v-t="'techspec'" class="font-weight-bold su-import-block-blue-title"></span>

                        <v-col cols="12" class="py-0">
                            <span v-t="'excellfileSpec'" class="su-import-block-blue-subtitle"></span><br />
                            <span v-t="'excellfileFormat1'" class="su-import-block-blue-text"></span><br />
                            <span v-t="'excellfileFormat2'" class="su-import-block-blue-text"></span><br />
                            <span v-t="'excellfileFormat3'" class="su-import-block-blue-text"></span><br />
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <span v-t="'imageSpec'" class="su-import-block-blue-subtitle"></span><br />
                            <span v-t="'imageFormat'" class="su-import-block-blue-text"></span>
                        </v-col>
                        <v-col cols="12">
                            <span v-t="'imageControl'" class="su-import-block-blue-subtitle"></span>
                        </v-col>
                        <v-col cols="12" class="pb-3 pt-0">
                            <div class="mb-2">
                                <v-icon size="23" color="green" class="mr-2 su-chip-icon-spec">fas fa-check</v-icon
                                ><span v-t="'imageOk'" class="text-caption su-import-block-blue-text"></span>
                            </div>
                            <div>
                                <v-icon size="23" color="red" class="mr-2 su-chip-icon-spec">fas fa-times</v-icon
                                ><span v-t="'imageKo'" class="text-caption su-import-block-blue-text"></span>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col class="col-md-7 col-12">
                <div class="su-import-block-white">
                    <v-row>
                        <span v-t="'imageControlImport'" class="font-weight-bold  su-import-block-white-title"></span>
                        <v-col cols="12">
                            <v-progress-linear
                                rounded
                                v-if="this.progress !== null"
                                v-model="this.progress"
                                class="mb-5"
                                color="#5faad9"
                                height="25"
                            >
                                <strong>{{ Math.ceil(this.progress) }}%</strong>
                            </v-progress-linear>
                            <v-container class="su-img-control">
                                <v-row align="center" justify="center">
                                    <v-col v-for="(img, i) in images" :key="i" class="shrink md-6 xs-12 py-0" align-self="center">
                                        <v-card class="ma-2 d-inline-block su-card white--text" color="#011C40" text-color="white" shaped>
                                            <v-row>
                                                <v-col cols="1" align-self="center">
                                                    <v-icon left v-if="img.errors.length === 0" class="su-chip-icon" color="green" size="21"
                                                        >fas fa-check</v-icon
                                                    >
                                                    <v-icon left class="su-chip-icon" color="red" size="21" v-else>fas fa-times</v-icon>
                                                </v-col>
                                                <v-col cols="11" class="pl-5 font-weight-regular">
                                                    <span>{{ img.name }}</span>
                                                    <v-card-text v-if="img.errors.length > 0" class="pa-0 su-chip-text white--text">
                                                        <div v-for="(imgName, j) in img.errors" :key="'i' + j"><b>-</b> {{ imgName }}</div>
                                                    </v-card-text>
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                    <v-col v-if="images.length % 2 !== 0" class="shrink md-6 xs-12 py-0" align-self="center">
                                        <v-card
                                            class="ma-2 su-card white--text text-center"
                                            style="visibility: hidden;"
                                            rounded
                                            light
                                        ></v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col class="col-md-5 col-12">
                <div class="su-import-block-blue">
                    <v-row>
                        <span v-t="'importfile'" class="font-weight-bold  su-import-block-blue-title"></span>
                        <v-col cols="12">
                            <span v-t="'importfileText'" class="su-import-block-blue-subtitle"></span>
                        </v-col>
                        <v-col v-if="$isGranted('PIM_ADMIN')" cols="12" class="pb-0">
                            <subscriber-autocomplete
                                class="su-search-bar"
                                :label="$t('provider')"
                                :search-extra="$store.getters.config.brand.extra.supplier"
                                :height="'56px'"
                                v-model="filterSupplier"
                                multiple
                                no-filter
                                :no-data-text="$t('StartTypingNameOfAProvider')"
                                hide-no-data
                            ></subscriber-autocomplete>
                        </v-col>
                        <v-col v-if="$isGranted('PIM_ADMIN')" cols="12" lg="6" md="12" sm="6" class="pb-0">
                            <v-select
                                class="su-search-bar"
                                :label="$t('filterbyCategories')"
                                :items="filtersSelectCategorie"
                                v-model="filterSelectCategorie"
                                clearable
                                outlined
                            ></v-select>
                        </v-col>
                        <v-col v-if="$isGranted('PIM_ADMIN')" cols="12" lg="6" md="12" sm="6" class="pb-0">
                            <v-select
                                class="su-search-bar"
                                :label="$t('filterbyStatus')"
                                :items="filtersSelectStatut"
                                v-model="filterSelectStatut"
                                outlined
                                clearable
                            ></v-select>
                        </v-col>
                        <v-col cols="6" class="pb-0 align-self-center">
                            <v-btn class="text-none su-import-file-btn px-8" color="#A2D4F2" v-t="'download'" @click="exportExcel"></v-btn>
                        </v-col>
                        <v-col cols="12" class="pt-0"> </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-flex>
</template>

<script>
import SubscriberAutocomplete from "@/components/Core/Subscriber/SubscriberAutocomplete";
export default {
    name: "Imports",
    components: { SubscriberAutocomplete, },
    data() {
        return {
            images: [],
            files: {
                excel: null,
                zip: null,
            },
            filesImported: false,
            dragExcel: false,
            dragZip: false,
            eventName: "pim:import",
            progress: null,
            inProgress: false,
            filterSupplier: null,
            filterSelectCategorie: "",
            filtersSelectCategorie: [],
            filterSelectStatut: "",
            filtersSelectStatut: [
                {
                    text: this.$t("ProductToComplete"),
                    value: "data.Status=0",
                },
                {
                    text: this.$t("ProductComplete"),
                    value: "data.Status=1",
                },
            ],
            detail: {
                payload: [
                    { type: "start", progress: 0, total: 41, errors: [], },
                    { type: "start", progress: 1, total: 41, name: "24129 - KARATE K 5L", status: 1, errors: [] },
                    { type: "start", progress: 2, total: 41, name: "31468 - ALISEO GOLD SAFENEUR 5 L", status: 1, errors: [], },
                    { type: "start", progress: 3, total: 41, name: "31468 - ALISEO GOLD SAFENEUR 5 L", status: 1, errors: [], },
                    {
                        type: "start",
                        progress: 4,
                        total: 41,
                        name: "31468 - ALISEO GOLD SAFENEUR 5 L",
                        status: 2,
                        errors: ["image1.jpg", "image2.jpg",],
                    },
                    { type: "start", progress: 5, total: 41, name: "31468 - ALISEO GOLD SAFENEUR 5 L", status: 1, errors: [], },
                    { type: "start", progress: 6, total: 41, name: "31468 - ALISEO GOLD SAFENEUR 5 L", status: 1, errors: [], },
                    { type: "start", progress: 7, total: 41, name: "31468 - ALISEO GOLD SAFENEUR 5 L", status: 2, errors: ["image3.jpg",], },
                    {
                        type: "start",
                        progress: 8,
                        total: 41,
                        name: "31468 - ALISEO GOLD SAFENEUR 5 L ALISEO GOLD SAFENEUR 5 L",
                        status: 1,
                        errors: [],
                    },
                    {
                        type: "start",
                        progress: 9,
                        total: 41,
                        name: "31468 - ALISEO GOLD SAFENEUR 5 L ALISEO GOLD SAFENEUR 5 L",
                        status: 1,
                        errors: [],
                    },
                    { type: "end", total: 41, treated: 3, good: 2, bad: 0, },
                ],
            },
            i: 0,
        };
    },
    async mounted() {
        // listen eventName pim:import
        document.addEventListener(this.eventName, this.listen, false);

        let params = {
            params: {
                bucket: this.$store.getters.config.brand.drive.bucket,
                path: this.$store.getters.config.brand.extra.product.categories,
            },
            cache: { maxAge: 3600, exclude: { query: false, }, },
        };

        await this.$axios.get("/drive/s3/resource", params).then(resp => {
            this.categories = [...resp.data.enum];
            for (let categorie of this.categories) {
                this.filtersSelectCategorie.push({
                    text: categorie.text,
                    value: `data.Categories.keyword=${categorie.id}`,
                });
            }
        });
    },
    beforeDestroy() {
        if (document.removeEventListener) {
            document.removeEventListener(this.eventName, this.listen);
        } else if (document.detachEvent) {
            document.detachEvent(this.eventName, this.listen);
        }
    },
    methods: {
        payload() {
            document.dispatchEvent(new CustomEvent("pim:import", { detail: this.detail, }));
        },
        listen(evt) {
            if (this.files.excel) {
                let type = evt.detail.payload.type;

                if (type === "start") {
                    this.progress = 0;
                } else if (type === "end") {
                    this.progress = 100;
                    this.filesImported = true;
                    this.inProgress = false;
                } else {
                    // Progress
                    this.progress = (evt.detail.payload.line * 100) / evt.detail.payload.total;
                    if (evt.detail.payload.errors.length > 0) {
                        this.images.push(evt.detail.payload);
                    }
                }
            } else {
                this.$toast.warning(this.$t("filewarn"));
            }
        },
        exportExcel() {
            let supplierId = this.$store.getters.supplierId()
                ? this.$store.getters.supplierId()
                : this.filterSupplier
                ? this.filterSupplier[Object.keys(this.filterSupplier)[0]].customId
                : null,
                admin = this.$isGranted("PIM_ADMIN")
            ;

            if (supplierId || admin) {

                let params = {
                    bucket: this.$store.getters.config.brand.drive.bucket,
                    path: this.$store.getters.config.brand.drive.productPath,
                    kind: "product",
                    excel: this.$store.getters.config.brand.ecom.excel,
                    automation: this.$store.getters.config.brand.automation.export,
                };

                if (!supplierId) {
                    supplierId = null;
                }

                if (this.filterSelectCategorie) {
                    params.extra = this.filterSelectCategorie;
                }
                if (this.filterSelectStatut) {
                    if (!this.filterSelectCategorie) {
                        params.extra = this.filterSelectStatut;
                    } else {
                        params.extra += " AND " + this.filterSelectStatut;
                    }
                }

                console.log(params.extra);

                this.$axios
                    .get("/pim/products/supplier/" + supplierId, { params: params, responseType: "blob", })
                    .then(data => {

                      if (data.headers["content-type"] === 'application/json') {
                        this.$toast.info(this.$t("email.sent"));
                      } else {
                        console.log('data', data, data.headers["content-type"]);
                        let a = document.createElement("a"),
                            url = window.URL.createObjectURL(new Blob([data.data], { type: data.headers["content-type"], }));
                        a.setAttribute("style", "display: none");
                        a.href = url;
                        a.download = "products.xlsx";
                        a.click();
                        a.remove();

                        window.URL.revokeObjectURL(url);
                      }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                this.$toast.warning(this.$t("supplier-not-found"));
            }
        },
        async sendFiles() {
            this.filesImported = false;
            this.inProgress = true;

            let formData = new FormData();

            formData.append("bucket", this.$store.getters.config.brand.drive.bucket);
            formData.append("pathProducts", this.$store.getters.config.brand.drive.productPath);
            formData.append("pathResources", this.$store.getters.config.brand.drive.resourcePath);
            formData.append("pathHistoric", this.$store.getters.config.brand.drive.historicPath);
            formData.append("automationId", this.$store.getters.config.brand.automation.import);
            formData.append("excel", this.files.excel);
            formData.append("zip", this.files.zip);
            formData.append("room", this.$io.payload.room);

            await this.$axios
                .post("/pim/products/import", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(data => {
                    console.log("POST OK", data);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        importExcel(e) {
            if (e.target.files[0].name.endsWith(".xlsx")) {
                this.files.excel = e.target.files[0];
            } else {
                this.$toast.warning(this.$t("bad-format"));
            }
            this.filesImported = true;
            this.dragExcel = false;
            this.images = [];
            this.progress = null;
        },
        dragDropExcel(e) {
            let x = { target: { files: [] } };
            x.target.files[0] = e.dataTransfer.files[0];
            this.importExcel(x);
        },
        importImage: async function(e) {
            if (e.target.files[0].name.endsWith(".zip")) {
                this.files.zip = e.target.files[0];
            } else {
                this.$toast.warning(this.$t("bad-format"));
            }
            this.files.excel ? (this.filesImported = true) : (this.filesImported = false);
            this.dragZip = false;
            this.images = [];
            this.progress = null;
        },
        dragDropZip(e) {
            let x = { target: { files: [] } };
            x.target.files[0] = e.dataTransfer.files[0];
            this.importImage(x);
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
    padding: 5px 34px;
    height: 100%;
}

.su-import-block-blue {
    background: transparent linear-gradient(123deg, #5faad9 0%, #023473 100%) 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    opacity: 1;
    border-radius: 13px;
    padding: 5px 34px;
    /*padding-left: 30px;*/
    /*padding-right: 30px;*/
    height: 100%;
}

.su-import-block-white-title {
    text-align: left;
    font: 24px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-import-block-blue-title {
    text-align: left;
    font: 24px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
}

.su-import-block-blue-subtitle {
    text-align: left;
    font: bolder 15px/19px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #ffffff;
}

.su-import-block-blue-text {
    text-align: left;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
}

.su-import-icon {
    width: 122px;
    height: 122px;
    border-radius: 13%;
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
}

.su-import-icon-drag {
    width: 122px;
    height: 122px;
    border-radius: 13%;
    background: #5faad9 0% 0% no-repeat padding-box;
    opacity: 1;
}

/*.su-drop-container.over {*/
/*    background-color: #5FAAD9;*/
/*    background: #5FAAD9;*/
/*}*/

.su-imported-file-icon {
    margin-right: 5px;
    color: #011c40;
    opacity: 1;
}

.su-imported-file-name {
    text-align: left;
    font: bolder 15px/19px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
}

.su-img-control {
    max-height: 200px;
    overflow-y: auto;
}

.su-label {
    text-align: center;
    font: Bold 14px/18px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #023473;
    opacity: 1;
}

.su-chip {
    /*width: 500px;*/
    width: 100%;
    min-width: 400px;
    max-width: 500px;
    padding-left: 15px;
    /*padding-right: 15px;*/
}

.su-card {
    width: 400px;
    padding-left: 15px;
    border-radius: 25px;
}

.su-chip-icon {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background-color: #ffffff;
}

.su-chip-icon-spec {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ffffff;
}

.su-chip-text {
    width: 355px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.su-import-file-btn {
    background: #a2d4f2 0% 0% no-repeat padding-box;
    border-radius: 7px;
    opacity: 1;
    color: #011c40;
    /*padding: 12px 35px!important;*/
}

.su-import-small-text {
    text-align: left;
    font: 10px/13px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #ffffff;
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

.su-divider {
    width: 200px;
}
</style>

<i18n>
    {
    "fr": {
    "dragfiles": "Glissez vos fichiers pour effectuer un import",
    "excellfile": "Fichier Excel",
    "image": "Dossier ressources (zip)",
    "excellfileSpec": "Fichier Excel : ",
    "imageSpec": "Dossier ressources (photos, vidéos, pdf) :",
    "excellfileFormat1": "1- Téléchargez le fichier d’import disponible ci-dessous.",
    "excellfileFormat2": "2- Complétez uniquement les cases blanches.",
    "excellfileFormat3": "Les noms des images et/ou pdf doivent être séparés par des virgules et avoir le même nom que le fichier image correspondant. Attention il faut également l’extension de l’image (.jpg, .png …).",
    "imageFormat": "Produire un Zip avec toutes les images et documents. Les fichiers ne doivent pas être dans un dossier mais compressés directement à la racine de l'archive. Attention les images doivent être au minimum de 600 px.",
    "imageControl": "Contrôle des images :",
    "imageControlImport": "Contrôle des images importées en erreur",
    "imageOk": "Image correcte",
    "imageKo": "Image incorrecte",
    "importfile": "Fichier d'import",
    "importfileText": "Télécharger le fichier d'import pour récupérer la matrice des produits à compléter",
    "download": "Télécharger",
    "send": "Envoyer",
    "in_progress": "En cours de traitement ...",
    "techspec": "Comment importer les produits",
    "provider": "Fournisseur",
    "filterbyCategories" : "Catégories",
    "filewarn": "Importez les fichiers",
    "email.sent": "Un e-mail a été envoyé avec le fichier excel joint.",
    "filterbyStatus" : "Statut",
    "ProductToComplete" : "A compléter",
    "ProductComplete" : "Complète",
    "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
    },
    "en": {
    "dragfiles": "Drag your files to import",
    "excellfile": "Excel file",
    "image": "Image folder (zip)",
    "excellfileSpec": "Excel file : ",
    "imageSpec": "Image folder (photos, videos) : ",
    "excellfileFormat1": "1- Download the import file",
    "excellfileFormat2": "2- Complete only white cases",
    "excellfileFormat3": "Image names must be separated by commas and have the same name as the corresponding image file. Please note that the image extension (.jpg, .png ...) is also required.",
    "imageFormat": "Provide a Zip with all the images and documents. The files should not be in a folder but compressed directly at the root of the archive. Attention the images must be at least 600 px.",
    "imageControl": "Image control :",
    "imageControlImport": "Imported images error control",
    "imageOk": "Correct image",
    "imageKo": "Incorrect image",
    "importfile": "Import file",
    "importfileText": "Download the import file to retrieve the matrix of products to complete",
    "download": "Download",
    "send": "Send",
    "in_progress": "In process of treatment ...",
    "techspec": "How to import products",
    "provider": "Supplier",
    "filterbyCategories" : "Categories",
    "filewarn": "Import files",
    "email.sent": "E-mail has been sent with excel file.",
    "filterbyStatus" : "Status",
    "ProductToComplete" : "Complete",
    "ProductComplete" : "Incomplete",
    "StartTypingNameOfAProvider": "Start typing the name of a provider"
    }
    }
</i18n>
