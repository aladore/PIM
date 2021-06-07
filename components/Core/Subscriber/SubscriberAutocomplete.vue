<template>
    <v-autocomplete
        :value="valueArray"
        @input="input"
        :items="items"
        :filled="filled"
        :background-color="colorBack"
        :label="label || $t(labelKey)"
        chips
        item-text="name"
        item-value="id"
        :search-input.sync="search"
        :multiple="multiple"
        return-object
        :ripple="false"
        :rules="rules"
        :hide-details="hideDetails"
        :hint="hint"
        :height="height"
        :persistent-hint="persistedHint"
        :no-data-text="noDataText"
        outlined
        no-filter
    >
        <template v-slot:selection="{ item, selected, index }">
            <div v-if="!$isMobile">
                <subscriber-chip
                    v-if="shortList === false || (shortList && index === 0)"
                    class="su-chip"
                    :subscriber="item"
                    :deletable="deletable"
                    :selected="selected"
                    :display="display"
                    @click:close="remove(item)"
                ></subscriber-chip>
                <template v-if="shortList && index === 0 && valueArray.length > 1">
                    <span> {{ $t("and") }} {{ valueArray.length - 1 }} {{ $t("other") }}</span>
                </template>
            </div>
            <div v-else>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-chip
                            label
                            :input-value="selected"
                            :close="deletable"
                            class="su-chip chip--select-multi"
                            @click:close="remove(item)"
                            v-if="shortList === false || (shortList && index < 3)"
                        >
                            <v-avatar>
                                <!-- <img :src="data.item.avatar" />-->
                                <!-- <i class="fas fa-circle fa-user"></i>-->
                                <span v-on="on" :class="'color' + item.color">
                                    <v-icon small color="white">
                                        {{ giveIcon(item) }}
                                    </v-icon>
                                </span>
                            </v-avatar>
                        </v-chip>
                        <template v-if="shortList && index === 3 && valueArray.length > 1">
                            <span> {{ $t("and") }} {{ valueArray.length - 3 }} {{ $t("other") }}</span>
                        </template>
                    </template>
                    <span v-if="display === 'email'"> {{ item.email || $t("no-email") }} - {{ item.name }} </span>
                    <span v-else-if="display === 'sms'"> {{ item.sms || $t("no-sms") }} - {{ item.name }} </span>
                    <span v-else> {{ item.name }} </span>
                </v-tooltip>
            </div>
        </template>
        <template v-slot:item="data">
            <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item"></v-list-item-content>
            </template>
            <template v-else>
                <v-list-item-avatar>
                    <!-- <img :src="data.item.avatar" />-->
                    <!-- <i class="fas fa-circle fa-user"></i>-->
                    <span :class="'color' + data.item.color" style="font-size: 0.8rem; line-height: 20px; height: 30px">
                        <v-icon small color="white">
                            {{ giveIcon(data.item) }}
                        </v-icon>
                    </span>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>
                        <span v-if="display === 'email'">{{ data.item.email }} -&nbsp;</span>
                        <span v-else-if="display === 'sms'">{{ data.item.sms }} -&nbsp;</span>
                        {{ data.item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                </v-list-item-content>
            </template>
        </template>
        <!-- end slot item -->
    </v-autocomplete>
</template>

<script>
import { subscriberService } from "@/core/services";
import Tools from "@/utils/Tools";
import SubscriberChip from "@/components/Core/Subscriber/SubscriberChip";
import { SearchExtraProp, SubscriberTypeProp, } from "@/utils/PropsTypes";

export default {
    name: "SubscriberAutocomplete",
    components: { SubscriberChip, },
    props: {
        value: [Array, Object],
        label: String,
        labelKey: {
            type: String,
            default: "search",
        },
        type: SubscriberTypeProp,
        multiple: {
            type: Boolean,
            default: false,
        },
        filled: {
            type: Boolean,
            default: true,
        },
        noDataText: {
            type: String,
            default: undefined,
        },
        display: {
            type: String,
            default: "",
            validator: function(value) {
                return ["email", "sms", null, ""].indexOf(value) !== -1;
            },
        },
        deletable: {
            type: Boolean,
            default: true,
        },
        colorBack: {
            type: String,
            default: "transparent",
        },
        rules: {
            type: Array,
            default() {
                return [];
            },
        },
        ignoreGlobalSearchExtra: {
            type: Boolean,
            default: false,
        },
        shortList: {
            type: Boolean,
            default: false,
        },
        height: {
            type: String,
            default: "",
        },
        hideDetails: {
            type: [Boolean, String],
            default: false,
        },
        searchExtra: SearchExtraProp,
        hint: String,
        persistedHint: Boolean,
        onlyUsers: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            valueArray: [],
            items: [],
            search: null,
            isLoading: false,
        };
    },
    mounted() {},
    methods: {
        giveIcon(subscriber) {
            return Tools.getSubscriberIcon(subscriber);
        },
        remove(item) {
            if (this.multiple) {
                let newItems = this.valueArray;
                newItems.splice(
                    newItems.findIndex(e => e.id === item.id),
                    1,
                );
                this.input(newItems);
            } else {
                this.input(null);
            }
        },
        input(newItems) {
            let subscribers = {};

            if (this.multiple) {
                if (newItems.length) {
                    for (let item of newItems) {
                        subscribers[item.id] = item;
                    }
                }
            } else {
                subscribers = newItems;
            }

            this.search = "";
            this.$emit("input", subscribers); // return object
        },
        async searchAction(search) {
            if (this.isLoading) return;

            this.isLoading = true;

            // load items
            let searchExtra = [];

            if (!this.ignoreGlobalSearchExtra) {
                searchExtra = this.$store.getters.globalProperties("searchExtra.subscriber") || [];
            }

            console.log(search, this.type, this.onlyUsers, this.searchExtra, this.display);

            const resp = await subscriberService.getList({
                subscriberType: this.type,
                search: search,
                user: this.onlyUsers,
                searchExtra: [...searchExtra, ...(this.searchExtra || []),],
                display: this.display, // get only existing field (not empty)
            });

            this.items = [];

            // Add current selected items autocomplete list
            if (Array.isArray(this.valueArray)) {
                this.items.push(...this.valueArray);
            }

            for (let items of resp.data.hits.hits) {
                let subscriber = {
                    id: items._id,
                    name: items._source.name,
                    sms: items._source.sms,
                    email: items._source.email,
                    customId: items._source.customId,
                    color: Tools.randomColor(items._source.name),
                    type: items._source.type,
                    customFields: items._source.customFields,
                };
                this.items.push(subscriber);
            }
            this.isLoading = false;
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if (this.multiple) {
                    this.valueArray = [];

                    if (val) {
                        for (let subId of Object.keys(val)) {
                            let subscriber = val[subId];
                            subscriber.color = Tools.randomColor(subscriber.name);
                            this.valueArray.push(subscriber);
                        }
                        if (this.items.length === 0) {
                            this.items = [...this.valueArray,];
                        }
                    }
                } else {
                    this.valueArray = val;

                    this.items = this.valueArray ? [this.valueArray] : [];
                }
            },
        },
        search: Tools.debounce(function(val) {
            // delay the request to avoid too many request
            if (val?.length) {
                // if not null and not empty
                this.searchAction(val);
            }
        }),
    },
};
</script>

<style scoped lang="scss">
.v-avatar span {
    border-radius: 0;
    margin-left: 0;
    width: 30px;
    height: 30px;
}

span.text-truncate {
    max-width: 150px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<i18n>
    {
    "fr": {
    "and": "et",
    "other": "autres",
    "StartTypingNameOfAProvider": "Commencez à taper le nom d'un fournisseur"
    },
    "en": {
    "and": "and",
    "other": "others",
    "StartTypingNameOfAProvider": "Start typing the name of a provider"
    }
    }
</i18n>
