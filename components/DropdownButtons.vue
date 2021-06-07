<template>
    <div class="d-flex dropdown-buttons">
        <v-menu offset-y v-if="nbMaxItems !== -1 && buttons.length > nbMaxItems">
            <template v-slot:activator="{ on }">
                <v-btn :color="color" v-on="on" :depressed="depressed" :ripple="ripple" :icon="icon" :style="buttonStyle">
                    <v-icon small>{{ iconMenu }}</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-tooltip left v-for="(btn, index) in buttonsComputed" :disabled="!btn.tooltip" :key="index">
                    <template v-slot:activator="{ on }">
                        <v-list-item
                            v-on="on"
                            :href="
                                (btn.url || '') | render({ user: $store.getters.app('user'), subscriber: $store.getters.app('subscriber') })
                            "
                            :target="btn.url ? '_blank' : ''"
                            :disabled="$isOffline"
                            @click="btn.name ? $emit('click:' + btn.name) : ''"
                        >
                            <v-list-item-title class="text-center">
                                <v-icon v-if="btn.icon" small>{{ btn.icon }}</v-icon>
                                <span v-else>{{ btn.text }}</span>
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <span v-if="btn.tooltip">{{ btn.tooltip }}</span>
                </v-tooltip>
            </v-list>
        </v-menu>

        <template v-else>
            <v-tooltip bottom v-for="(btn, index) in buttonsComputed" :key="index" :disabled="!btn.tooltip">
                <template v-slot:activator="{ on }">
                    <v-btn
                        :disabled="$isOffline"
                        :color="color"
                        :depressed="depressed"
                        :tile="tile"
                        :ripple="ripple"
                        :icon="icon && !background"
                        :text="icon && !background"
                        :href="(btn.url || '') | render({ user: $store.getters.app('user'), subscriber: $store.getters.app('subscriber') })"
                        :target="btn.url ? '_blank' : ''"
                        v-on="on"
                        @click="btn.name ? $emit('click:' + btn.name) : ''"
                        :style="buttonStyle"
                        :class="buttonClass"
                    >
                        <v-icon v-if="btn.icon" small>{{ btn.icon }}</v-icon>
                        <span v-else>{{ btn.text }}</span>
                    </v-btn>
                </template>
                <span>{{ btn.tooltip }}</span>
            </v-tooltip>
        </template>
    </div>
</template>

<script>
export default {
    name: "DropdownButtons",
    props: {
        buttons: {
            type: Array,
            default() {
                return []; // {name, icon, tooltip?}
            },
            validator(value) {
                for (let btn of value) {
                    if ((typeof btn.name !== "string" || typeof btn.icon !== "string") && (!btn.text && !btn.url)) {
                        return false;
                    }
                }
                return true;
            },
        },
        nbMaxItems: {
            type: Number,
            default: 1,
        },
        depressed: Boolean,
        ripple: Boolean,
        tile: {
            type: Boolean,
            default: true,
        },
        iconMenu: {
            type: String,
            default: "fas fa-ellipsis-v",
        },
        icon: Boolean,
        color: String,
        fullHeight: Boolean,
        buttonClass: [String, Array, Object],
        background: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
        buttonStyle() {
            let style = "";

            if (this.fullHeight) {
                style += "height: 100%; ";
            }

            return style;
        },
        buttonsComputed() {
            return this.buttons.filter(btn => {
                return !this.$isGranted(btn.role);
            });
        },
    },
};
</script>

<style scoped lang="scss">
.dropdown-buttons {
    margin-left: 1px;
}
</style>
