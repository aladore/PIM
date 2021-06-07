<template>
    <div class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-inline-flex">
                <v-icon class="su-title-icon" color="white">fas fa-exclamation-circle</v-icon>
                <span class="su-title" v-t="'alert'"></span>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-col cols="12">
                <div class="su-import-block-white" :key="index">
                    <v-row>
                        <v-col cols="12">
                            <span v-t="'alertconfig'" class=" su-title"></span>
                        </v-col>
                    </v-row>
                    <div class="wrapper-alert">
                        <v-row class="px-1">
                            <v-col cols="12">
                                <v-radio-group row :mandatory="true" v-model="alert.state">
                                    <v-radio :label="$t('show')" value="show"></v-radio>
                                    <v-radio :label="$t('hide')" value="hide"></v-radio>
                                    <v-radio :label="$t('plan')" value="plan"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-row class="px-1">
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pr-md-10" v-if="alert.state === 'plan'">
                                <v-menu
                                    ref="menustart"
                                    v-model="menustart"
                                    :close-on-content-click="false"
                                    :return-value.sync="alert.dstart"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :class="[$v.alert.dstart.$error ? 'shake-horizontal input_error' : '']"
                                            v-model="alert.dstart"
                                            :label="$t('datestart')"
                                            outlined
                                            readonly
                                            clearable
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker ref="picker" @change="updateDStart" v-model="alert.dstart" no-title scrollable>
                                    </v-date-picker>
                                </v-menu>
                                <div class="field_error_input" v-if="$v.alert.dstart.$error">{{ $t("requiredfield") }}</div>
                            </v-col>
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pl-md-10" v-if="alert.state === 'plan'">
                                <v-menu
                                    ref="menuend"
                                    v-model="menuend"
                                    :close-on-content-click="false"
                                    :return-value.sync="alert.dend"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="alert.dend"
                                            :label="$t('dateend')"
                                            readonly
                                            outlined
                                            clearable
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker ref="picker" v-model="alert.dend" @change="updateDEnd" no-title scrollable>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row class="px-1">
                            <v-textarea
                                :class="[$v.alert.message.$error ? 'shake-horizontal input_error' : '']"
                                :placeholder="$t('message')"
                                solo
                                class="px-3"
                                v-model="alert.message"
                            ></v-textarea>
                        </v-row>
                        <div class="field_error_input" v-if="$v.alert.message.$error">{{ $t("requiredfield") }}</div>
                        <v-row class="px-1">
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pr-md-10 colorPicker">
                                <v-text-field v-model="alert.colorAlert" hide-details class="ma-0 pa-0" :label="$t('colorAlert')" outlined>
                                    <template v-slot:append>
                                        <v-menu
                                            v-model="menuClrAlert"
                                            top
                                            nudge-bottom="105"
                                            nudge-left="16"
                                            :close-on-content-click="false"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <div :style="swatchStyleAlert" v-on="on"></div>
                                            </template>
                                            <v-card>
                                                <v-card-text class="pa-0">
                                                    <v-color-picker v-model="alert.colorAlert" flat />
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pl-md-10 colorPicker">
                                <v-text-field v-model="alert.colorText" hide-details class="ma-0 pa-0" :label="$t('colorText')" outlined>
                                    <template v-slot:append>
                                        <v-menu
                                            v-model="menuClrText"
                                            top
                                            nudge-bottom="105"
                                            nudge-left="16"
                                            :close-on-content-click="false"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <div :style="swatchStyleText" v-on="on"></div>
                                            </template>
                                            <v-card>
                                                <v-card-text class="pa-0">
                                                    <v-color-picker v-model="alert.colorText" flat />
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="px-1">
                            <v-col class="col-md-4 col-sm-4 col-12 py-0">
                                <v-checkbox :label="$t('showBtn')" v-model="alert.showBtn"> </v-checkbox>
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row class="px-1" v-if="alert.showBtn">
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pr-md-10 colorPicker">
                                <v-text-field v-model="alert.colorBtn" hide-details class="ma-0 pa-0" :label="$t('colorBtn')" outlined>
                                    <template v-slot:append>
                                        <v-menu v-model="menuClrBtn" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                            <template v-slot:activator="{ on }">
                                                <div :style="swatchStyleBtn" v-on="on"></div>
                                            </template>
                                            <v-card>
                                                <v-card-text class="pa-0">
                                                    <v-color-picker v-model="alert.colorBtn" flat />
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pl-md-10 colorPicker">
                                <v-text-field
                                    v-model="alert.colorBtnLabel"
                                    hide-details
                                    class="ma-0 pa-0 input-color"
                                    :label="$t('colorBtnText')"
                                    outlined
                                >
                                    <template v-slot:append>
                                        <v-menu
                                            v-model="menuClrBtnLabel"
                                            top
                                            nudge-bottom="105"
                                            nudge-left="16"
                                            :close-on-content-click="false"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <div :style="swatchStyleBtnLabel" v-on="on"></div>
                                            </template>
                                            <v-card>
                                                <v-card-text class="pa-0">
                                                    <v-color-picker v-model="alert.colorBtnLabel" flat />
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pr-md-10 py-0">
                                <v-text-field :label="$t('url')" v-model="alert.alertBtnUrl" ref="alertBtnUrl" outlined></v-text-field>
                            </v-col>
                            <v-col cols="6" class="col-md-6 col-sm-12 col-12 pl-md-10 py-0">
                                <v-text-field v-model="alert.alertBtnLabel" :label="$t('btnLabel')" ref="btnLabel" outlined></v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-spacer></v-spacer>
            <v-col class="col-12">
                <div v-if="saveLoader" class="container_loader">
                    <rotate-square2></rotate-square2>
                </div>
                <v-btn v-else class="su-btn-dark ml-5 float-right" color="#011C40" @click="save">{{ $t("save") }}</v-btn>
                <v-btn class="su-btn-light px-5 float-right" color="#A2D4F2" @click="getAlert">{{ $t("cancel") }}</v-btn>
            </v-col>
        </v-row>
        <v-row :class="[activeAlert ? 'slide-in-bottom' : 'slide-out-bottom']" class="d-flex pa-0 alert_default">
            <v-col class="alert-content" :style="{ 'background-color': alert.colorAlert }">
                <span class="alert-content-message" :style="{ color: alert.colorText }" v-if="alert.message == ''">{{
                    $t("messageDefault")
                }}</span>
                <span class="alert-content-message" :style="{ color: alert.colorText }" v-else>{{ alert.message }}</span>
                <span v-if="alert.showBtn" :style="{ 'background-color': alert.colorBtn }" class="alert-btn">
                    <a target="_blank" :href="alert.alertBtnUrl" :style="{ color: alert.colorBtnLabel }">{{ alert.alertBtnLabel }}</a>
                </span>
                <span class="alert-close" @click="alertClosed = true" :style="{ color: alert.colorText }">X</span>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { required, requiredIf, } from "vuelidate/lib/validators";
