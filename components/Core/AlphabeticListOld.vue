<template lang="html">
    <section class="alphabetic-list">
        <!-- Header -->
        <v-layout v-if="showHeader" py-3 px-2 :style="{ backgroundColor: $transparentPrimary90, color: '#ffffff' }">
            <template v-if="Object.keys(columns).length > 0">
                <template v-for="(col, index) in Object.values(columns)">
                    <v-flex
                        v-if="col.id !== 'id' && (col.showBreakPoint ? $vuetify.breakpoint[col.showBreakPoint] : true)"
                        :key="col.id"
                        :class="['font-weight-bold', 'text-capitalize', index === 0 ? 'offset-xs1' : 'text-center']"
                    >
                        {{ col.label[$i18n.locale] || col.label }}
                    </v-flex>
                </template>
                <!-- Col action -->
            </template>
            <template v-else>
                <v-flex :class="['font-weight-bold', 'text-capitalize', 'offset-xs1']">
                    <span v-t="'custom-col'"></span>
                </v-flex>
            </template>
            <!--            <template v-if="remove">-->
            <!--                <v-flex xs12 :class="['font-weight-bold', 'text-capitalize', 'offset-xs1']"> </v-flex>-->
            <!--            </template>-->
        </v-layout>

        <!-- Body -->
        <v-layout v-if="showBody && list.length >= 0" column color="primary" class="body">
            <!-- Block per letter -->
            <v-flex mt-3 v-for="a in getAlphabet()" :key="a">
                <!-- Line Letter -->

                <v-layout v-if="showLetters">
                    <v-flex xs1 pa-2 class="primary--text" :style="{ borderBottom: 'solid ' + $transparentPrimary90 + ' 2px' }">
                        <span class="pl-3">{{ a }}</span>
                    </v-flex>
                </v-layout>

                <!-- Line Data -->
                <v-layout
                    pa-2
                    class="line border-bottom"
                    v-for="(item, indexLine) in getItemStartWith(a)"
                    :key="a + '_' + indexLine"
                    @click="$emit('show', item)"
                >
                    <template v-for="(colName, indexCol) in getItem(columns)">
                        <v-flex
                            xs12
                            v-if="
                                columns[colName] && columns[colName].showBreakPoint
                                    ? $vuetify.breakpoint[columns[colName].showBreakPoint]
                                    : true
                            "
                            :class="[indexCol !== 0 ? 'text-center' : showLetters ? 'offset-xs1' : 'text-left']"
                            :key="indexCol"
                        >
                            <slot :name="'item.' + colName" v-bind="item">
                                <!-- If in column definition is configured to show values as chip, else show in span -->
                                <template v-if="columns[colName].chip">
                                    <template v-if="item[colName]">
                                        <v-chip
                                            v-for="value in item[colName].split(',')"
                                            :key="value"
                                            :color="getChipColor(colName, value)"
                                            label
                                            dark
                                            :title="value"
                                            class="mr-1"
                                            small
                                        >
                                            {{ getValueToShow(colName, item, getChipText(colName, value)) }}
                                        </v-chip>
                                    </template>
                                </template>
                                <span v-else v-text="getValueToShow(colName, item)"></span>
                                <template v-if="chips && colName === chips.after && checkChipsVal(item)">
                                    <v-chip style="margin-left: 10px; margin-bottom: 5px;" small :color="chips.color">
                                        {{ chips.message[$i18n.locale] }}
                                    </v-chip>
                                </template>
                                <template v-if="colName === 'name'">
                                    <v-chip
                                        style="margin-left: 10px; margin-bottom: 5px;"
                                        small
                                        color="error"
                                        v-if="item.payload.enabled === '0'"
                                    >
                                        {{ $t("deactivate") }}
                                    </v-chip>
                                </template>
                            </slot>
                        </v-flex>

                        <v-flex :key="indexCol + 1" v-if="btnRemove && indexCol === lastItem" xs2 text-center>
                            <v-btn color="error" fab x-small px-2 ml-1 @click.stop="$emit('remove', item, item.type)">
                                <v-icon small>fas fa-trash</v-icon>
                            </v-btn>
                        </v-flex>
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </section>
</template>

