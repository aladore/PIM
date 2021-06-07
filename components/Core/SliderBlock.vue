<template>
    <v-row class="su-slider-block">
        <v-col cols="12" class="py-0">
            <span align="left">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="icon su-block-import-img-icon icon-handle" color="#ffffff" size="20" @click="remove"
                            >fa fa-align-justify handle</v-icon
                        >
                    </template>
                    <span>{{ $t("reorder") }}</span>
                </v-tooltip>
            </span>
            <span v-t="'slider'" class="su-block-import-img-label"></span>
            <span class="su-block-import-img-label"> {{ number + 1 }} :</span>
        </v-col>
        <v-col class="col-md-4 col-sm-12 col-12 pt-0 pb-0" align="center">
            <v-container class="su-block-import-img" :class="[$v.imgData.$error ? 'shake-horizontal container_error' : '']">
                <input
                    type="file"
                    :id="'slider[' + number + '][file]'"
                    :name="'slider[' + number + '][file]'"
                    @input="updateImg"
                    @change="previewImage"
                    style="position:absolute;display: none; opacity: 0;"
                    accept="image/*"
                />
                <label v-if="imgData.length > 0" :for="'slider[' + number + '][file]'" class="image-preview">
                    <img class="preview" :src="imgData" />
                    <div class="clear"></div>
                    <button class="text-none v-btn v-btn_import theme--light" @click="removeImg">{{ $t("removeimg") }}</button>
                </label>
                <div v-else style="text-align: center;">
                    <label :for="'slider[' + number + '][file]'" style="display: inline-block;max-width: 100%;width: 100%;">
                        <v-icon
                            class="placeholder_img"
                            size="100"
                            :class="[drag ? 'placeholder_img-drag' : 'placeholder_img']"
                            @drop.prevent="dragDropImg"
                            @dragover.prevent
                            @dragenter="drag = true"
                            @dragend="drag = false"
                            @dragleave="drag = false"
                            >far fa-image</v-icon
                        >
                        <v-container class="text-none v-btn v-btn_import theme--light">
                            <span>{{ $t("importimg") }}</span>
                        </v-container>
                    </label>
                </div>
            </v-container>
            <div class="field_error" v-if="$v.imgData.$error">{{ $t("requiredImage") }}</div>

            <v-col cols="12" class="slider-recommandation pl-0" align="left">
                <div class="su-block-import-img-bold-text" v-t="'techcontraints'"></div>
                <div class="su-block-import-img-text" v-t="'techcontraintsText'"></div>
            </v-col>
        </v-col>
        <v-col class="col-md-8 col-sm-12 offset-sm-12 col-12 pt-0 pb-0">
            <v-row class="d-inline-flex w-100">
                <v-col class="pt-0 mr-0 col-md-8 col-sm-8 col-8" cols="8">
                    <v-radio-group
                        class="pt-0 mt-0"
                        row
                        :id="'slider[' + number + '][state]'"
                        :name="'slider[' + number + '][state]'"
                        @change="updateState"
                        v-model="state"
                        :mandatory="true"
                    >
                        <v-radio id="su-radio-show" :label="$t('show')" value="show"></v-radio>
                        <v-radio :label="$t('hide')" value="hide"></v-radio>
                        <v-radio :label="$t('plan')" value="plan"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="col-md-1 col-sm-1 col-1 pt-0" align="right">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" class="icon su-block-import-img-icon pt-0" color="#ffffff" size="20" @click="remove"
                                >fas fa-trash</v-icon
                            >
                        </template>
                        <span>{{ $t("delete") }}</span>
                    </v-tooltip>
                </v-col>
                <v-col
                    v-if="state === 'plan'"
                    class="col-md-6 col-12 pb-5 mb-2"
                    :class="[$v.dstart.$error ? 'shake-horizontal input_error' : '']"
                    style="max-height: 60px;"
                >
                    <v-menu
                        ref="menustart"
                        v-model="menustart"
                        :close-on-content-click="false"
                        :return-value.sync="dstart"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="dstart" :label="$t('datestart')" outlined readonly clearable v-on="on"></v-text-field>
                        </template>
                        <v-date-picker ref="picker" v-model="dstart" @change="updateDStart" no-title scrollable> </v-date-picker>
                    </v-menu>
                    <div v-if="$v.dstart.$error">
                        <div class="field_error_input" v-if="$v.dstart.$error">{{ $t("requiredfield") }}</div>
                    </div>
                </v-col>
                <v-col v-if="state === 'plan'" class="col-md-6 col-12 pb-5" style="max-height: 60px;">
                    <v-menu
                        ref="menuend"
                        v-model="menuend"
                        :close-on-content-click="false"
                        :return-value.sync="dend"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="dend" :label="$t('dateend')" readonly outlined clearable v-on="on"></v-text-field>
                        </template>
                        <v-date-picker ref="picker" v-model="dend" @change="updateDEnd" no-title scrollable> </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="pb-5 mb-5" style="max-height: 60px;">
                    <v-text-field
                        :id="'slider[' + number + '][url]'"
                        :name="'slider[' + number + '][url]'"
                        :label="$t('url')"
                        outlined
                        v-model="url"
                        @change="updateUrl"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import { required, requiredIf } from "vuelidate/lib/validators";

