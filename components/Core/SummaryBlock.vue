<template>
    <v-container fluid class="summary-block">
        <v-row :justify="center ? 'center' : 'undefined'">
            <!--<v-col v-if="offset !== 0" :cols="offset"></v-col>-->
            <v-col v-for="(item, i) in items" :key="i" :cols="cols" :md="md">
                <v-card
                    :color="item.color || $options.filters.randomColorClass(item.label)"
                    class="d-flex flex-column pa-4 justify-center"
                    height="100%"
                    @click="$emit('click:item', item)"
                    title=""
                >
                    <v-card-title
                        v-define-text-color
                        class="headline font-weight-light justify-center text-center"
                        style="word-break: break-word"
                    >
                        <v-row>
                            <v-col cols="12" style="padding:.5rem" v-if="iconEnabled">
                                <v-icon color="white" large>{{ item.icon }}</v-icon>
                            </v-col>
                            <v-col cols="12" style="padding:0">
                                {{ item.label }}
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text v-define-text-color class="text-h3 font-weight-bold text-center pb-0">
                        <animated-number :number="item.value"></animated-number>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AnimatedNumber from "@/components/Core/AnimatedNumber";
import Tools from "@/utils/Tools";

export default {
    name: "SummaryBlock",
    components: { AnimatedNumber },
    props: {
        /**
         * Array of object
         *  {
         *      label: String,
         *      value: Number,
         *      [color: String]
         *  }
         */
        iconEnabled: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            validator: function(value) {
                for (let item of value) {
                    if (!Tools.hasAllKeys(["label", "value"], item)) return false;
                }
                return true;
            },
        },
        cols: {
            type: Number,
            default: 12,
        },
        center: {
            type: Boolean,
            default: false,
        },
        md: {
            type: Number,
            default: 6,
        },
    },
};
</script>