import { RotateSquare2, } from "vue-loading-spinner";

export default {
    name: "Alert",
    components: {
        RotateSquare2,
    },
    data: function() {
        return {
            alert: {},
            menustart: false,
            menuend: false,
            index: 1,
            saveLoader: false,
            alertClosed: false,
            menuClrAlert: false,
            menuClrText: false,
            menuClrBtn: false,
            menuClrBtnLabel: false,
        };
    },
    validations: {
        alert: {
            message: {
                required,
            },
            dstart: {
                required: requiredIf(function() {
                    return this.alert.state === "plan";
                }),
            },
        },
    },
    computed: {
        activeAlert: function() {
            if (!this.alertClosed && (this.alert.state === "plan" || this.alert.state === "show")) {
                return true;
            } else {
                return false;
            }
        },
        swatchStyleAlert: function() {
            const menu = this;
            return {
                backgroundColor: this.alert.colorAlert,
                cursor: "pointer",
                height: "30px",
                width: "30px",
                borderRadius: menu ? "50%" : "4px",
                transition: "border-radius 200ms ease-in-out",
            };
        },
        swatchStyleText: function() {
            const menu = this;
            return {
                backgroundColor: this.alert.colorText,
                cursor: "pointer",
                height: "30px",
                width: "30px",
                borderRadius: menu ? "50%" : "4px",
                transition: "border-radius 200ms ease-in-out",
            };
        },
        swatchStyleBtn: function() {
            const menu = this;
            return {
                backgroundColor: this.alert.colorBtn,
                cursor: "pointer",
                height: "30px",
                width: "30px",
                borderRadius: menu ? "50%" : "4px",
                transition: "border-radius 200ms ease-in-out",
            };
        },
        swatchStyleBtnLabel: function() {
            const menu = this;
            return {
                backgroundColor: this.alert.colorBtnLabel,
                cursor: "pointer",
                height: "30px",
                width: "30px",
                borderRadius: menu ? "50%" : "4px",
                transition: "border-radius 200ms ease-in-out",
            };
        },
    },
    mounted() {
        this.alert = {};
        this.getAlert();
    },
    methods: {
        updateDStart(date) {
            this.alert.dstart = date;
            this.$refs.menustart.save(date);
        },
        updateDEnd(date) {
            this.alert.dend = date;
            this.$refs.menuend.save(date);
        },
        save() {
            this.saveLoader = true;
            if (this.$v.$invalid) {
                this.saveLoader = false;
                this.$v.$touch();
            } else {
                let ecomApi = this.$store.getters.config.brand.ecom.api,
                    data = {};

                data.alert = this.alert;

                this.$axios
                    .post("/proxy", data, {
                        headers: {
                            "x-su-proxyrest-url": ecomApi + "/conf/alert",
                        },
                    })
                    .then(data => {
                        this.saveLoader = false;
                        this.$toast.success(this.$t("saveMessage"));
                    })
                    .catch(err => {
                        console.log(err);
                        this.saveLoader = false;
                        this.$toast.error(this.$t("errorMessage"));
                    });
            }
        },
        getAlert() {
            this.alert = {};
            let ecomApi = this.$store.getters.config.brand.ecom.api;
            this.$axios
                .get("/proxy", {
                    cache: { ignoreCache: true },
                    headers: {
                        "x-su-proxyrest-url": ecomApi + "/conf/alert?force=true",
                    },
                })
                .then(data => {
                    this.alert = data.data.message[0];
                })
                .catch(err => {
                    console.log(err);
                });
            this.index++;
        },
    },
};
</script>

