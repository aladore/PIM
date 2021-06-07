<template>
    <v-flex class="mx-sm-5 mx-0">
        <v-row>
            <v-col class="d-inline-flex col-12">
                <v-icon class="su-title-icon align-self-center" color="white">fas fa-images</v-icon>
                <span class="su-title" v-t="'slider'"></span>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-col cols="12">
                <div class="su-import-block-white">
                    <div v-t="'sliderConfig'" class="title_page"></div>
                    <div class="wrapper-sliders" id="wrapper-sliders">
                        <draggable
                            v-model="sliderstmp"
                            :scroll-sensitivity="300"
                            :force-fallback="true"
                            group="sliders"
                            :animation="200"
                            ghost-class="ghost"
                            handle=".icon-handle"
                        >
                            <div v-if="getLoader" class="container_loader">
                                <rotate-square2 v-if="getLoader"></rotate-square2>
                            </div>
                            <slider-block
                                v-else
                                v-for="(slider, index) in sliderstmp"
                                ref="childSliders"
                                :key="slider.id"
                                :number="index"
                                :slider="slider"
                                v-model="sliderstmp"
                                v-on:remove="removeSlide(index)"
                                @update="update"
                                @removeImg="slider.file = ''"
                            >
                            </slider-block>
                        </draggable>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-col class="col-sm-6 col-12">
                <v-btn class="su-btn-light pl-3 pr-10" color="#A2D4F2" @click="addSlide">
                    <v-icon class="su-btn-icon" color="#011C40" size="15">fas fa-plus</v-icon>
                    {{ $t("addslide") }}
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="col-sm-6 col-12">
                <div v-if="saveLoader" class="container_loader">
                    <rotate-square2></rotate-square2>
                </div>
                <v-btn v-else class="su-btn-dark ml-5 float-right" color="#011C40" @click="save">{{ $t("save") }}</v-btn>
                <v-btn class="su-btn-light px-5 float-right" color="#A2D4F2" @click="cancel">{{ $t("discard") }}</v-btn>
            </v-col>
        </v-row>
    </v-flex>
</template>

<script>
import SliderBlock from "@/components/Core/SliderBlock";
import { RotateSquare2, } from "vue-loading-spinner";
import draggable from "vuedraggable";
import Sortable from "sortablejs";