<script lang="js">
export default {
    name: "alphabetic-list",
    props: {
        chips:{
            type: Object,
            default: null,
        },
        list: {
            type: Array,
            required: true,
        },
        columns: {
            type: Object,
            required: true,
        },
        orderBy: {
            type: String,
            required: true,
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showBody: {
            type: Boolean,
            default: true,
        },
        showLetters: {
            type: Boolean,
            default: true,
        },
        background: {
            type: Boolean,
            default: true,
        },
        btnRemove: Boolean,
    },
    data() {
        return {
            alphabet: [],
            lastItem: 0,
        };
    },
    created() {
        this.alphabet = this.genCharArray("0", "Z");
        this.alphabet.push("("); // Hack to  avoid undefined label
        this.alphabet.push(undefined); // Hack to  avoid undefined label
    },
    mounted(){
    },
    methods: {
        checkChipsVal(item){
            if(this.chips){
                if (this.chips.field.substring(0,3) === "cf_"){
                    if (this.chips.value === item.payload.customFields[this.chips.field.substring(3)]){
                        return true;
                    }
                }
                else {
                    if (this.chips.value === item.payload[this.chips.field]){
                        return true;
                    }
                }
            }
            return false;
        },
        getItemStartWith(letter) {
            return this.list.filter((item) => {
                return item[this.orderBy || null]?.charAt(0).toUpperCase() === letter?.toUpperCase();
            });
        },
        hasItem(letter) {
            return !!this.getItemStartWith(letter).length;
            // for (let item of this.list) {
            //     if (item[this.orderBy].charAt(0).toUpperCase() === letter.toUpperCase()) {
            //         return true;
            //     }
            // }
            // return false;
        },
        getAlphabet() {
            return this.alphabet.filter((letter) => {
                return this.hasItem(letter);
            });
        },
        genCharArray(charA, charZ) {
            let a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
            for (; i <= j; ++i) {
                a.push(String.fromCharCode(i));
            }
            return a;
        },
        getItem(object) {

            const keys = Object.keys(object);
            this.lastItem = keys.length - 1;

            return keys;
        },
        getValueToShow(columnKey, item, value){
            let val = value || item[columnKey];
            if(this.columns[columnKey].initial){
                val = this.$options.filters.initial(val);
            }
            return val;
        },
        getChipColor(colname, value) {

            if (this.columns[colname].chips && this.columns[colname].chips.hasOwnProperty(value)) {
                return this.columns[colname].chips[value].color;
            }
            return this.$options.filters.randomColorClass(value);
        },
        getChipText(colname, value) {

            if (this.columns[colname].chips && this.columns[colname].chips.hasOwnProperty(value) && this.columns[colname].chips[value].text) {
                return this.columns[colname].chips[value].text;
            }

            return value;
        },
    },
    watch: {
        list(){
            // Detect change and redisplay
            // console.log(this.list);
        },
    },
    computed: {},
};
</script>

<style scoped lang="scss">
.alphabetic-list {
    height: auto;

    .body {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 0;
        }

        .line {
            cursor: pointer;
            transition: all 0.2s ease;
            /*color: var(--v-primary-base);*/
            color: rgba(0, 0, 0, 0.87);
            &:hover {
                background-color: #eee;
            }

            .theme--dark.v-icon {
                color: inherit;
            }
        }
    }

    .round-btn {
        border-radius: 50%;
        margin-top: -8px;
        height: 30px;
        width: 30px;
        text-align: center;
        cursor: pointer;
        background-color: var(--v-secondary-base);
        color: var(--v-primary-base);
        .v-icon {
            font-size: 0.7rem;
        }
    }
}
</style>

<i18n>
{
    "en": {
        "deactivate": "desactivated"

    },
    "fr": {
        "deactivate": "Désactivé"
    }
}

</i18n>
