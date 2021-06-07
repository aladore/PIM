<template lang="html">
    <v-flex class="mx-0 mx-sm-5">
        <v-row style="max-height: 60px;">
            <v-col class="col-sm-1 col-12 d-inline-flex" style="min-width: 230px;">
                <v-icon class="su-title-icon" color="white" style="align-self: center;">fa fa-file-alt</v-icon>
                <span class="su-title" v-t="'productsheetdetail'"></span>
            </v-col>
            <v-col class="col-sm-4 col-12 d-inline-flex">
                <v-divider class="mx-4 my-md-3" inset vertical></v-divider>
                <router-link v-if="$route.query.logs" tag="a" class="my-2 my-sm-3" to="Records" style="text-decoration: none;">
                    <a class="su-subtitle">
                        <span style="color: #5FAAD9;" v-t="'records'"></span>
                    </a>
                </router-link>
                <router-link v-else tag="a" class="my-2 my-sm-3" to="ProductsFiles" style="text-decoration: none;">
                    <a class="su-subtitle">
                        <span style="color: #5FAAD9;" v-t="'productsSheet'"></span>
                    </a>
                </router-link>

                <span class="su-subtitle my-2 my-sm-3" style="color: #5FAAD9;">&nbsp; > &nbsp; </span>
                <span class="su-subtitle my-2 my-sm-3" style="color: #011C40;" v-t="'detail'"></span>
            </v-col>

        </v-row>
        <v-row>
            <v-col cols="12">
                <div class="su-block-list">
                    <v-row>
                        <v-col cols="12" class="pb-0">
                            <span class="su-block-list-title" v-if="model">{{ model.data.Name }} </span>
                        </v-col>
                    </v-row>

                    <v-row style="height: calc(100vh - 350px); overflow: auto;">
                        <v-col cols="12" lg="4" md="4">
                            <label for="import_img">
                                <div
                                    class="jumbotron text-center vertical-center su-block-import-img"
                                    :class="[dragImg ? 'container-drag-hover' : 'container-drag']"
                                    @drop.prevent="dragDropImg"
                                    @dragover.prevent
                                    @dragenter="dragImg = true"
                                    @dragend="dragImg = false"
                                    @dragleave="dragImg = false"
                                >
                                    <v-container>
                                        <v-icon size="84" class="text--primary">far fa-image </v-icon>
                                        <div class="clear"></div>
                                        <v-container fluid class="my-5 v-btn text-none v-btn_import theme--light">
                                            <span style="display: inline-block;word-wrap: break-word;">{{ $t("importMedia") }}</span>
                                        </v-container>
                                        <div>
                                            <span>{{ $t("FileSupport") }} : </span><span>jpg / png / mp4</span>
                                        </div>

                                        <input
                                            type="file"
                                            id="import_img"
                                            name="import_img"
                                            accept="image/png, image/jpeg, video/mp4"
                                            style="position:absolute;display: none; opacity: 0;"
                                            @change="previewImage"
                                        />
                                    </v-container>
                                </div>
                            </label>

                            <v-sheet v-if="files.Images.length > 0" class="mx-auto" max-width="700">
                                <v-slide-group v-model="configSlideImg" max-width="700" :show-arrows="showArrows">
                                    <draggable
                                        class="d-flex"
                                        v-model="files.Images"
                                        :scroll-sensitivity="300"
                                        :force-fallback="true"
                                        ghost-class="ghost"
                                        handle=".handle-img"
                                        :animation="200"
                                    >
                                        <v-slide-item v-for="(img, key) in files.Images" :key="key" v-slot:default="{ active, toggle }">
                                            <v-card class="ma-3 handle-img">
                                                <v-img
                                                    v-if="!checkVideoFormat(img)"
                                                    :class="[!img.show ? 'filter' : '', 'filterImg']"
                                                    class="su-small-img"
                                                    :src="
                                                        img.blob ||
                                                            img.url
                                                                .split('.')
                                                                .slice(0, -1)
                                                                .join('.') + '_98.jpg'
                                                    "
                                                    @click="openModal($event, key)"
                                                >
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="red"
                                                                size="21"
                                                                style="position: absolute; top: -8px; left: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="removeImg(key)"
                                                                >far fa-times-circle</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("Delete") }}</span>
                                                    </v-tooltip>

                                                    <v-tooltip bottom v-if="img.show">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="#011c40"
                                                                size="21"
                                                                style="position: absolute; top: -8px; right: -8px; z-index: 9999;border-radius: 50%;background-color: white;"
                                                                @click="toggleShowImg(key)"
                                                                >far fa-eye</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("Show") }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom v-else>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="#011c40"
                                                                size="21"
                                                                style="position: absolute; top: -8px; right: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="toggleShowImg(key)"
                                                                >far fa-eye-slash</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("Hide") }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom v-if="img.url">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="#011c40"
                                                                size="21"
                                                                style="position: absolute; bottom: -8px; right: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="downloadImg(key)"
                                                                >fas fa-arrow-circle-down</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("download") }}</span>
                                                    </v-tooltip>
                                                    <v-row class="fill-height" align="center" justify="center">
                                                        <v-scale-transition>
                                                            <v-icon
                                                                v-if="active"
                                                                color="white"
                                                                size="48"
                                                                v-text="'mdi-close-circle-outline'"
                                                            ></v-icon>
                                                        </v-scale-transition>
                                                    </v-row>
                                                </v-img>
                                                <div v-else @click="openModal($event, key)">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="red"
                                                                size="21"
                                                                style="position: absolute; top: -8px; left: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="removeImg(key)"
                                                                >far fa-times-circle</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("Delete") }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom v-if="img.show">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="#011c40"
                                                                size="21"
                                                                style="position: absolute; top: -8px; right: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="toggleShowImg(key)"
                                                                >far fa-eye</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("Show") }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom v-else>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="#011c40"
                                                                size="21"
                                                                style="position: absolute; top: -8px; right: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="toggleShowImg(key)"
                                                                >far fa-eye-slash</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("Hide") }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom v-if="img.url">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                color="#011c40"
                                                                size="21"
                                                                style="position: absolute; bottom: -8px; right: -8px; z-index: 9999; border-radius: 50%;background-color: white;"
                                                                @click="downloadImg(key)"
                                                                >fas fa-arrow-circle-down</v-icon
                                                            >
                                                        </template>
                                                        <span>{{ $t("download") }}</span>
                                                    </v-tooltip>
                                                    <video
                                                        :src="img.blob || img.url"
                                                        width="100%"
                                                        :class="[!img.show ? 'filter' : '', 'filterImg']"
                                                        class="su-small-img"
                                                    ></video>
                                                    <i
                                                        class="fa fa-play"
                                                        style="position: absolute;transform: translate(-25%, 0%);z-index: 999;padding: 8px;display: flex;bottom: -2px;left: 50%;right: 0;"
                                                        aria-hidden="true"
                                                    ></i>
                                                </div>
                                            </v-card>
                                        </v-slide-item>
                                    </draggable>
                                </v-slide-group>
                            </v-sheet>
                            <div>
                                <div class="su-block-import-files my-2 d-flex">
                                    <v-col cols="8">
                                        <span v-t="'filesTech'" class="su-block-import-files-title ma-2"></span>
                                        <v-chip
                                            class="ma-2 su-chip"
                                            v-for="(file, key) in files.Technics"
                                            :key="key"
                                            color="#011C40"
                                            text-color="white"
                                            pill
                                        >
                                            <v-icon left class="su-chip-icon" color="green" size="20">fas fa-check</v-icon>
                                            <span class="su-chip-text text-left">{{ file.name }}</span>
                                            <v-icon right style="float: right!important;" @click="removeTechFile(key)"
                                                >far fa-times-circle</v-icon
                                            >
                                        </v-chip>
                                        <span v-if="!filesResources.Technics"></span>
                                        <span v-else>
                                            <v-chip
                                                class="ma-2 su-chip"
                                                v-for="(file, key) in filesResources.Technics"
                                                :key="key"
                                                color="#011C40"
                                                text-color="white"
                                                pill
                                            >
                                                <v-icon left class="su-chip-icon" color="green" size="20">fas fa-check</v-icon>
                                                <a class="su-chip-text text-left" target="_blank" :href="file">{{
                                                    file.split("/").pop()
                                                }}</a>
                                                <v-icon right style="float: right!important;" @click="removeResourcesTechFile(file)"
                                                    >far fa-times-circle</v-icon
                                                >
                                            </v-chip>
                                        </span>
                                    </v-col>
                                    <v-col cols="4" class="d-flex justify-center align-center">
                                        <label for="import_tech">
                                            <v-icon
                                                :class="[dragTech ? 'su-small-import-icon-drag' : 'su-small-import-icon']"
                                                @drop.prevent="dragDropTech"
                                                @dragover.prevent
                                                @dragenter="dragTech = true"
                                                @dragend="dragTech = false"
                                                @dragleave="dragTech = false"
                                                color="white"
                                                style="cursor: pointer; position: relative;"
                                                >fas fa-download</v-icon
                                            >
                                        </label>
                                        <input
                                            type="file"
                                            id="import_tech"
                                            name="import_tech"
                                            accept=""
                                            style="position:absolute;display: none; opacity: 0;"
                                            @input="importTech"
                                        />
                                    </v-col>
                                </div>
                                <div class="su-block-import-files my-2 d-flex">
                                    <v-col cols="8">
                                        <span v-t="'filesSecurity'" class="su-block-import-files-title ma-2"></span>
                                        <v-chip
                                            class="ma-2 su-chip"
                                            v-for="(file, key) in files.Securities"
                                            :key="key"
                                            color="#011C40"
                                            text-color="white"
                                            pill
                                        >
                                            <v-icon left class="su-chip-icon" color="green" size="20">fas fa-check</v-icon>
                                            <span class="su-chip-text text-left">{{ file.name }}</span>
                                            <v-icon right style="float: right!important;" @click="removeSecuFile(key)"
                                                >far fa-times-circle</v-icon
                                            >
                                        </v-chip>
                                        <span v-if="!filesResources.Securities"></span>
                                        <span v-else>
                                            <v-chip
                                                class="ma-2 su-chip"
                                                v-for="(file, key) in filesResources.Securities"
                                                :key="key"
                                                color="#011C40"
                                                text-color="white"
                                                pill
                                            >
                                                <v-icon left class="su-chip-icon" color="green" size="20">fas fa-check</v-icon>
                                                <a class="su-chip-text text-left" target="_blank" :href="file">{{
                                                    file.split("/").pop()
                                                }}</a>
                                                <v-icon right style="float: right!important;" @click="removeResourcesSecuFile(file)"
                                                    >far fa-times-circle</v-icon
                                                >
                                            </v-chip>
                                        </span>
                                    </v-col>
                                    <v-col cols="4" class="d-flex justify-center align-center">
                                        <label for="import_secu">
                                            <v-icon
                                                :class="[dragSecu ? 'su-small-import-icon-drag' : 'su-small-import-icon']"
                                                @drop.prevent="dragDropSecu"
                                                @dragover.prevent
                                                @dragenter="dragSecu = true"
                                                @dragend="dragSecu = false"
                                                @dragleave="dragSecu = false"
                                                >fas fa-download</v-icon
                                            >
                                        </label>
                                        <input
                                            type="file"
                                            id="import_secu"
                                            name="import_secu"
                                            accept=""
                                            style="position:absolute;display: none; opacity: 0;"
                                            @input="importSecu"
                                        />
                                    </v-col>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="8" class="col-md-8 col-sm-12 .offset-sm-12 col-12">
                            <v-container>
                                <v-form v-if="model.data" id="su-product-form" ref="form" v-model="valid" @submit.prevent="saveProduct">
                                    <v-jsf v-model="model.data" :schema="schema" :options="options" />
                                </v-form>
                            </v-container>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-spacer></v-spacer>
            <v-col class="col-12">
                <v-btn id="btn-save-sheet" class="su-btn-dark ml-5 float-right" color="#011C40" type="submit" form="su-product-form">{{
                    $t("saveSheet")
                }}</v-btn>
                <v-btn class="su-btn-light px-5 float-right" color="#A2D4F2" @click.prevent="$router.go(-1)">{{ $t("cancel") }}</v-btn>
            </v-col>
        </v-row>
        <modal v-model="modalImg" :v-show="true" :width="474">
            <template>
                <div>
                    <v-carousel v-model="imgInCar" hide-delimiter-background show-arrows-on-hover height="458px" width="458px">
                        <v-carousel-item
                            v-for="(img, key) in files.Images"
                            :key="key"
                            :src="
                                img.blob ||
                                    img.url
                                        .split('.')
                                        .slice(0, -1)
                                        .join('.') + '_458.jpg'
                            "
                            :lazy-src="
                                img.blob ||
                                    img.url
                                        .split('.')
                                        .slice(0, -1)
                                        .join('.') + '_458.jpg'
                            "
                            aspect-ratio="1"
                        >
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-carousel-item>
                    </v-carousel>
                </div>
            </template>
        </modal>
    </v-flex>