export default {
    name: "Slider",
    components: {
        SliderBlock,
        draggable,
        Sortable,
        RotateSquare2,
    },

    data() {
        return {
            sliders: [{ id: 1, file: "", state: "plan", dstart: "", dend: "", url: "", }],
            sliderstmp: [],
            saveLoader: false,
            getLoader: false,
            statusForm: [],
        };
    },
    watch: {},
    mounted() {
        this.getSliders();
    },
    methods: {
        getSliders(force) {
            this.getLoader = true;

            let ecomApi = this.$store.getters.config.brand.ecom.api,
                forceCache = force ? "?force=true" : "";
            ;

            this.$axios
                .get("/proxy", {
                    headers: {
                        "x-su-proxyrest-url": ecomApi + "/conf/sliders"+forceCache,
                    },
                })
                .then(data => {
                    this.getLoader = false;
                    if (Object.entries(data.data.message).length === 0) {
                        this.sliderstmp.push({
                            id: 1,
                            file: "",
                            state: "plan",
                            dstart: "",
                            dend: "",
                            url: "",
                        });
                    } else {
                        console.log("GET OK : ", data.data.message);
                        this.sliders = [];
                        this.sliders = data.data.message;
                        this.sliderstmp = [...this.sliders];
                    }
                })
                .catch(err => {
                    this.getLoader = false;
                    console.log(err);
                    this.sliderstmp = this.sliders;
                });
        },
        addSlide() {
            this.sliderstmp.push({
                id: this.sliderstmp.reduce((prev, current) => (+prev.id > +current.id ? prev : current)).id + 1,
                file: "",
                state: "plan",
                dstart: "",
                dend: "",
                url: "",
            });
            //scrollBottom
            setTimeout(
                () => document.querySelector(".su-slider-block:last-child").scrollIntoView({ block: "start", behavior: "smooth", }),
                100,
            );
        },
        removeSlide(index) {
            this.sliderstmp.splice(index, 1);
            if (this.sliderstmp.length === 0) {
                // this.addSlide();
                this.sliderstmp.push({ file: "", state: "plan", dstart: null, dend: null, url: "", });
            }
        },
        save: function() {
            let formIsInvalid = this.$refs.childSliders.some(slider => {
                if (slider.$v) {
                    return slider.$v.$invalid;
                }
            });
            console.log(this.sliderstmp);

            if (!formIsInvalid) {
                this.saveLoader = true;
                let bucket = this.$store.getters.config.brand.drive.bucket,
                    bucketPath = this.$store.getters.config.brand.drive.bucketPath,
                    ecomApi = this.$store.getters.config.brand.ecom.api,
                    formData = new FormData(),
                    i = 0,
                    nfile = 0;

                formData.append("bucket", bucket);
                formData.append("bucketPath", bucketPath);
                formData.append("sliders", JSON.stringify(this.sliderstmp));

                this.sliderstmp.forEach(slider => {
                    if (slider.file) {
                        formData.append(`files[${i}]`, slider.file);
                        nfile++;
                    }
                    i++;
                });

                this.$axios
                    .post("/proxy", formData, {
                        headers: {
                            "x-su-proxyrest-url": ecomApi + "/conf/sliders",
                            "Content-Type": nfile ? "multipart/form-data" : "application/json",
                            // "Access-Control-Allow-Origin": "*",
                            // "Access-Control-Allow-Methods": "POST",
                        },
                    })
                    .then(async data => {
                        this.saveLoader = false;
                        console.log("POST OK", data);
                        this.$toast.success(this.$t("saveMessage"));
                        await this.getSliders(true);
                    })
                    .catch(err => {
                        this.saveLoader = false;
                        console.log(err);
                        this.$toast.error(this.$t("errorMessage"));
                    });
            } else {
                this.$refs.childSliders.map(childSlider => childSlider.touch());
            }
        },
        cancel: function() {
            let ecomApi = this.$store.getters.config.brand.ecom.api;
            this.sliderstmp = [...this.sliders];

            this.$axios
                .get("/proxy", {
                    headers: {
                        "x-su-proxyrest-url": ecomApi + "/conf/sliders",
                        // "Access-Control-Allow-Origin": "*",
                        // "Access-Control-Allow-Methods": "GET",
                    },
                })
                .then(data => {
                    console.log("GET OK : ", data.data.message);
                    this.saveLoader = false;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        update(id, slider) {
            this.sliderstmp[id] = slider;
        },
    },
};
</script>

<style scoped lang="scss">
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

.su-slider-block {
    position: relative;
    padding: 5px 0;
}
/*.su-slider-block:not(:first-child):before*/

.su-slider-block:not(:first-child):before {
    content: "";
    position: absolute;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    height: 1px;
    left: 13px;
    right: 13px;
    top: 0px;
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
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 3px;
    /*min-height: 100%;*/
}

.su-import-block-white-title {
    text-align: left;
    font: 24px/60px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-block-import-img {
    background: #011c40 0% 0% no-repeat padding-box;
    height: 190px;
    opacity: 1;
    &:hover {
        opacity: 0.5;
    }
}

.su-btn-dark {
    text-align: left;
    font: Medium 12px/34px Montserrat;
    letter-spacing: 0px;
    color: #ffffff;
    border-radius: 7px;
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

.su-block-import-img-label {
    text-align: left;
    font: Bold 14px/18px Montserrat, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-block-import-img-bold-text {
    text-align: left;
    font: Bold 13px/16px Helvetica Neue, sans-serif;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-block-import-img-text {
    text-align: left;
    font-family: Helvetica Neue, sans-serif;
    font-size: 13px;
    letter-spacing: 0px;
    color: #011c40;
    opacity: 1;
}

.su-btn-icon {
    opacity: 1;
    border-radius: 50%;
    margin-right: 22px;
}

.v-input {
    .v-text-field__slot {
        text-align: left;
        font: SemiBold 16px/19px Montserrat;
        letter-spacing: 0px;
        color: #a2d4f2;
        opacity: 1;
    }
}
</style>

<i18n>
 {
 "fr": {
 "slider": "Slider",
 "sliderConfig": "Configuration du slider de la page d'accueil",
 "importimg": "Importer une image",
 "show": "Afficher",
 "hide": "Masquer",
 "plan": "Planifier",
 "addslide": "Ajouter un slide",
 "save": "Enregistrer",
 "discard": "Annuler",
 "datestart": "Date début d'affichage",
 "dateend": "Date fin d'affichage",
 "url": "Lien de redirection",
 "saveMessage": "Les Sliders ont bien été enregistrés.",
 "errorMessage": "Une erreur est survenue. Veuillez réessayer ultérieurement."
 },
 "en": {
 "slider": "Slider",
 "sliderConfig": "Home page slider configuration",
 "importimg": "Import an image",
 "show": "Display",
 "hide": "Hide",
 "plan": "Plan",
 "addslide": "Add slide",
 "save": "Save",
 "discard": "Discard",
 "datestart": "Posting start date",
 "dateend": "Posting end date",
 "url": "Redirect link",
 "saveMessage": "Slides have been saved.",
 "errorMessage": "An error has occurred. Please try again."
 }
 }
</i18n>
