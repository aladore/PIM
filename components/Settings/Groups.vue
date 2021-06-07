<template lang="html">
    <section class="groups">
        <!--creation or edition modal-->
        <modal v-model="editGrpModal" v-if="Object.keys(editGrp).length > 1">
            <v-form v-model="valid">
                <v-row style="margin:0;">
                    <v-col cols="12">
                        <v-text-field filled v-model="editGrp.info.name" :label="$t('name')" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            filled
                            v-model="editGrp.name"
                            :rules="[v => !!v || $t('required')]"
                            :label="$t('short-name')"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea filled v-model="editGrp.info.description" label="Description"> </v-textarea>
                    </v-col>
                    <v-col
                        cols="12"
                        v-if="
                            Object.keys(cfg).includes('globalProperties') && Object.keys(cfg.globalProperties).includes('rolesAvailaible')
                        "
                    >
                        <h4>{{ $t("roles") }}</h4>
                        <template v-for="(role, key) in cfg.globalProperties.rolesAvailaible">
                            <v-tooltip bottom :key="key">
                                <template v-slot:activator="{ on }">
                                    <v-chip class="ma-2" label v-on="on" @click="clickRoles(role)">
                                        <span v-if="editGrp.roles.includes(role)" style="margin-right: 10px;">
                                            <v-icon small color="primary">fas fa-check</v-icon>
                                        </span>
                                        {{ role }}
                                    </v-chip>
                                </template>

                                <span> {{ Object.keys(texts).includes(role) ? texts[role][$i18n.locale] : role }}</span>
                            </v-tooltip>
                        </template>
                    </v-col>
                    <v-col cols="12" style="margin:0; padding: 0;">
                        <v-btn
                            dark
                            :color="$transparentPrimary90"
                            style="float:left; height: 56px; width: 100%"
                            :ripple="false"
                            @click="saveGrp"
                        >
                            {{ $t("save") }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </modal>

        <!--creation button-->
        <v-row style="margin: 0; margin-bottom: 20px;">
            <v-col cols="12" style="margin:0; padding: 0;">
                <v-btn
                    dark
                    :color="$transparentPrimary90"
                    style="float:left; height: 56px; width: 100%"
                    :ripple="false"
                    @click="createGroup"
                >
                    {{ $t("create-group") }}
                </v-btn>
            </v-col>
        </v-row>

        <!--user list modal-->
        <modal v-model="listUserModalToggle">
            <v-row style="margin: 0">
                <v-col cols="12">
                <v-text-field
                        filled
                        :label="$t('search')"
                        prepend-icon="fas fa-search"
                        v-model="searchUser"
                ></v-text-field>
                </v-col>
            </v-row>
            <v-list avatar>
                <v-list-item-group>
                <v-list-item v-for="(user, key) in listUser" :key="key">
                    <v-list-item-avatar>
                        <span :class="'color' + userColor[key]">{{ user.name | initial }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title style="text-truncate" @click="loadSubs(user)">{{ user.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                </v-list-item-group>
            </v-list>
        </modal>

        <!--groups list-->
        <v-expansion-panels>
            <v-expansion-panel v-for="(item, i) in groupsList" :key="i">
                <v-expansion-panel-header
                    @click="
                        massiveAddUser = false;
                        subscribers = {};
                    "
                    >{{ item.info && item.info.name ? item.info.name : item.name }}</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                    <v-flex text-center>
                        <v-btn @click="massiveAddUser = !massiveAddUser">{{ $t("add-user") }}</v-btn>
                        <v-btn style="margin-left: 10px;" @click="listUserModal(item)">{{ $t("see-user") }}</v-btn>
                        <v-btn style="margin-left: 10px;" @click="editGroup(item)">{{ $t("edit") }}</v-btn>
                        <v-btn style="margin-left: 10px;" @click="removeGrp(item)">{{ $t("remove") }}</v-btn>
                    </v-flex>
                    <v-expand-transition>
                        <v-row v-show="massiveAddUser">
                            <v-col cols="12" md="11">
                                <action-subscriber-list v-model="subscribers"></action-subscriber-list>
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="addUserToGroup(item)">{{ $t("add") }}</v-btn>
                            </v-col>
                        </v-row>
                    </v-expand-transition>

                    <v-flex> {{ $t("short-name") }} : {{ item.name }}</v-flex>
                    <v-flex>
                        {{ item.info && item.info.description ? item.info.description : "" }}
                    </v-flex>
                    <template v-for="(role, key) in item.roles">
                        <v-tooltip bottom :key="key">
                            <template v-slot:activator="{ on }">
                                <v-chip class="ma-2" label v-on="on">
                                    {{ role }}
                                </v-chip>
                            </template>
                            <span>{{ Object.keys(texts).includes(role) ? texts[role][$i18n.locale] : role }}</span>
                        </v-tooltip>
                    </template>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </section>
</template>

<script lang="js">

import Modal from "../Core/Modal";
import axiosLocal from "axios";
import {Tools,} from "../../utils/Tools";


export default  {
    name: 'groups',
    components: {Modal,},
    props: [],
    mounted() {
        this.getTexts();
        this.getGroups();
    },
    data() {
        return {
            groupsList: [],
            texts: {},
            editGrpModal: false,
            editGrp: {},
            valid: false,
            cfg: this.$store.getters.config,
            subscribers: {},
            massiveAddUser: false,
            listUserModalToggle: false,
            listUser: [],
            userColor: [],
            searchUser: "",
            curGroup: null,
        }
    },
    computed: {
    },
    watch: {
        searchUser: Tools.debounce(
            function (){
                this.listUserModal(this.curGroup)
            }
        )
    },

    methods: {
        loadSubs(item){
            let route = item.type === 0 ? "Third" : "Contact";
            let url = this.$router.resolve({ name: "main", params: { page: route, id: item.id, }, });
            window.open(url.href, '_blank');
        },
        listUserModal(item){
            this.curGroup = item;
            this.userColor = [];
            this.$axios.get('/groups/'+item.id+'/users?s='+this.searchUser).then((resp)=>{
                resp.data.forEach((item) => {
                    this.userColor.push(Tools.randomColor(item.name));
                });
                this.listUser = resp.data;
            });
            this.listUserModalToggle = true;
        },
        addUserToGroup(item){
            let data = {users: Object.keys(this.subscribers),};
            this.$axios.post('/groups/' + item.id + '/users', data).then(() => {
                this.massiveAddUser = false;
                this.subscribers = {};
                this.$toast.success(this.$t('success-user'));
                this.getGroups();
            });
        },
        createGroup(){
            this.editGrp = {
                name: "",
                roles: [],
                info: {
                    name: "",
                    description: "",
                },
            };
            this.editGrpModal = true;
        },
        async removeGrp(item){
            let res = await this.$confirm(this.$t("ays"));
            if (res) {
                this.$axios.delete("/groups/" + item.id).then(() => {
                    this.$toast.success(this.$t("success.deleted"));
                    this.getGroups();
                });
            }
        },
        saveEditGrp(){
            console.log(this.editGrp);
            this.$axios.patch('/groups/' + this.editGrp.id, this.editGrp).then(() => {
                this.$toast.success(this.$t('success-saved'));
                this.editGrp = {};
                this.getGroups();
            });
        },
        saveCreateGrp(){
            this.$axios.post('/groups', this.editGrp).then(() => {
                this.$toast.success(this.$t('success-saved'));
                this.editGrp = {};
                this.getGroups();
            });
        },
        saveGrp(){
            var letters = /^[A-Z]+$/;
            if(!this.editGrp.name.match(letters)) {
                this.$toast.error(this.$t('error-name'));
                return;
            }

            if (Object.keys(this.editGrp).includes('id')){
                this.saveEditGrp();
            } else {
                this.saveCreateGrp();
            }
            this.editGrpModal = false;
        },
        clickRoles(role){
            if (this.editGrp.roles.includes(role)){
                this.remove(role);
            } else {
                this.editGrp.roles.push(role);
            }
        },
        remove(item){
            let i = 0;
            this.editGrp.roles.forEach((element) => {

                if (element === item){
                    this.editGrp.roles.splice(i, 1);
                    return (true);
                }
                i += 1;
            });
        },
        editGroup(item){
            this.editGrp = JSON.parse(JSON.stringify(item));
            if (!Object.keys(this.editGrp).includes('info') || !Object.keys(this.editGrp.info).includes('name') || !Object.keys(this.editGrp.info).includes('description')){
                this.editGrp.info = {
                    name: "",
                    description: "",
                }
            }
            this.editGrpModal = true;
        },
        async getTexts(){
            let resp = await axiosLocal.get("roles.json");
            this.texts = resp.data;
        },
        getGroups(){
            this.$axios.get('/groups?cache=false').then((resp) => {
                this.groupsList = resp.data;
            });
        },
    },
}
</script>

<style scoped lang="scss">
.groups {
    text-align: left;
    padding: 2rem;
}

.v-avatar span {
    border-radius: 0;
    margin-left: 0;
    width: 30px;
    height: 30px;
    font-size:.8rem;
}
</style>

<i18n>
    {
        "fr": {
            "remove": "Supprimer",
            "short-name": "Nom court",
            "roles": "Rôles",
            "create-group": "Créer un groupe",
            "required": "Requis",
            "ays": "Êtes-vous sûr ?",
            "success-saved": "Enregistré avec succés",
            "error-name": "Le nom court doit être uniquement composé de lettres majuscules",
            "add-user": "Ajout d'utilisateurs",
            "add": "Ajouter",
            "success-user": "Utilisateur(s) ajouté(s)",
            "see-user": "Voir les utilisateurs"
        },
        "en": {
            "remove": "Remove",
            "short-name": "Short name",
            "roles": "Roles",
            "create-group": "Create group",
            "required": "Required",
            "ays": "Are you sure ?",
            "success-saved": "Saved done",
            "error-name": "Short name should be Upper case alphabetical letter only",
            "add-user": "Add users",
            "add": "Add",
            "success-user": "Success",
            "see-user": "See user"
    }
    }
</i18n>