</template>
<script>
    import VJsf from "@koumoul/vjsf/lib/VJsf.js";
    import "@koumoul/vjsf/lib/VJsf.css";
    import * as _ from "lodash";
    import draggable from "vuedraggable";
    import Modal from "../Core/Modal";

    export default {
        name: "Product",
        components: { VJsf, draggable, Modal, },
        data() {
            return {
                configSlideImg: null,
                product: [],
                dataImg: [],
                productName: this.$route.query.name,
                files: {
                    // File Blob
                    Images: [],
                    Technics: [],
                    Securities: [],
                },
                filesResources: {
                    // From data product
                    Images: [{ url: "", show: true, }],
                    Technics: [],
                    Securities: [],
                },
                resourcesDeleted: {
                    // To remove
                    Images: [],
                    Technics: [],
                    Securities: [],
                },
                valid: null,
                schema: JSON.parse(JSON.stringify(this.$store.getters.config.schema)),
                options: {
                    locale: "fr",
                    childrenClass: "pr-2",
                },
                model: {
                    data: {
                        Name: "",
                    },
                },
                dragImg: false,
                dragTech: false,
                dragSecu: false,
                showArrows: true,
                modalImg: false,
                imgInCar: 0,
                images98: [],
            };
        },
        watch: {
            // call again the method if the route changes
            $route(val) {
                console.log(val);
            },
            files: {
                handler(val) {
                    this.showArrows = !this.showArrows;
                },
                deep: true,
            },
    },
    created: async function() {
        // Get Model
        let user = this.$store.getters.app("user"),
            isAdmin = this.$store.getters.isGranted("PIM_ADMIN");
        this.model = JSON.parse(JSON.stringify(this.$route.query.product));

        if (this.model.data.hasOwnProperty("Bio")) {
            this.model.data.Bio === 1 ? this.model.data.Bio = true : this.model.data.Bio = false;
        }
        if (this.model.data.hasOwnProperty("BioControl")) {
            this.model.data.BioControl === 1 ? this.model.data.BioControl = true : this.model.data.BioControl = false;
        }

        if (this.model.data.hasOwnProperty("Resources")) {
            if (!this.model.data.Resources.hasOwnProperty("Images")) {
                this.model.data.Resources.Images = [];
            }
            this.filesResources = _.merge(this.filesResources, JSON.parse(JSON.stringify(this.model.data.Resources)));
            this.files.Images = _.merge(this.filesResources.Images, JSON.parse(JSON.stringify(this.model.data.Resources.Images)));
            if (this.files.Images[0].url === "") this.files.Images.shift();
        }

        // Get schema
        let role = isAdmin ? "ADMIN" : "PIMUSER",
            jsf = this.$store.getters.config.schema["DEFAULT-" + role];

        for (let schema of this.$store.getters.config.schemaRules) {
            schema = this.$options.filters.render(schema, {
                user: user,
                role: role,
                model: this.model,
            });

            // key = isAdmin ? schema + "-" + role : schema;
            if (this.$store.getters.config.schema.hasOwnProperty(schema)) {
                jsf = this.$store.getters.config.schema[schema];
                break;
            }
        }

        let params = { params: {
              bucket: this.$store.getters.config.brand.drive.bucket,
              path: this.$store.getters.config.brand.drive.jsfPath + "/" + jsf,
        }, cache: { maxAge: 3600, exclude: { query: false, }, }, };

        await this.$axios.get("/drive/s3/resource", params).then(resp => {
            this.schema = resp.data.schema;
            this.product = JSON.parse(JSON.stringify(this.model));
        });
        // console.log("product", this.product);
    },
    methods: {
        toggleShowImg: function(key) {
            this.files.Images[key].show = !this.files.Images[key].show;
        },
        downloadImg(key) {
            let tab = window.open(this.files.Images[key].url, "_blank");
            tab.focus();
        },
        openModal: function(e, key) {
            if (e.target.tagName === "DIV") {
                this.modalImg = true;
                this.imgInCar = key;
            }
        },
        resources: function(formData, name) {
            for (let resource of this.files[name]) {
                if (name === "Images") {
                    if (resource.hasOwnProperty("file")) {
                        formData.append(`${name}[]`, resource.file, resource.file.name);
                    }
                } else {
                    formData.append(`${name}[]`, resource, resource.name);
                }
            }

            return formData;
        },
        formCheck: function() {
            for (let input of document.forms["su-product-form"].getElementsByTagName("input")) {
                if (input.validity.valid === false) {
                    console.log(input, input.validity.valid, input.validity);
                }
            }
        },
        saveProduct: async function() {
            document.getElementById("btn-save-sheet").disabled = true;

            this.$refs.form.validate();

            if (this.valid) {
                // Copy updated arrays from model to product
                // to make sure that the longer array doesn't overwrite the updated array without removed elements
                Object.keys(this.product.data).forEach(key => {
                    if (Array.isArray(this.product.data[key])) {
                        this.product.data[key] = this.model.data[key];
                    }
                });

                let url = `/pim/product/${this.product._id}`,
                    params = {
                        bucket: this.$store.getters.config.brand.drive.bucket,
                        path: this.$store.getters.config.brand.drive.productPath,
                        resourcePath: this.$store.getters.config.brand.drive.resourcePath,
                        resourcesDeleted: this.resourcesDeleted,
                        data: _.merge(this.product, this.model),
                        old: this.product.data,
                    };

                if (!params.data.data.hasOwnProperty("Resources")) {
                    params.data.data.Resources = {};
                }

                params.data.data.Resources.Images = [];
                for (let image of this.files.Images) {
                    if (image.hasOwnProperty("url")) {
                        params.data.data.Resources.Images.push({ url: image.url, show: image.show, });
                    }
                }

                let formData = new FormData();
                formData.append("product", JSON.stringify(params));
                this.resources(formData, "Images");
                this.resources(formData, "Technics");
                this.resources(formData, "Securities");

                await this.$axios
                    .post(url, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${this.$store.getters.app("token")}`,
                        },
                    })
                    .then(() => {
                        this.$toast.success(this.$t("saveMessage"));
                    })
                    .catch(err => {
                        this.$toast.error(this.$t("errorMessage"));
                        console.log(err);
                    });
            }

            document.getElementById("btn-save-sheet").disabled = false;
        },
        checkVideoFormat: function(image) {
            if (image.hasOwnProperty("mimeType")) {
                return image.mimeType === "video/mp4";
            } else {
                return image.url.endsWith(".mp4");
            }
        },
        dragDropImg: function(e) {
            let files = e.dataTransfer.files,
                evtCopy = JSON.parse(JSON.stringify(e));

            this.dragImg = false;
            evtCopy.target = {};
            evtCopy.target.files = files;
            this.previewImage(evtCopy);
        },
        previewImage: function(event) {
            let input = event.target,
                width = 0,
                height = 0,
                size = 600,
                self = this;

            if (input.files[0].type != "image/jpeg" && input.files[0].type != "image/png" && input.files[0].type != "video/mp4") {
                this.$toast.error(this.$t("PleaseImportAFileInPngOrJpegFormat"));
                return false;
            }

            if (input.files && input.files[0]) {
                input.files.forEach(file => {
                    let reader = new FileReader();
                    reader.onload = e => {
                        if (file.type === "video/mp4") {
                            self.files.Images.push({
                                file: file,
                                blob: URL.createObjectURL(file),
                                show: true,
                                img: false,
                                mimeType: file.type,
                            });
                        } else {
                            let image = new Image();
                            image.src = e.target.result;
                            image.onload = function() {
                                width = image.width;
                                height = image.height;
                                if (width > height && width >= size) {
                                    // landscape
                                    return self.addImg(file, e.target.result);
                                } else if (width < height && height >= size) {
                                    // portrait
                                    return self.addImg(file, e.target.result);
                                } else if (width === height && height >= size) {
                                    return self.addImg(file, e.target.result);
                                }
                                self.$toast.error(self.$t("ImageDimensionsAreLessThanTheAllowableLimit"));
                                return false;
                            };
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }
        },
        addImg: function(file, result) {
            this.files.Images.push({
                file: file,
                blob: result,
                show: true,
                img: true,
                mimeType: file.type,
            });

            return true;
        },
        removeImg: function(key) {
            this.resourcesDeleted.Images.push(this.files.Images[key]);
            this.files.Images.splice(key, 1);
        },
        importTech: function(event) {
            this.files.Technics.push(event.target.files[event.target.files.length - 1]);
        },
        dragDropTech: function(e) {
            let files = e.dataTransfer.files;
            files.forEach(file => {
                this.files.Technics.push(file);
            });
            this.dragTech = false;
        },
        removeTechFile: function(key) {
            this.files.Technics.splice(key, 1);
        },
        importSecu: function(event) {
            this.files.Securities.push(event.target.files[event.target.files.length - 1]);
        },
        dragDropSecu: function(e) {
            let files = e.dataTransfer.files;
            files.forEach(file => {
                this.files.Securities.push(file);
            });
            this.dragSecu = false;
        },
        removeSecuFile: function(key) {
            this.files.Securities.splice(key, 1);
        },
        removeResourcesSecuFile(file) {
            this.filesResources.Securities = this.filesResources.Securities.filter(item => {
                return item !== file;
            });
            this.resourcesDeleted.Securities.push(file);
        },
        removeResourcesTechFile(file) {
            this.filesResources.Technics = this.filesResources.Technics.filter(item => {
                return item !== file;
            });
            this.resourcesDeleted.Technics.push(file);
        },
        // removeResourcesImgFile(img) {
        //     this.filesResources.Images = this.filesResources.Images.filter(item => {
        //         return item !== img;
        //     });
        //     this.resourcesDeleted.Images.push(img);
        // },
    },
    };
</script>


<style scoped lang="scss">
.filterImg {
    transition: all 0.3s ease-in-out;
    position: relative;

    &.filter {
        filter: grayscale(50%) opacity(0.5);
    }
}
/*.container-drag {*/
/*    &.container-drag-hover {*/
/*        background-color: red;*/
/*    }*/
/*}*/
/*.container-drag-hover {*/
/*    background-color: red;*/
/*}*/
.handle-img:hover {
    cursor: grab;
}
.handle-img:active {
    cursor: grabbing;
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

.su-subtitle {
    white-space: pre;
    text-align: left;
    font: Regular 14px/18px Montserrat;
    letter-spacing: 0px;
    opacity: 1;
    /*margin: 5px;*/
}

.su-block-list {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    opacity: 1;
    padding: 15px 30px;
}

.su-block-list-title {
    text-align: left;
    font: 24px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-block-list-text {
    text-align: left;
    font: 16px/40px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
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

.su-small-img {
    /*margin: 10px;*/
    width: 89px;
    height: 89px;
    /*border: 1px solid #023473;*/
    opacity: 1;
    overflow: initial;
}
.su-small-img:hover {
    border: 1px solid #a2d4f2;
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

.su-block-import-files {
    background: #f2f2f2 0% 0% no-repeat padding-box;
    border-radius: 5px;
    opacity: 1;
}

.su-block-import-files-title {
    text-align: left;
    font: Bold 14px/17px Helvetica Neue, sans serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-small-import-icon {
    opacity: 1;
    height: 55px;
    width: 55px;
    border-radius: 20%;
    background-color: #011c40;
    color: #ffffff;
    cursor: pointer;
    position: relative;
}

.su-small-import-icon-drag {
    opacity: 1;
    /*width: 110px;*/
    /*height: 110px;*/
    border-radius: 20%;
    background-color: #a2d4f2;
    color: #ffffff;
    cursor: pointer;
    position: relative;
}

.su-img-import-icon {
    opacity: 1;
    color: #021c40;
    cursor: pointer;
    position: relative;
}

.su-img-import-icon-drag {
    color: #757575;
    opacity: 1;
    cursor: pointer;
    position: relative;
    top: 0px;
}

.su-chip {
    width: 100%;
    max-width: 500px;
    padding-left: 15px;
}

.su-chip-icon {
    width: 25px;
    height: 25px;
    min-width: 25px;
    min-height: 25px;
    border-radius: 50%;
    background-color: #ffffff;
}

.su-chip-text {
    width: 355px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
}

.su-preview-img-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}
</style>

<i18n>
    {
        "fr": {
            "ImageDimensionsAreLessThanTheAllowableLimit" : "Les dimensions de l'image sont inférieurs à la limite autorisée",
            "PleaseImportAFileInPngOrJpegFormat" : "Veuillez importer un fichier au format png, jpeg ou mp4",
            "productsheetdetail": "Détail Fiche",
            "productInfo": "Information produit",
            "productName": "Nom du produit",
            "productReference": "Saisir référence",
            "productShort": "Description courte",
            "productLong": "Description longue",
            "saveSheet": "Enregistrer la fiche",
            "productsSheet": "Fiches produits",
            "detail": "Détail",
            "filesTech": "Fiches techniques :",
            "filesSecurity": "Fiches de sécurité :",
            "saveMessage": "Le produit a bien été mis à jour.",
            "errorMessage": "Une erreur est survenue. Veuillez réessayer ultérieurement.",
            "importimg": "Importer une image",
            "importMedia": "Importer un media",
            "Hide" : "Cacher",
            "Show" : "Afficher",
            "Delete" : "Supprimer",
            "download" : "Télécharger",
            "records" : "Historiques",
            "FileSupport" : "Fichier supporté"
        },
        "en": {
            "ImageDimensionsAreLessThanTheAllowableLimit" : "The dimensions of the image are smaller than the allowed limit.",
            "PleaseImportAFileInPngOrJpegFormat" : "Please import a file in png, jpeg or mp4 format",
            "productsheetdetail": "Sheet details",
            "productInfo": "Product information",
            "productName": "Product name",
            "productReference": "Enter reference",
            "productShort": "Short description",
            "productLong": "Long description",
            "saveSheet": "Save sheet",
            "productsSheet": "Products sheet",
            "detail": "Detail",
            "filesTech": "Technical files :",
            "filesSecurity": "Security files :",
            "saveMessage": "Product has been updated.",
            "errorMessage": "An error has occurred. Please try again.",
            "importimg": "Import image",
            "importMedia": "Import a media",
            "Hide" : "Hide",
            "Show" : "Show",
            "Delete" : "Delete",
            "download" : "Download",
            "records" : "Records",
            "FileSupport" : "File support"
        }
    }
</i18n>
