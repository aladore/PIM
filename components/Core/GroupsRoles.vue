<template>
    <v-expansion-panels>
        <v-expansion-panel>
            <v-expansion-panel-header>
                {{ text ? text : $t("role") }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-chip v-for="(item, i) in groupsList" :key="i" class="ma-2" label @click="toggleRole(item)">
                    <span v-if="rolesList.includes(item.id)" style="margin-right: 10px;">
                        <v-icon small color="primary">fas fa-check</v-icon>
                    </span>
                    {{ item.info && item.info.name ? item.info.name : item.name }}
                </v-chip>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
export default {
    name: "GroupsRoles",
    props: ["value", "text"],
    data() {
        return {
            rolesList: this.value,
            groupsList: [],
        };
    },
    mounted() {
        this.getGroups();
    },
    methods: {
        getGroups() {
            this.$axios.get("/groups?cache=false").then(resp => {
                this.groupsList = resp.data;
            });
        },
        toggleRole(role) {
            if (this.rolesList.includes(role.id)) {
                this.remove(role);
            } else {
                this.rolesList.push(role.id);
            }
        },
        remove(item) {
            let i = 0;
            this.rolesList.forEach(element => {
                if (element === item.id) {
                    this.rolesList.splice(i, 1);
                    return true;
                }
                i += 1;
            });
        },
    },
    watch: {
        value() {
            this.rolesList = this.value;
        },
        rolesList() {
            this.$emit("input", this.rolesList);
        },
    },
};
</script>

<style scoped></style>
<i18n>
    {
    "fr": {
    "role":"Permissions de lecture"
    },
    "en": {
    "role": "Reading permission"
    }
    }
</i18n>
