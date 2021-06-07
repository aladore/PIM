<template lang="html">
    <section class="alphabetic-list">
        <v-data-table
            :hide-default-header="!showHeader"
            hide-default-footer
            :headers="headers"
            :items="list"
            :sort-by="orderBy"
            disable-sort
            :server-items-length="serverItemsLength"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            fixed-header
            :height="relativeHeight"
            :loading="loading"
            class="clickable"
        >
            <template v-slot:top="data">
                <slot name="top" v-bind="data"></slot>
            </template>

            <template v-slot:item="{ item, headers }">
                <tr @click="$emit('show', item)">
                    <td v-for="col in headers" :align="col.align" :key="col.value">
                        <slot :name="'item.' + col.value" v-bind="item">
                            <template v-if="col.value === 'btnRemove'">
                                <v-btn color="error" fab x-small px-2 ml-1 @click.stop="$emit('remove', item, item.type)">
                                    <v-icon small>fas fa-trash</v-icon>
                                </v-btn>
                            </template>

                            <template v-else>
                                <!-- If in column definition is configured to show values as chip, else show in span -->
                                <template v-if="columns[col.value] && columns[col.value].chip">
                                    <template v-if="item[col.value]">
                                        <v-chip
                                            v-for="value in getChipItems(item[col.value])"
                                            :key="value"
                                            :color="getChipColor(col.value, value)"
                                            label
                                            dark
                                            :title="value"
                                            class="mr-1"
                                            small
                                            @click.stop="chipClick(col, value)"
                                        >
                                            {{ getValueToShow(col.value, item, getChipText(col.value, value)) }}
                                        </v-chip>
                                    </template>
                                </template>
                                <span v-else v-text="getValueToShow(col.value, item)"></span>

                                <!-- Extra chips -->
                                <template v-if="chips && col.value === chips.after && checkChipsVal(item)">
                                    <v-chip style="margin-left: 10px; margin-bottom: 5px;" small :color="chips.color">
                                        {{ chips.message[$i18n.locale] }}
                                    </v-chip>
                                </template>

                                <!-- Extra things on col name -->
                                <template v-if="col.value === 'name'">
                                    <v-chip
                                        style="margin-left: 10px; margin-bottom: 5px;"
                                        small
                                        color="error"
                                        v-if="item.payload.enabled === '0'"
                                    >
                                        {{ $t("deactivate") }}
                                    </v-chip>
                                </template>
                            </template>
                        </slot>
                    </td>
                </tr>
            </template>

            <template v-slot:footer="data">
                <slot name="footer" v-bind="data"></slot>
            </template>
        </v-data-table>
    </section>
</template>

<script lang="js">
export default {
    name: "alphabetic-list",
    props: {
        chips: {
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
        showLetters: {
            type: Boolean,
            default: true,
        },
        background: {
            type: Boolean,
            default: true,
        },
        btnRemove: Boolean,
        serverItemsLength: {
            type: Number,
            default: -1,
        },
        page: {
            type: Number,
            default: 1,
        },
        itemsPerPage: {
            type: Number,

        },
        loading: Boolean,
        height: [String, Number,],
    },
    data() {
        return {
            alphabet: [],
            lastItem: 0,
            relativeHeight: undefined,
        };
    },
    created() {
        this.alphabet = this.genCharArray("0", "Z");
        this.alphabet.push("("); // Hack to  avoid undefined label
        this.alphabet.push(undefined); // Hack to  avoid undefined label
    },
    mounted() {
        this.$nextTick(() => this.calcRelativeHeight());
    },
    updated(){
        this.calcRelativeHeight();
    },
    methods: {
        checkChipsVal(item) {
            if (this.chips) {
                if (this.chips.field.substring(0, 3) === "cf_") {
                    if (this.chips.value === item.payload.customFields[this.chips.field.substring(3)]) {
                        return true;
                    }
                } else {
                    if (this.chips.value === item.payload[this.chips.field]) {
                        return true;
                    }
                }
            }
            return false;
        },
        chipClick(col, value) {
            if (col.hasOwnProperty('chipUrl')) {
                this.$router.push({ name: "main", params: { page: col.chipUrl.page, id: value, }, query: col.chipUrl.query, });
            }
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
        getValueToShow(columnKey, item, value) {
            let val = value || item[columnKey];
            if (this.columns[columnKey].initial) {
                val = this.$options.filters.initial(val);
            }
            return val;
        },
        getChipItems(value) {

            if (typeof value === 'string') {
                value = value.split(',');
            }

            return value;
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
        calcRelativeHeight(){
            if(this.height){
                let slotsHeight = 0;

                if(this.$slots.top)
                    this.$slots.top.forEach(item => slotsHeight += item.elm.offsetHeight);
                if(this.$slots.footer)
                    this.$slots.footer.forEach(item => slotsHeight += item.elm.offsetHeight);

                this.relativeHeight = this.height - slotsHeight;
            } else {
                this.relativeHeight = undefined;
            }
        },
    },
    watch: {
        list() {
            // Detect change and redisplay
            // console.log(this.list);
        },
    },
    computed: {
        headers() {
            let headers = [],
                i = 0
            ;

            for (let col of Object.values(this.columns)) {
                if (col.showBreakPoint && !this.$vuetify.breakpoint[col.showBreakPoint]) continue;
                headers.push({
                    text: typeof col.label === "object" ? col.label[this.$i18n.locale] : col.label,
                    value: col.id,
                    chip: col.chip,
                    chipUrl: col.chipUrl ? col.chipUrl : null,
                    align: i === 0 ? 'start' : 'center',
                });

                i++;
            }

            if (this.btnRemove) {
                headers.push({
                    text: "",
                    value: "btnRemove",
                });
            }

            return headers;
        },
    },
};
</script>

<style scoped lang="scss">
.alphabetic-list {
    .v-data-table__wrapper td {
        cursor: pointer;
    }
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
