<template>
    <v-menu
        :dark="dark"
        :light="light"
        v-model="isShowed"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                :dark="dark"
                :light="light"
                :label="label"
                :value="value | date(dateFormat)"
                :hint="dateFormat"
                persistent-hint
                append-icon="fa-calendar-alt"
                readonly
                :filled="filled"
                :clearable="clearable"
                :hide-details="hideDetails"
                :background-color="color"
                v-on="on"
                @click:clear="$emit('input', null)"
                :rules="rules"
            ></v-text-field>
        </template>
        <v-date-picker
            :locale="$i18n.locale"
            :value="value"
            no-title
            :min="min"
            @input="
                $emit('input', $event);
                isShowed = false;
            "
        ></v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: "DropdownDatePicker",
    props: {
        label: String,
        value: String,
        clearable: Boolean,
        rules: {
            type: Array,
            default() {
                return [];
            },
        },
        min: String,
        dark: Boolean,
        light: Boolean,
        hideDetails: Boolean,
        color: {
            type: String,
        },
        fontColor: {
            type: String,
        },
        filled: Boolean,
    },
    data() {
        return {
            isShowed: false,
        };
    },
    computed: {
        dateFormat() {
            return this.$moment.localeData()._config.longDateFormat.L;
        },
    },
};
</script>

<style scoped lang="scss">
.dropdown-date-picker {
}
</style>
