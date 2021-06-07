<template lang="html">
    <v-row class="settings px-2">
        <v-tabs grow show-arrows v-model="active" slider-color="primary">
            <v-tab ripple key="general">
                <span v-t="'general'"></span>
            </v-tab>
            <v-tab ripple key="account">
                <span v-t="'account'"></span>
            </v-tab>
            <v-tab ripple key="tags" v-if="$store.getters.isGranted('TAGS_CREATE')">Tags</v-tab>
            <v-tab ripple key="groups" v-if="$store.getters.isGranted('GROUPS_CREATE')">{{ $t("groups") }}</v-tab>

            <v-tabs-items v-model="active">
                <v-tab-item key="general">
                    <v-col cols="12">
                        <global></global>
                    </v-col>
                </v-tab-item>

                <v-tab-item key="account">
                    <v-col cols="12">
                        <account></account>
                    </v-col>
                </v-tab-item>

                <v-tab-item key="tags" v-if="$store.getters.isGranted('TAGS_CREATE')">
                    <v-col cols="12">
                        <tags></tags>
                    </v-col>
                </v-tab-item>
                <v-tab-item key="groups" v-if="$store.getters.isGranted('GROUPS_CREATE')">
                    <v-col cols="12">
                        <groups></groups>
                    </v-col>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>
    </v-row>
</template>

<script lang="js">
import CrmComponentMixin from "@/mixins/CrmComponentMixin";
import Global from "../components/Settings/Global";
import Account from "../components/Settings/Account";
import Tags from "../components/Settings/Tags";
import settingsLocal from "@/components/Settings/i18n";
import Groups from "../components/Settings/Groups";

export default {
    name: "Settings",
    components: {Groups, Global, Account, Tags, },
    mixins: [CrmComponentMixin,],
    props: {
        properties: {},
    },
    i18n: {messages: settingsLocal,},
    data() {
        return {
            active: null,
        };
    },
    methods: {},
    created() {

    },
    mounted() {

    },
};
</script>

<style scoped lang="scss"></style>

<i18n>
    {
        "fr": {
            "general": "Général",
            "account": "Compte",
            "groups": "Groupes"
        },
        "en": {
            "general": "General",
            "account": "Account",
            "groups": "Groups"
        }
    }
</i18n>
