<template>
    <div class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-inline-flex">
                <v-icon class="su-title-icon" color="white">fas fa-bars</v-icon>
                <span class="su-title" v-t="'menuService'"></span>
            </v-col>
        </v-row>
        <div class="wrapper-card mx-3">
            <draggable
                v-model="services"
                :scroll-sensitivity="300"
                :force-fallback="true"
                ghost-class="ghost"
                handle=".icon_handle"
                :animation="200"
            >
                <div
                    class="card wrapper-service mb-8 pa-0 mx-5  shadow-1"
                    :elevation="4"
                    v-for="(service, index) in services"
                    :key="service.id"
                >
                    <div class="row ma-0 d-flex align-center scroll-service px-8 py-8">
                        <div class="col-lg-2 col-md-2">
                            <span v-if="!service.name" :style="{ color: service.color }" class="subtitle">Service {{ index + 1 }}</span>
                            <span v-else class="subtitle" :style="{ color: service.color }">{{ service.name }}</span>
                        </div>
                        <div class="col-lg-3 col-md-3 py-2 l-relative">
                            <v-text-field
                                hide-details="!dirty"
                                :class="[$v.services.$each.$iter[index].name.$error ? 'shake-horizontal input_error' : '']"
                                v-model="service.name"
                                label="Service name"
                                outlined
                            >
                            </v-text-field>
                            <div class="field_error_input_2" v-if="$v.services.$each.$iter[index].name.$error">
                                {{ $t("requiredfield") }}
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 py-2 colorPicker">
                            <v-text-field hide-details="!dirty" v-model="service.color" label="color" outlined>
                                <template v-slot:append>
                                    <v-menu top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                        <template v-slot:activator="{ on }">
                                            <div
                                                v-on="on"
                                                :style="{
                                                    backgroundColor: service.color,
                                                    cursor: 'pointer',
                                                    height: '30px',
                                                    width: '30px',
                                                    transition: 'border-radius 200ms ease-in-out;',
                                                    borderRadius: true ? '50%' : '3px;',
                                                }"
                                            />
                                        </template>
                                        <v-card>
                                            <v-card-text class="pa-0">
                                                <v-color-picker v-model="service.color" flat />
                                            </v-card-text>
                                        </v-card>
                                    </v-menu>
                                </template>
                            </v-text-field>
                        </div>
                        <div class="col-lg-2 col-md-2 py-2 l-relative">
                            <v-text-field append-icon="fas fa-info-circle"
                                          hide-details="!dirty"
                                          v-model="service.roles"
                                          label="Rôles"
                                          outlined
                            >
                                <v-tooltip slot="append" top>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" >fas fa-info-circle</v-icon>
                                    </template>
                                    <span>Veuillez séparer les rôles par les virgules</span>
                                </v-tooltip>
                            </v-text-field>
                        </div>
                        <div class="col-lg-2 col-md-2 d-flex justify-end">
                            <v-icon
                                class="icon icon_rounded mx-1"
                                @click="removeService(service.id)"
                                :style="{ backgroundColor: service.color }"
                                >fa fa-trash</v-icon
                            >
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon class="icon icon_rounded icon_handle mx-1" :style="{ backgroundColor: service.color }"
                                        >fa fa-align-justify</v-icon
                                    >
                                </template>
                                <span>{{ $t("reorder") }}</span>
                            </v-tooltip>
                        </div>
                    </div>
                    <draggable
                        :list="service.subservices"
                        :scroll-sensitivity="300"
                        :force-fallback="true"
                        ghost-class="ghost"
                        handle=".icon_handle-subservice"
                        :animation="200"
                    >
                        <div class="ma-0" v-for="(subservice, jindex) in service.subservices" :key="subservice.id">
                            <div
                                :class="[subServicesOpen.includes(service.id) ? 'd-flex' : 'd-none']"
                                class="px-8 py-5 wrapper-subservices align-center l-separate_top flex-wrap"
                            >
                                <div class="col-lg-2 col-md-2 col-sm-12 py-0">
                                    <span v-if="!subservice.name" class="subtitle" :style="{ color: service.color }"
                                        >Sous-service {{ jindex + 1 }}</span
                                    >
                                    <span v-else class="subtitle" :style="{ color: service.color }">{{ subservice.name }}</span>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 py-5 d-flex align-center justify-center flex-column">
                                    <label
                                        :for="service.id + '-' + subservice.id"
                                        class="wrapper-pictogram"
                                        :class="[
                                            $v.services.$each.$iter[index].subservices.$each.$iter[jindex].pictogram.$error
                                                ? 'shake-horizontal container_error'
                                                : '',
                                        ]"
                                        :style="{ backgroundColor: service.color }"
                                    >
                                        <v-icon v-if="!subservice.pictogram" color="#fff" class="icon icon_lg icon_light"
                                            >fa fa-plus</v-icon
                                        >
                                        <img
                                            v-if="subservice.pictogram"
                                            class="wrapper-pictogram"
                                            :id="'img-' + service.id + '-' + subservice.id"
                                            :style="{ backgroundColor: service.color }"
                                            :src="subservice.pictogram"
                                        />
                                        <img
                                            v-else
                                            class="wrapper-pictogram"
                                            :id="'img-' + service.id + '-' + subservice.id"
                                            style="display: none;"
                                            src="#"
                                        />
                                    </label>
                                    <div class="subtitle subtitle_thin" :style="{ color: service.color }">Picto</div>
                                    <div
                                        class="field_error"
                                        v-if="$v.services.$each.$iter[index].subservices.$each.$iter[jindex].pictogram.$error"
                                    >
                                        {{ $t("requiredfield") }}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        @change="previewPicto($event, service.id, subservice.id)"
                                        @input="updatePicto($event, service.id, subservice.id)"
                                        :id="service.id + '-' + subservice.id"
                                        :name="subservice.pictogram"
                                        style="position:absolute;display: none; opacity: 0;"
                                    />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-12 py-5">
                                    <v-text-field
                                        :class="[
                                            $v.services.$each.$iter[index].subservices.$each.$iter[jindex].name.$error
                                                ? 'shake-horizontal input_error'
                                                : '',
                                        ]"
                                        hide-details="!dirty"
                                        v-model="subservice.name"
                                        label="Subservice name"
                                        outlined
                                    ></v-text-field>
                                    <div
                                        class="field_error"
                                        v-if="$v.services.$each.$iter[index].subservices.$each.$iter[jindex].name.$error"
                                    >
                                        {{ $t("requiredfield") }}
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-12 py-0">
                                    <v-text-field hide-details="!dirty" v-model="subservice.link" label="Lien du service" outlined>
                                    </v-text-field>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-12 py-0">
                                    <v-text-field append-icon="fas fa-info-circle"
                                                  hide-details="!dirty"
                                                  v-model="subservice.roles"
                                                  label="Rôles"
                                                  outlined
                                    >
                                        <v-tooltip slot="append" top>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" >fas fa-info-circle</v-icon>
                                            </template>
                                            <span>Veuillez séparer les rôles par les virgules</span>
                                        </v-tooltip>
                                    </v-text-field>
                                </div>

                                <div class="col-lg-2 col-md-2 d-flex justify-end">
                                    <v-icon
                                        class="icon icon_rounded mx-1"
                                        :style="{ backgroundColor: service.color }"
                                        @click="removeSubservice(service.id, subservice.id)"
                                        >fa fa-trash</v-icon
                                    >
                                    <v-icon
                                        class="icon icon_rounded icon_handle-subservice mx-1"
                                        :style="{ backgroundColor: service.color }"
                                        >fa fa-align-justify</v-icon
                                    >
                                </div>
                            </div>
                            <div
                                v-if="jindex + 1 == service.subservices.length && subServicesOpen.includes(service.id)"
                                class="row ma-0 wrapper-subservices_add l-separate_top d-flex justify-space-around pa-3"
                                @click="addSubService(service.id)"
                            >
                                <v-icon class="icon icon_default icon_lg" :style="{ color: service.color }">fa fa-plus</v-icon>
                            </div>
                        </div>
                        <div
                            class="col-12 d-flex justify-center wrapper-chevron"
                            @click="onServicesToggle(service.id)"
                            :style="{ backgroundColor: service.color }"
                        >
                            <v-icon
                                :class="[subServicesOpen.includes(service.id) ? 'toggle-up' : 'toggle-down']"
                                class="icon icon_default icon_light icon_lg toggle"
                                >fas fa-chevron-down</v-icon
                            >
                        </div>
                    </draggable>
                </div>
            </draggable>
        </div>
        <v-row class="d-flex mx-3">
            <v-col class="col-sm-5 col-12 ">
                <v-btn class="d-flex justify-space-around su-btn-light" @click="addService">
                    <v-icon class="icon icon_default" size="15">fas fa-plus</v-icon>
                    {{ $t("addService") }}
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="col-sm-7 col-12 d-flex justify-end">
                <v-btn @click="getServices">{{ $t("discard") }}</v-btn>
                <div v-if="saveLoader" class="container_loader ml-5">
                    <rotate-square2></rotate-square2>
                </div>
                <v-btn v-else class="btn_primary ml-5" @click="saveServices">{{ $t("save") }}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import { RotateSquare2, } from "vue-loading-spinner";
