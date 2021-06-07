<template>
    <div
        class="subscriber-search d-flex"
        :style="{
            backgroundColor: $vuetify.theme.themes[$vuetify.theme.isDark ? 'dark' : 'light'].primary,
            borderRadius: '4px',
            color: 'white !important',
        }"
    >
        <v-expand-x-transition>
            <div v-show="isExpanded">
                <v-autocomplete
                    :search-input.sync="search"
                    v-model="value"
                    background-color="transparent"
                    :label="$t('search')"
                    :items="items"
                    return-object
                    :item-text="text"
                    item-value="_id"
                    dense
                    solo
                    append-icon=""
                    hide-details
                    auto-select-first
                    clearable
                    color="primary"
                    clear-icon="fa fa-times"
                    flat
                    dark
                    class="border-right-0"
                    autocomplete="off"
                    :style="{ maxWidth: '200px', color: 'white' }"
                ></v-autocomplete>
            </div>
        </v-expand-x-transition>
        <v-btn
            depressed
            class="pa-0"
            color="transparent"
            @click="isExpanded = $isMobile ? !isExpanded : true"
            :ripple="false"
            tile
            height="38"
        >
            <v-icon small color="white">fas fa-search</v-icon>
        </v-btn>
    </div>
</template>

<script>
import { subscriberService } from "@/core/services";
import { Tools } from "@/utils/Tools";
// import CrmComponentMixin from "@/mixins/CrmComponentMixin";
export default {
    name: "SubscriberSearch",
    // mixins: [CrmComponentMixin,],
    props: {
        properties: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            search: "",
            value: null,
            items: [],
            // expandable only on mobile. By default false on mobile, true on desktop
            isExpanded: true,
        };
    },
    methods: {
        getSubscribers(search) {
            subscriberService
                .getList({
                    search: search,
                    searchExtra: this.properties.searchExtra,
                    all: this.$isGranted(this.properties.seeAll),
                })
                .then(response => {
                    this.items = response.data.hits.hits;
                });
        },
        text: item => item._source.customId + " " + item._source.name,
    },
    mounted() {
        if (this.$isMobile) this.isExpanded = false;
    },
    watch: {
        search: Tools.debounce(function(val) {
            // delay the request to avoid too many request
            if (val && val.length > 1) {
                // if null or empty, or length greater than 1
                this.getSubscribers(val);
            }
        }),
        value(subscriber) {
            if (subscriber) {
                this.$store.commit("appSet", { key: "subscriber", value: subscriber._source });
                let route = subscriber._source.type === 0 ? "Third" : "Contact";
                this.$router.push({ name: "main", params: { page: route, id: subscriber._id } });
                this.value = null;
                this.items = [];
            }
        },
    },
};
</script>
