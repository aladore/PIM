<template>
    <v-flex>
        <v-row>
            <v-col cols="12" md="12" class="py-0 text-center">
                <div class="welcome">
                    <h1 class="font-weight-light pt-8" v-t="'welcome'"></h1>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-3">
            <v-col cols="12" md="12" class="py-0 text-center">
                <iframe
                    v-if="properties.url"
                    :src="properties.url"
                    width="100%"
                    height="1000px;"
                    frameborder="0"
                    :style="'border-radius: ' + properties.borderRadius + 'px'"
                ></iframe>
            </v-col>
        </v-row>
        <modal v-model="dialog" :v-show="true">
            <template v-if="suppliers">
                <v-col cols="12" class="mb-5">
                    <span>{{ $t("whichSupplier") }}</span>
                </v-col>
                <v-radio-group v-model="supplierId">
                    <v-col cols="12" class="px-10" v-for="(supp, key) in suppliers" :key="key">
                        <v-radio :value="supp.sId" :label="supp.sId +' - '+ supp.name"></v-radio>
                    </v-col>
                </v-radio-group>
            </template>
            <template slot="actions">
                <v-spacer></v-spacer>
                <v-btn text v-t="'cancel'" @click="dialog = false"></v-btn>
                <v-btn text color="primary" v-t="'save'" @click="saveSupplier"></v-btn>
            </template>
        </modal>
    </v-flex>
</template>

<script>
import Modal from "../Core/Modal";

export default {
    components: { Modal },
    props: {
        properties: {
            type: Object,
            default() {
                return {
                    url: "",
                    borderRadius: 0,
                };
            },
        },
    },
    data() {
        return {
            dialog: false,
            suppliers: null,
            supplierId: null,
        };
    },
    created() {
        if (!sessionStorage["su-supplier-id"]) {
            if (
                this.$store.getters.app("user").customFields.hasOwnProperty("Suppliers") &&
                this.$store.getters.app("user").customFields["Suppliers"].length > 1
            ) {
                this.dialog = true;
                this.suppliers = [];
                this.$store.getters.app("user").customFields.Suppliers.forEach(sId => {
                    JSON.parse(sessionStorage.getItem("su-list-suppliers")).forEach(supp => {
                        if(supp["_source"].customId === sId) {
                            this.suppliers.push({ sId: sId, name: supp["_source"].name});
                        }
                    });
                });
            }
        } else if (!this.$store.getters.app("user").customFields.hasOwnProperty("SupplierId")) {
            sessionStorage.removeItem("su-supplier-id");
        }
    },
    methods: {
        saveSupplier() {
            this.dialog = false;
            console.log(this.supplierId);
            sessionStorage["su-supplier-id"] = this.supplierId;
        },
    },
};
</script>

<style scoped lang="scss">
.clear {
    clear: both;
}

.su-icon {
    display: inline-block;
    width: 110px;
    height: 110px;
    margin-top: 30px;
    margin-bottom: 60px;
    padding: 20px;
    border-radius: 50%;
    background-color: #011c40;
    /*background: #011C40 0% 0% no-repeat padding-box;*/
}

.welcome {
    background: transparent linear-gradient(260deg, #5faad9 0%, #023473 100%) 0% 0% no-repeat;
    border-radius: 8px;
    opacity: 1;
    text-transform: uppercase;
    height: 100px;
    font: Semi Bold 27px/39px Montserrat;
    letter-spacing: 1px;
    color: white;
}

.works {
    margin-top: 20px;
    border-radius: 8px;
    background-color: white;
    height: 350px;
}
</style>

<i18n>
    {
        "fr": {
            "welcome": "Bienvenue sur la plateforme référencement produits",
            "whichSupplier": "Sur quel compte fournisseur souhaitez vous travailler ?",
            "subtitle": ""
        },
        "en": {
            "welcome": "Welcome",
            "whichSupplier": "Which supplier account would you like to work on?",
            "subtitle": ""
        }
    }
</i18n>
