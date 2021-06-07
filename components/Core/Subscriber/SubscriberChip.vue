<template>
    <v-tooltip bottom class="subscriber-chip" :disabled="dense || !subscriber[tooltipField]">
        {{ subscriber[tooltipField] }}
        <template v-slot:activator="{ on, attrs }">
            <v-chip
                label
                v-bind="attrs"
                v-on="on"
                :input-value="selected"
                @click="$emit('click', subscriber)"
                :close="deletable"
                @click:close="$emit('click:close', subscriber)"
                style="margin-right: 10px; margin-bottom: 10px;max-width: 190px;"
            >
                <v-avatar style="height:26px; width: 26px; border-radius: 5px; min-width: 26px; padding: 0 !important">
                    <span style="border-radius: 0" :class="subscriber.name | randomColorClass">
                        <v-icon small color="white">
                            {{ subscriberIcon }}
                        </v-icon>
                    </span>
                </v-avatar>
                <span class="text-truncate" v-if="display === 'email'">
                    {{ subscriber.email || $t("no-email") }} - {{ subscriber.name }}
                </span>
                <span class="text-truncate" v-else-if="display === 'sms'">
                    {{ subscriber.sms || $t("no-sms") }} - {{ subscriber.name }}
                </span>
                <span class="text-truncate" v-else>
                    {{ subscriber.name }}
                </span>
            </v-chip>
        </template>
    </v-tooltip>
</template>

<script>
import Tools from "@/utils/Tools";

export default {
    name: "SubscriberChip",
    props: {
        subscriber: {
            type: Object,
            required: true,
        },
        deletable: {
            type: Boolean,
            default: false,
        },
        dense: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            default: false,
        },
        display: {
            type: String,
            default: "",
            validator: function(value) {
                return ["email", "sms", "event", null, ""].indexOf(value) !== -1;
            },
        },
        tooltipField: {
            type: String,
            default: "customId",
        },
    },
    computed: {
        subscriberIcon() {
            return Tools.getSubscriberIcon(this.subscriber);
        },
    },
};
</script>

<style scoped lang="scss">
.v-avatar span {
    margin-left: 0 !important;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 0 !important;
}
</style>