<style scoped lang="scss">
.clear {
    clear: both;
}

.wrapper-alert {
    overflow: auto;
    max-height: calc(100vh - 320px);
    overflow-x: hidden;
    width: 100%;
    padding: 0 15px;
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
    padding: 15px;
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
</style>

<i18n>
 {
 "fr": {
 "alert": "Alerte",
 "alertconfig": "Configuration d'une alerte pop-up sur le site",
 "show": "Afficher",
 "hide": "Masquer",
 "plan": "Planifier",
 "datestart": "Date début d'affichage",
 "dateend": "Date fin d'affichage",
 "message": "Saisir le message à faire apparaître",
 "url": "Lien de redirection du bouton",
 "btnLabel": "Texte du bouton",
 "showBtn": "Afficher bouton",
 "requiredfield": "Le champ est requis",
 "messageDefault": "Mon message personnalisé",
 "saveMessage": "Alerte a bien été enregistrée.",
 "errorMessage": "Une erreur est survenue. Veuillez réessayer ultérieurement.",
 "colorAlert": "Couleur de l'alerte",
 "colorText": "Couleur du texte",
 "colorBtn": "Couleur du bouton",
 "colorBtnText": "Couleur du label"
 },
 "en": {
 "alert": "Alert",
 "alertconfig": "Setting up a pop-up alert on the website",
 "show": "Display",
 "hide": "Hide",
 "plan": "Plan",
 "datestart": "Posting start date",
 "dateend": "Posting end date",
 "message": "Enter the message to be displayed",
 "url": "Button redirection link",
 "btnLabel": "Button label",
 "showBtn": "Display button",
 "requiredfield": "the field is require",
 "messageDefault": "My personalised message",
 "saveMessage": "Alert has been saved.",
 "errorMessage": "An error has occurred. Please try again.",
 "colorAlert": "Alert color",
 "colorText": "Text color",
 "colorBtn": "Button color",
 "colorBtnText": "Button label color"
 }
}
</i18n>
