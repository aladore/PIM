import i18n from "@/plugins/i18n";

// We can't pass the i18n key to functions because the i18n used is the general and not the i18n of the component with local messages

export default {
    required(errorText) {
        if (!errorText) {
            errorText = i18n.t("form.error.required");
        }
        return function(v) {
            return !!v || errorText;
        };
    },
    min(value, errorText) {
        if (!errorText) {
            errorText = i18n.t("form.error.min", { value: value });
        }
        return function(v) {
            return (typeof v === "number" && v >= value) || errorText;
        };
    },
    max(value, errorText) {
        if (!errorText) {
            errorText = i18n.t("form.error.max", { value: value });
        }
        return function(v) {
            return !v || v <= value || errorText;
        };
    },
    minLength(length, errorText) {
        if (!errorText) {
            errorText = i18n.t("form.error.min_length", { value: length });
        }
        return function(v) {
            return !v || v?.length >= length || errorText;
        };
    },
    maxLength(length, errorText) {
        if (!errorText) {
            errorText = i18n.t("form.error.max_length", { value: length });
        }
        return function(v) {
            return !v || v?.length <= length || errorText;
        };
    },
    regex(regex, errorText = "") {
        // if (!errorText) {
        //     errorText = i18n.t("form.error.max_length");
        // }

        if (typeof regex === "string") {
            regex = new RegExp(regex);
        }

        return function(v) {
            return regex.test(v) || errorText;
        };
    },
};
