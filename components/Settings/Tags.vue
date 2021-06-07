<template lang="html">
    <section class="tags">
        <v-row style="margin-bottom: 15px;">
            <v-col cols="12" style="margin:0; padding: 0;">
                <v-btn
                    dark
                    :color="$transparentPrimary90"
                    style="float:left; height: 56px; width: 100%"
                    :ripple="false"
                    @click="addToggle = !addToggle"
                >
                    <v-icon v-if="!addToggle">fa fa-plus</v-icon>
                    <v-icon v-if="addToggle">fa fa-times</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-expand-transition>
            <v-container v-show="addToggle">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>{{ $t("addCategory") }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="12" style="margin:0; padding: 0;">
                                    <v-text-field :label="$t('name')" filled v-model="newCatName"></v-text-field>
                                </v-col>
                                <v-col cols="12" style="margin:0; padding: 0;">
                                    <v-btn
                                        dark
                                        :color="$transparentPrimary90"
                                        style="float:left; height: 56px; width: 100%"
                                        :ripple="false"
                                        @click="addCat"
                                    >
                                        {{ $t("save") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header @click="loadCat">{{ $t("addTag") }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="12" style="margin:0; padding: 0;">
                                    <v-text-field :label="$t('field-tags')" filled v-model="newTagName"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-textarea label="Description" v-model="desc" filled></v-textarea>
                            </v-row>
                            <v-row>
                                <v-col cols="6" sm="6" md="6">
                                    <v-menu
                                        ref="menuBegin"
                                        v-model="menuBegin"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="dateBeginFormatted"
                                                :label="$t('dateBegin')"
                                                persistent-hint
                                                fill
                                                prepend-icon="fa-calendar-alt"
                                                @blur="dateBegin = parseDate(dateBeginFormatted)"
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="dateBegin" no-title @input="menuBegin = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="6" sm="6" md="6">
                                    <v-menu
                                        ref="menuEnd"
                                        v-model="menuEnd"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                        v-if="endDateToggle"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="dateEndFormatted"
                                                :label="$t('dateEnd')"
                                                persistent-hint
                                                fill
                                                prepend-icon="fa-calendar-alt"
                                                @blur="dateEnd = parseDate(dateEndFormatted)"
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="dateEnd" no-title @input="menuEnd = false"></v-date-picker>
                                    </v-menu>
                                    <v-switch v-model="endDateToggle" :label="$t('endDateEnabled')"></v-switch>
                                </v-col>
                                <v-col cols="12">
                                    <v-autocomplete
                                        v-model="newTagCat"
                                        :items="categoryList"
                                        chips
                                        item-text="name"
                                        item-value="id"
                                        multiple
                                        :label="$t('category')"
                                        filled
                                        return-object
                                        :ripple="false"
                                    >
                                        <template v-slot:selection="data">
                                            <v-chip
                                                v-bind="data.attrs"
                                                :input-value="data.selected"
                                                close
                                                @click="data.select"
                                                @click:close="remove(data.item)"
                                            >
                                                {{ data.item.name }}
                                            </v-chip>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn
                                        v-for="color in colors"
                                        :key="color"
                                        class="mx-2"
                                        fab
                                        dark
                                        small
                                        :color="color"
                                        @click="newSelectedColor = color"
                                        style="margin-bottom: 20px;"
                                    >
                                        <v-icon v-if="newSelectedColor === color">fas fa-check</v-icon>
                                    </v-btn>
                                </v-col>

                                <v-col cols="12">
                                    <groups-roles v-model="rolesList"></groups-roles>
                                </v-col>

                                <v-col cols="12" style="margin:0; padding: 0;">
                                    <v-btn
                                        dark
                                        :color="$transparentPrimary90"
                                        style="float:left; height: 56px; width: 100%"
                                        :ripple="false"
                                        @click="addTag"
                                    >
                                        {{ $t("saveTag") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-container>
        </v-expand-transition>
        <v-flex :style="{ height: '2px', backgroundColor: $transparentPrimary40, marginTop: '20px', marginBottom: '20px' }"></v-flex>
        <v-flex>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>Global</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-tooltip v-for="tag in tagsAlone" :key="tag.id">
                            <template v-slot:activator="{ on }">
                                <v-chip
                                    close
                                    @click:close="deleteTags(tag.id)"
                                    @click="editTags(tag)"
                                    v-on="on"
                                    style="margin-right: 10px;"
                                    label
                                >
                                    <v-icon left :color="tag.info.color">fas fa-tag</v-icon>

                                    {{ tag.name }}
                                </v-chip>
                            </template>
                            <span>Tooltip</span>
                        </v-tooltip>
                        <template v-if="tagsAlone.length === 0">
                            <v-alert text color="primary">
                                <v-flex text-center>
                                    {{ $t("no-tags") }}
                                </v-flex>
                            </v-alert>
                        </template>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-for="(category, i) in tagList" :key="i">
                    <v-expansion-panel-header>{{ category.name }}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row style="margin-bottom: 20px;">
                            <v-flex text-center>
                                <v-btn @click="editCategory(category)">{{ $t("edit") }}</v-btn>
                                <v-btn @click="deleteCat(category)" style="margin-left: 10px;">{{ $t("remove") }}</v-btn>
                            </v-flex>
                        </v-row>
                        <v-tooltip v-for="tag in category.tags" :key="tag.id">
                            <template v-slot:activator="{ on }">
                                <v-chip
                                    close
                                    @click:close="deleteTags(tag.id)"
                                    @click="editTags(tag)"
                                    v-on="on"
                                    style="margin-right: 10px;"
                                >
                                    <v-icon left :color="tag.info.color">fas fa-tag</v-icon>

                                    {{ tag.name }}
                                </v-chip>
                            </template>
                            <span>Tooltip</span>
                        </v-tooltip>
                        <template v-if="category.tags.length === 0">
                            <v-alert text color="primary">
                                <v-flex text-center>
                                    {{ $t("no-tags") }}
                                </v-flex>
                            </v-alert>
                        </template>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-flex>

        <modal v-model="editModal" @close="editTag = null">
            <v-container v-if="editTag">
                <v-row>
                    <v-col cols="12" style="margin:0; padding: 0;">
                        <v-text-field :label="$t('field-tags')" filled v-model="editTag.name"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-textarea label="Description" v-model="editTag.info.comment" filled></v-textarea>
                </v-row>
                <v-row>
                    <v-col cols="6" sm="12" md="6">
                        <v-menu
                            ref="menuBegin"
                            v-model="menuEditBegin"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-model="editTag.dateBegin"
                                    :label="$t('dateBegin')"
                                    persistent-hint
                                    fill
                                    prepend-icon="fa-calendar-alt"
                                    @blur="dateBegin = parseDate(editTag.dateBegin)"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="dateBegin" no-title @input="menuEditBegin = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6" sm="12" md="6">
                        <v-menu
                            ref="menuEnd"
                            v-model="menuEditEnd"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                            v-if="endDateToggle"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-model="editTag.dateEnd"
                                    :label="$t('dateEnd')"
                                    persistent-hint
                                    fill
                                    prepend-icon="fa-calendar-alt"
                                    @blur="dateEnd = parseDate(editTag.dateEnd)"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="dateEnd" no-title @input="menuEditEnd = false"></v-date-picker>
                        </v-menu>
                        <v-switch v-model="endDateToggle" :label="$t('endDateEnabled')"></v-switch>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete
                            v-model="editCat"
                            :items="categoryList"
                            chips
                            item-text="name"
                            item-value="id"
                            multiple
                            :label="$t('category')"
                            filled
                            return-object
                            :ripple="false"
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                    v-bind="data.attrs"
                                    :input-value="data.selected"
                                    close
                                    @click="data.select"
                                    @click:close="remove(data.item)"
                                >
                                    {{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-btn
                            v-for="color in colors"
                            :key="color"
                            class="mx-2"
                            fab
                            dark
                            small
                            :color="color"
                            @click="editTag.info.color = color"
                            style="margin-bottom: 20px;"
                        >
                            <v-icon v-if="editTag.info.color === color">fas fa-check</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12">
                        <groups-roles v-model="rolesList"></groups-roles>
                    </v-col>

                    <v-col cols="12" style="margin:0; padding: 0;">
                        <v-btn
                            dark
                            :color="$transparentPrimary90"
                            style="float:left; height: 56px; width: 100%"
                            :ripple="false"
                            @click="saveEdit"
                        >
                            <v-icon>fa fa-pen</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </modal>
        <modal v-model="editCatModal">
            <v-container>
                <v-row>
                    <v-col cols="12" style="margin:0; padding: 0;">
                        <v-text-field :label="$t('name')" filled v-model="editCatName"></v-text-field>
                    </v-col>
                    <v-col cols="12" style="margin:0; padding: 0;">
                        <v-btn
                            dark
                            :color="$transparentPrimary90"
                            style="float:left; height: 56px; width: 100%"
                            :ripple="false"
                            @click="saveEditCat"
                        >
                            {{ $t("save") }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </modal>
    </section>
</template>

<script lang="js">

import Modal from "../Core/Modal";
import GroupsRoles from "../Core/GroupsRoles";
export default  {
    name: 'tags',
    components: {GroupsRoles, Modal,},
    props: [],
    mounted() {
        this.getTags();

    },
    data() {
        return {
            editCatModal: false,
            newCatName: "",
            categoryList: [],
            editModal: false,
            addToggle: false,
            tagList: [],
            tagsAlone: [],
            newTagCat: [],
            newTagName: "",
            menuBegin: false,
            menuEditBegin: false,
            menuEditEnd: false,
            menuEnd: false,
            newSelectedColor: "#FFB900",
            dateBegin: new Date().toISOString().substr(0, 10),
            dateEnd: new Date().toISOString().substr(0, 10),
            dateBeginFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
            dateEndFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
            endDateToggle: true,
            desc: "",
            editTag: null,
            editCat: [],
            colors: ["#FFB900",
                "#F7630C",
                "#DA3B01",
                "#D13438",
                "#E74856",
                "#EA005E",
                "#E3008C",
                "#C239B3",
                "#0078D7",
                "#8E8CD8",
                "#8764B7",
                "#B146C2",
                "#0099BC",
                "#00B7C3",
                "#00B294",
                "#00CC6A",
                "#7A7574",
                "#68768A",
                "#567C73",
                "#498205",
                "#767676",
                "#69797E",
                "#647C64",
                "#847545",
            ],
            editCatId: null,
            editCatName: "",
            rolesList: [],
        }
    },
    computed: {
        computedDateFormatted () {
            return this.formatDate(this.date)
        },
    },
    watch: {
        dateBegin () {
            if (this.editTag === null){
                this.dateBeginFormatted = this.formatDate(this.dateBegin)
            } else {
                this.editTag.dateBegin = this.formatDate(this.dateBegin);
            }
        },
        dateEnd () {
            if (this.editTag === null){
                this.dateEndFormatted = this.formatDate(this.dateEnd)
            } else {
                this.editTag.dateEnd = this.formatDate(this.dateEnd);
            }
        },
    },

    methods: {
        editCategory(cat){
            this.editCatName = cat.name;
            this.editCatId = cat.id;
            this.editCatModal = true;
        },
        saveEditCat(){
            this.$axios.patch("/tags/category/" + this.editCatId, {name: this.editCatName,}).then(() => {
                this.editCatName = "";
                this.editCatModal = false;
                this.$toast.success(this.$t("success"));
                this.getTags();
                this.loadCat();

            });
        },
        remove (item) {
            this.newTagCat.splice(this.newTagCat.findIndex(e => e.id === item.id), 1);
            this.$delete(this.newTagCat, item.id);
        },
        editTags(tag){
            this.editCat = [];

            this.$axios.get("/tags/" + tag.id).then((resp) => {
                Object.assign(this.editCat, resp.data.categories);
                this.editTag = resp.data;
                if (Object.keys(resp.data).includes('date_end')){
                    console.log(tag.date_end);

                    this.endDateToggle = true;
                    this.editTag.dateEnd = this.formatDate(tag.date_end.substring(0, 10));
                } else {
                    this.endDateToggle = false;
                    this.editTag.dateEnd = this.formatDate(new Date().toISOString().substr(0, 10));
                }
                if (Object.keys(this.editTag).includes('groups')){
                    this.editTag.groups.forEach((item) => {
                        this.rolesList.push(item.id);
                    })
                }
                this.loadCat();
                this.editModal = true;
                this.editTag.dateBegin = this.formatDate(tag.date_begin.substring(0, 10));;

            });
            // this.editTag = tag;



        },
        saveEdit(){
            let data = {
                name: this.editTag.name,
                comment: this.editTag.info.comment,
                dateBegin: this.editTag.dateBegin,
                color: this.editTag.info.color,
                roles: JSON.stringify(this.rolesList),
            };

            if (this.endDateToggle){
                data.dateEnd =  this.editTag.dateEnd;
            }

            if (this.editTag.dateBegin >= this.editTag.dateEnd && this.endDateToggle){
                this.$toast.error(this.$t("errorDate"));
                return ;
            }

            let cats = [];
            for (let item of this.editCat) {
                cats.push(item.id);
            }
            data.category = cats;

            this.$axios.patch("/tags/" + this.editTag.id, data).then(() => {
                this.$toast.success(this.$t("successedit"));
                this.editTag = null;
                this.editModal = false;
                this.getTags();
                this.rolesList = [];

            });
        },
        formatDate (date) {
            if (!date) return null;

            const [year, month, day,] = date.split('-');
            return `${day}/${month}/${year}`
        },
        loadCat(){
            this.$axios.get("/tags/category/list?cache=false").then((result) => {
                this.categoryList = result.data;
            });
        },
        parseDate (date) {
            if (!date) return null;

            const [day, month, year,] = date.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        addCat(){
            this.$axios.post("/tags/category", {name: this.newCatName,}).then(() => {
                this.newCatName = "";
                this.addToggle = false;
                this.$toast.success(this.$t("success"));
                this.getTags();
                this.loadCat();
            });

        },
        async deleteCat(cat){
            let res = await this.$confirm(this.$t('a-y-s'));
            if (res){
                await this.$axios.delete("/tags/category/" + cat.id).then(() => {
                    this.$toast.success(this.$t("success.deleted"));
                    this.getTags();
                });
            }
        },
        addTag(){
            let data = {
                name: this.newTagName,
                comment: this.desc,
                dateBegin: this.dateBeginFormatted,
                color: this.newSelectedColor,
                roles: JSON.stringify(this.rolesList),
            };

            if (this.endDateToggle){
                data.dateEnd =  this.dateEndFormatted;
            }

            let cats = [];
            for (let item of this.newTagCat) {
                cats.push(item.id);
            }
            data.category = cats;
            if (this.dateBegin >= this.dateEnd && this.endDateToggle){
                this.$toast.error(this.$t("errorDate"));
                return ;
            }
            if (this.newTagName.length === 0){
                this.$toast.error(this.$t("empty"));
                return ;
            }
            this.$axios.post("/tags", data).then(() => {
                this.newTagName = "";
                this.desc = "";
                this.dateBeginFormatted = this.formatDate(new Date().toISOString().substr(0, 10));
                this.dateEndFormatted = this.formatDate(new Date().toISOString().substr(0, 10));
                this.$toast.success(this.$t("success"));
                this.getTags();
                this.addToggle = false;
                this.newTagCat = [];
                this.rolesList = [];
            });
        },
        async deleteTags(id){
            let res = await this.$confirm(this.$t("delete"));
            if (res){
                try {
                    await this.$axios.delete("/tags/" + id);
                    this.getTags();
                } catch(err){
                    console.error(err);
                    if(err.response.status === 400)
                        this.$toast.error(this.$t('error.deleted'));
                }
            }
        },
        getTags(){
            this.$axios.get("/tags/category?cache=false").then((resp)=>{
                this.tagList = resp.data.categories;
                this.tagsAlone = resp.data.alone;

            });
        },
    },
}
</script>

<style scoped lang="scss">
.tags {
    text-align: left;
    padding: 2rem;
}
</style>

<i18n>
    {
        "fr": {
            "delete": "Êtes-vous sûr de vouloir supprimer ce tag ?",
            "no-tags": "Il n'y a pas de tags",
            "field-tags": "Ajouter un tag",
            "success" : "Tag ajouté avec succès",
            "dateBegin": "Date de début",
            "dateEnd": "Date de fin",
            "errorDate": "La date de fin doit être supérieure à celle du début",
            "successedit": "Edition effectuée!",
            "saveTag": "Enregistrer mon tag",
            "addTag": "Ajouter un tag",
            "addCategory": "Ajouter une catégorie",
            "none": "Aucun",
            "category": "Catégorie",
            "remove": "Supprimer",
            "a-y-s": "Êtes-vous sûr de vouloir supprimer ceci?",
            "endDateEnabled": "Activez une date de fin"
        },
        "en": {
            "delete": "Are you sure ?",
            "no-tags": "No tags",
            "field-tags": "Add Tag",
            "success" : "Success!",
            "dateBegin": "Beginning date",
            "dateEnd": "Ending date",
            "errorDate": "Endding date should be higher than beginning date",
            "successedit": "Edit done!",
            "saveTag": "Save my tag",
            "addTag": "Add a tag",
            "addCategory": "Add a category",
            "non": "None",
            "category": "Category",
            "remove": "Remove",
            "a-y-s": "Are you sure?",
            "endDateEnabled": "End date activate"

    }
    }
</i18n>