export default {
    name: "SliderBlock",
    props: {
        number: {
            type: Number,
        },
        slider: {
            type: Object,
            default: () => {
                return { file: "", state: "plan", dstart: "", dend: "", url: "" };
            },
        },
    },
    data() {
        return {
            // number: 1,
            file: "",
            state: "plan",
            imgData: "",
            dstart: "",
            dend: "",
            menustart: false,
            menuend: false,
            url: "",
            drag: false,
        };
    },
    validations: {
        imgData: {
            required,
        },
        dstart: {
            required: requiredIf(function() {
                return this.state === "plan";
            }),
        },
    },
    mounted() {
        this.state = this.slider.state;
        this.dstart = this.slider.dstart;
        this.dend = this.slider.dend;
        this.url = this.slider.url;
        this.imgData = this.slider.file;
    },
    methods: {
        touch() {
            this.$v.$reset();
            let that = this;
            setTimeout(function() {
                that.$v.$touch();
            }, 100);
        },
        remove() {
            this.$emit("remove", this.number);
        },
        update() {
            this.$emit("update", this.number, this.slider);
        },
        updateImg(img) {
            this.slider.file = img.target.files[0];
            this.$emit("update", this.slider);
        },
        dragDropImg(e) {
            let evtCopy = JSON.parse(JSON.stringify(e));
            this.drag = false;
            evtCopy.target = {};
            evtCopy.target.files = e.dataTransfer.files;
            this.updateImg(evtCopy);
            this.previewImage(evtCopy);
        },
        updateState(value) {
            this.slider.state = value;
            this.$emit("update", this.slider);
        },
        updateDStart(date) {
            this.slider.dstart = date;
            this.$refs.menustart.save(date);
            this.$emit("update", this.slider);
        },
        updateDEnd(date) {
            this.slider.dend = date;
            this.$refs.menuend.save(date);
            this.$emit("update", this.slider);
        },
        updateUrl(url) {
            this.slider.url = url;
            this.$emit("update", this.slider);
        },
        removeImg() {
            this.imgData = "";
            this.slider.file = "";
            this.$emit("removeImg", this.slider);
        },
        previewImage: function(event) {
            var input = event.target;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = e => {
                    this.imgData = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            }
        },
    },
    computed: {},
};
</script>

<style scoped lang="scss">
.slider-recommandation {
    font-family: "Gothic A1";
}
.wrapper-handle {
    display: flex;
    align-items: center;
    transform: translate(10px, 0px);
    padding: 8px;
}
.placeholder_img {
    background: #021c40;
    color: #ffffff;
    padding: 8px 60px;
    top: 0px;
    width: 100%;
    cursor: pointer;
    position: relative;
    top: 0px;
}

.placeholder_img-drag {
    color: #97c6e2;
    padding: 8px 60px;
    top: 0px;
    width: 100%;
    cursor: pointer;
    position: relative;
    top: 0px;
}

.container_loader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 15px;
    min-height: 110px;
}

.su-block-import-img-icon.icon-handle {
    color: #011c40 !important;
    background: none;
    cursor: move;
    width: auto;
    margin-right: 12px;
}

.su-block-import-img {
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
    height: 190px;
}

.su-block-import-img-icon {
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
    width: 36px;
    height: 36px;
    border-radius: 50%;
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

img.preview {
    width: auto;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 2px;
    transition: opacity 0.2s ease-in-out;
    cursor: pointer;
    max-height: 120px;
    &:hover {
        opacity: 0.5;
    }
}

.su-block-import-img {
    background: #011c40 0% 0% no-repeat padding-box;
    opacity: 1;
    /*cursor: pointer;*/
    transition: opacity ease-in-out 0.2s;
}

.tool-drive #attachment {
    background: #f2f2f2;
    padding: 30px 0;
    transition: all 0.2s;
    cursor: pointer;
    margin-bottom: 20px;
}
.su-btn-light {
    text-align: left;
    font: Medium 12px/34px Montserrat;
    letter-spacing: 0px;
    color: #011c40;
    border-radius: 7px;
    opacity: 1;
}
</style>

<i18n>
    {
    "fr": {
    "slider": "Slider ",
    "importimg": "Importer une image",
    "show": "Afficher",
    "hide": "Masquer",
    "reorder": "Déplacer",
    "delete": "Supprimer",
    "plan": "Planifier",
    "addslide": "Ajouter un slide",
    "save": "Enregistrer",
    "discard": "Annuler",
    "datestart": "Date début d'affichage",
    "dateend": "Date fin d'affichage",
    "url": "Lien de redirection",
    "removeimg": "Supprimer l'image",
    "techcontraints": "Contraintes techniques :",
    "techcontraintsText": "Format : JPEG / PNG, dimensions : 1980x400 px",
    "requiredfield": "Le champ est requis",
    "requiredImage": "L'image est requise"
    },
    "en": {
    "slider": "Slider ",
    "importimg": "Import an image",
    "show": "Display",
    "hide": "Hide",
    "reorder": "Reorder",
    "delete": "Delete",
    "plan": "Plan",
    "addslide": "Add slide",
    "save": "Save",
    "discard": "Discard",
    "datestart": "Posting start date",
    "dateend": "Posting end date",
    "url": "Redirect link",
    "removeimg": "Remove image",
    "techcontraints": "Technical constraints :",
    "techcontraintsText": "Format : JPEG / PNG, dimensions : 1980x400 px",
    "requiredfield": "The field is required",
    "requiredImage": "An image is required"
    }
    }

</i18n>