import { required, requiredIf, } from "vuelidate/lib/validators";

export default {
    name: "Services",
    components: {
        RotateSquare2,
        draggable,
    },
    data: function() {
        return {
            menu: true,
            saveLoader: false,
            loader: {
                saveService: false,
                getService: false,
            },
            services: [
                {
                    id: 1,
                    name: "",
                    color: "#011C40",
                    roles: "",
                    subservices: [{ id: 1, name: "", pictogram: "", link: "", roles: "",},],
                },
            ],
            subServicesOpen: [],
            imgData: {},
        };
    },
    validations: {
        services: {
            required,
            $each: {
                name: {
                    required,
                },
                subservices: {
                    required,
                    $each: {
                        name: {
                            required,
                        },
                        pictogram: {
                            // required,
                        },
                    },
                },
            },
        },
    },
    watch: {},
    computed: {},
    mounted() {
        this.getServices();
    },
    methods: {
        addService() {
            this.services.push({
                id: this.services.reduce((prev, current) => (+prev.id > +current.id ? prev : current)).id + 1,
                name: "",
                color: "#309975",
                roles: "",
                subservices: [{ id: 1, name: "", pictogram: "", link: "", roles: "",},],
            });
            setTimeout(
                () => document.querySelector(".wrapper-service:last-child").scrollIntoView({ block: "start", behavior: "smooth", }),
                100,
            );
        },
        addSubService(serviceId) {
            this.services
                .find(service => service.id === serviceId)
                .subservices.push({
                    id:
                        this.services
                            .find(service => service.id === serviceId)
                            .subservices.reduce((prev, current) => (+prev.id > +current.id ? prev : current)).id + 1,
                    name: "",
                    pictogram: "",
                    link: "",
                    roles: "",
                });
        },
        removeService(serviceId) {
            let filterServices = this.services.filter(function(service) {
                return service.id !== serviceId;
            });
            this.services = [...filterServices,];
            if (this.services.length === 0) {
                this.services.push({
                    id: 1,
                    name: "",
                    color: "#011C40",
                    roles: "",
                    subservices: [{ id: 1, name: "", pictogram: "", link: "", roles: "",},],
                });
            }
        },
        removeSubservice(serviceId, subServiceId) {
            let filterSubservices = this.services
                .find(service => service.id === serviceId)
                .subservices.filter(function(subservice) {
                    return subservice.id !== subServiceId;
                });
            this.services.find(service => service.id === serviceId).subservices = [...filterSubservices,];
            if (this.services.find(service => service.id === serviceId).subservices.length === 0) {
                this.services
                    .find(service => service.id === serviceId)
                    .subservices.push({
                        id: 1,
                        name: "",
                        pictogram: "",
                        link: "",
                        roles: "",
                    });
            }
        },
        saveServices() {
            this.saveLoader = true;
            if (this.$v.$invalid) {
                this.saveLoader = false;
                this.$v.$touch();
            } else {
                let bucket = this.$store.getters.config.brand.drive.bucket,
                    bucketPath = this.$store.getters.config.brand.drive.bucketPath,
                    ecomApi = this.$store.getters.config.brand.ecom.api,
                    formData = new FormData(),
                    nfile = 0;

                formData.append("bucket", bucket);
                formData.append("bucketPath", bucketPath);
                formData.append("services", JSON.stringify(this.services));

                this.services.forEach((service, serId) => {
                    if (!service.roles) service.roles = [];
                    if (service.roles.length > 0 && typeof service.roles !== "object") service.roles = service.roles.split(",");
                    service.subservices.forEach((sub, subId) => {
                        if (!sub.roles) sub.roles = [];
                        if (sub.roles.length > 0 && typeof service.roles !== "object") sub.roles = sub.roles.split(",");
                        if (sub.pictogram) {
                            if (typeof sub.pictogram === "object") {
                                formData.append(`files[${serId}${subId}]`, sub.pictogram);
                                nfile++;
                            }
                        }
                    });
                });

                this.$axios
                    .post("/proxy", formData, {
                        headers: {
                            "x-su-proxyrest-url": ecomApi + "/conf/services",
                            "Content-Type": nfile ? "multipart/form-data" : "application/json",
                        },
                    })
                    .then(data => {
                        this.saveLoader = false;
                        console.log("POST OK", data);
                        this.$toast.success(this.$t("save-message"));
                    })
                    .catch(err => {
                        this.saveLoader = false;
                        console.log(err);
                        this.$toast.error(this.$t("error-message"));
                    });
            }
        },
        getServices() {
            let ecomApi = this.$store.getters.config.brand.ecom.api;
            this.$axios
                .get("/proxy", {
                    cache: { ignoreCache: true },
                    headers: {
                        "x-su-proxyrest-url": ecomApi + "/conf/services?force=true",
                    },
                })
                .then(data => {
                    if (data.data.message.length > 0) {
                        // console.log("GET OK : ", data.data.message.length);
                        this.services = data.data.message;
                        this.services.forEach(async (service, serId) => {
                            await this.onServicesToggle(parseInt(serId + 1));
                            service.subservices.forEach((sub, subId) => {
                                // if (sub.pictogram) {
                                //     let imgid = "img-" + parseInt(serId + 1) + "-" + parseInt(subId + 1);
                                // document.getElementById(imgid).src = sub.pictogram;
                                // }
                            });
                        });
                        this.subServicesOpen = [];
                        this.saveLoader = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        updatePicto(e, serviceId, subserviceId) {
            const file = e.target.files[0];
            let currentUserService = this.services
                .find(service => service.id === serviceId)
                .subservices.find(subservice => subservice.id === subserviceId);
            currentUserService.pictogram = file;
        },
        async previewPicto(e, idSer, idSub) {
            let input = e.target;
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = e => {
                    let img = document.getElementById("img-" + idSer + "-" + idSub);
                    img.src = e.target.result;
                };
                await reader.readAsDataURL(input.files[0]);
            }
        },
        onServicesToggle(serviceId) {
            if (!this.subServicesOpen.includes(serviceId)) {
                this.subServicesOpen.push(serviceId);
            } else {
                let filterService = this.subServicesOpen.filter(function(service) {
                    return service !== serviceId;
                });
                this.subServicesOpen = [...filterService,];
            }
        },
    },
};
</script>

<style scoped lang="scss">
.wrapper-card {
    max-height: calc(100vh - 250px);
    overflow: auto;
    overflow-x: hidden;
}
.wrapper-service {
    flex-direction: column;
}

.wrapper-subservices_add {
    background: #f3f3f3;
}

.wrapper-subservices_add {
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    &:hover {
        background: darken(#f3f3f3, 8%);
    }
}

.card {
    /*max-height: calc(100vh - 250px);*/
}
.wrapper-chevron {
    background: rgba(#011c40, 0.5);
    max-height: 44px;
    padding: 0px;
    cursor: pointer;
    border-radius: 0 0 3px 3px;
    transition: opacity 0.3s ease-in-out;
    &:hover {
        opacity: 0.8;
    }
}
.toggle {
    transition: all 0.3s ease-in-out;
}
.toggle-up {
    transform: rotate(180deg);
}

.toggle-down {
    transform: rotate(0);
}

img.wrapper-pictogram {
    object-fit: contain;
}
.wrapper-pictogram {
    max-width: 60px;
    max-height: 60px;
    height: 60px;
    width: 100%;
    border-radius: 3px;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.fadeHeight-enter-active,
.fadeHeight-leave-active {
    transition: all 0.3s ease-in-out;
    max-height: 300px;
}
.fadeHeight-enter,
.fadeHeight-leave-to {
    opacity: 0;
    max-height: 0px;
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
</style>

<i18n>
    {
    "fr": {
    "addService": "Ajouter un regroupement",
    "save": "Enregistrer",
    "discard": "Annuler",
    "menuService": "Menu Service",
    "url": "Lien de redirection",
    "requiredfield": "Le champ est requis"
    },
    "en": {
    "addService": "Add a groupment",
    "save": "Save",
    "discard": "Discard",
    "menuService": "Service Menu",
    "url": "Redirect link",
    "requiredfield": "the field is require"
    }
    }
</i18n>
