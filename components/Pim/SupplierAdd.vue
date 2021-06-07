<template>
    <v-flex class="mx-sm-5 mx-0">
        <v-row>
            <v-col cols="12" class="d-inline-flex">
                <v-icon class="su-title-icon" color="white">fas fa-truck</v-icon>
                <span class="su-title" v-t="'addsupplier'"></span>
            </v-col>
        </v-row>
        <v-row class="d-flex">
            <v-col class="col-md-7 col-12">
                <div class="su-import-block-white">
                    <v-row>
                        <v-col cols="12">
                            <span v-t="'addsupplierAccess'" class="su-import-block-white-title"></span>
                        </v-col>
                        <v-col cols="6" class="d-flex col-md-6 col-12" align="center">
                            <v-text-field
                                v-model="newSupplier.firstname"
                                class="su-text-field"
                                :label="$t('firstname')"
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" class="d-flex col-md-6 col-12" align="center">
                            <v-text-field
                                v-model="newSupplier.lastname"
                                class="su-text-field"
                                :label="$t('lastname')"
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" class="d-flex col-md-6 col-12" align="center">
                            <v-text-field
                                v-model="newSupplier.email"
                                class="su-text-field"
                                :label="$t('email')"
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex col-md-6 col-12" align="center">
                            <subscriber-autocomplete
                                    v-if="$isGranted('PIM_ADMIN')"
                                    v-model="suppliers"
                                    class="su-text-field"
                                    height="56px"
                                    :label="$t('supplier')"
                                    :search-extra="$store.getters.config.brand.extra.supplier"
                                    colorBack="white"
                                    solo
                                    flat
                                    :no-data-text="$t('StartTypingNameOfAProvider')"
                                    short-list
                                    hide-no-data
                                    multiple
                            ></subscriber-autocomplete>
                        </v-col>
                        <v-col cols="12">
                            <v-btn class="su-btn-light px-5 float-right" :disabled="sending" color="#A2D4F2" @click="sendNewSupplier">{{ $t("add") }}</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col class="col-md-5 col-12">
                <div class="su-import-block-blue">
                    <v-row>
                        <v-col cols="12">
                            <span v-t="'supplier'" class="su-import-block-blue-title"></span>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <span v-t="'supplier_info'" class="su-import-block-blue-subtitle"></span><br />
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-flex>
</template>

<script>
import SubscriberAutocomplete from "@/components/Core/Subscriber/SubscriberAutocomplete";
import { required, email } from "vuelidate/lib/validators";

export default {
    name: "SupplierAdd",
    components: {
        SubscriberAutocomplete
    },
    data() {
        return {
            newSupplier: {
                firstname: "",
                lastname: "",
                email: ""
            },
            suppliers: null,
            sending: false
        };
    },
    validations: {
        newSupplier: {
            firstname: { required },
            lastname: { required },
            email: { required, email },
        },
    },
    mounted() {
    },
    methods: {
        sendNewSupplier() {
            this.sending = true;
            let params = {
                supplier: {
                    customId: this.newSupplier.email,
                    name: this.newSupplier.firstname + ' ' + this.newSupplier.lastname,
                    email: this.newSupplier.email,
                    customFields : { SupplierId: null, Suppliers: []}
                },
                automationId: this.$store.getters.config.brand.automation.createUser
            };

            if (this.$isGranted("PIM_ADMIN")) {
                Object.keys(this.suppliers).forEach((key) => {
                    params.supplier.customFields.Suppliers.push(key);
                });
                // params.supplier.customFields.SupplierId = this.supplier?.customId;
            } else {
                params.supplier.customFields.Suppliers.push(this.$store.getters.supplierId());
            }


            if (!params.supplier.customFields.Suppliers) {
                this.$toast.error(this.$t("supplierMissing"));
                return;
            }

            this.$axios
                .post(`/pim/supplier/add/${params.supplier.customFields.SupplierId}`, params
                )
                .then((data) => {
                    this.$toast.success(this.$t("save-message"));
                })
                .catch(err => {
                    this.$toast.error(this.$t("error-message"));
                    console.log(err);
                });

            this.sending = false;
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
    padding: 15px;
    padding-left: 30px;
    padding-right: 30px;
    height: 100%;
}

.su-import-block-blue {
    background: transparent linear-gradient(123deg, #5faad9 0%, #023473 100%) 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #9dceff29;
    opacity: 1;
    border-radius: 13px;
    padding: 15px;
    padding-left: 30px;
    padding-right: 30px;
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

.su-text-field {
    background: #ffffff 0% 0% no-repeat padding-box;
    /*box-shadow: 0px 3px 6px #011C4066;*/
    border-radius: 10px;
    /*opacity: 1;*/
}
</style>

<i18n>
    {
    "fr": {
    "addsupplier": "Ajouter un fournisseur",
    "addsupplierAccess": "Ajouter un fournisseur pour lui donner accès à l'interface",
    "firstname": "Prénom",
    "lastname": "Nom",
    "email": "Email",
    "add": "Ajouter",
    "required": "Champs requis",
    "invalid-email": "Email n'est pas valid",
    "supplier": "Fournisseur",
    "supplier_info": "Créez ici un accès pour votre (vos) collègue(s) qui participeront à la création ou la mise à jour de vos informations produits.",
    "recordslist": "Historique des imports",
    "supplierMissing": "Founisseur manquant",
    "save-message": "Un e-mail va être envoyé à votre utilisateur",
    "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
    },
    "en": {
    "addsupplier": "Add supplier",
    "addsupplierAccess": "Add a supplier to grant him access to the interface",
    "firstname": "First name",
    "lastname": "Last name",
    "email": "Email",
    "add": "Add",
    "required": "Required field",
    "invalid-email": "Invalid email",
    "supplier": "Supplier",
    "supplier_info": "Create here an access for your colleague(s) who will participate in the creation or update of your product information.",
    "recordslist": "Import records",
    "supplierMissing": "Supplier missing",
    "save-message": "E-mail has been sent to your new user",
    "StartTypingNameOfAProvider": "Start typing the name of a provider"
    }
    }
</i18n>
