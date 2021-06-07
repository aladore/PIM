/**
 * https://json-schema.org/understanding-json-schema/reference/numeric.html
 * https://vuejsfeed.com/blog/generate-forms-using-json-schema-and-vue-js
 * https://github.com/koumoul-dev/vuetify-jsonschema-form
 */

/*
 * Constants
 */
import i18n from "../../plugins/i18n";

export const JsonFormOptionsAccordionMode = {
    NORMAL: "normal",
    INSET: "inset",
    POPOUT: "popout",
};

export const JsonFormOptionsAllOfType = {
    ACCORDION: "accordion",
    TABS: "tabs",
};

export const JsonFormOptionsAllOfTheme = {
    LIGHT: "light",
    DARK: "dark",
};

export const JsonFormSchemaType = {
    OBJECT: "object",
    STRING: "string",
    INTEGER: "integer",
    BOOLEAN: "boolean",
    ARRAY: "array",
    NULL: "null",
    NUMBER: "number", // integer & decimal
};

export const JsonFormSchemaXDisplay = {
    PASSWORD: "password",
    SINGLE_LINE: "single-line",
    HIDDEN: "hidden",
    TIME_AMPM: "ampm",
    TIME_24H: "24hr",
};

export const JsonFormSchemaFormat = {
    DATE: "date",
    DATE_TIME: "date-time",
    TIME: "time",
    HEX_COLOR: "hexcolor",
    EMAIL: "email",
    URL: "url",
    TEL: "tel",
};

/*
 * Classes
 */

export class JsonForm {
    /**
     *
     * @param {JsonFormSchema} schema
     * @param {Number|String|Array|Object|Boolean} [model]
     * @param {JsonFormOptions} options
     */
    constructor({ schema, model, options }) {
        Object.assign(this, arguments);
    }
}

export class JsonFormOptions {
    /**
     *
     * @param {Boolean} [debug]
     * @param {Boolean} [disableAll]
     * @param {Boolean} [autoFoldObjects]
     * @param {JsonFormOptionsAccordionMode} [accordionMode]
     * @param {String} [requiredMessage]
     * @param {String} [noDataMessage]
     * @param {String} [searchMessage]
     * @param {Object} [colors]
     * @param {JsonFormOptionsAllOfType} [allOfType]
     * @param {JsonFormOptionsAllOfTheme} [allOfTheme]
     * @param {Object} [icons]
     */
    constructor({
        debug,
        disableAll,
        autoFoldObjects,
        accordionMode,
        requiredMessage,
        noDataMessage,
        searchMessage,
        colors,
        allOfType,
        allOfTheme,
        icons,
    }) {
        Object.assign(this, arguments);
    }
}

// export default class JsonFormSchema {
//     /**
//      *
//      * @param {string} [title]
//      * @param {string} [description]
//      * @param {string} [properties]
//      * @param {string} [definitions]
//      */
//     constructor({ title, description, properties = {}, definitions }) {
//         this.title = title;
//         this.description = description;
//         this.type = JsonFormSchemaType.OBJECT;
//         this.properties = properties;
//         this.definitions = definitions;
//     }
// }

export class JsonFormSchema {
    /**
     *
     * @param {string} [$ref] - a reference (ex: "#/definitions/toto" toto is the property's key)
     * @param {string} [title] - the label
     * @param {string} [description] - show as a information's tooltip
     * @param {string} [type] - See JsonFormSchemaType, default OBJECT
     * @param {string} [xDisplay] - See JsonFormSchemaXDisplay
     * @param {string} [format] - See JsonFormSchemaFormat
     * @param {boolean|string[]} [required]
     * @param {boolean|string[]} [readOnly]
     * @param {any} [defaultVal]
     * @param {Object} [attrs]
     * @param {Object.<string, JsonFormSchema>} [definitions]
     * @param {Object[]} [anyOf]
     * @param {Object[]} [allOf]
     * @param {number} [min]
     * @param {number} [max]
     * @param {number} [minLength]
     * @param {number} [maxLength]
     * @param {Object|JsonFormSchema[]} [items]
     * @param {number} [minItems]
     * @param {Object.<string, JsonFormSchema>} [properties]
     *
     */
    constructor({
        title,
        description,
        type = JsonFormSchemaType.OBJECT,
        xDisplay,
        format,
        required,
        readOnly,
        defaultVal,
        attrs,
        definitions,
        anyOf,
        allOf,
        min,
        max,
        minLength,
        maxLength,
        items,
        minItems,
        maxItems,
        uniqueItems,
        properties,
    }) {
        this.title = title;
        this.description = description;
        this.type = type;
        this["x-display"] = xDisplay;
        this.format = format;
        this.required = required;
        this.readOnly = readOnly;
        this.default = defaultVal;
        this.attrs = attrs;

        this.definitions = definitions;
        this.anyOf = anyOf;
        this.allOf = allOf;

        // integer
        this.minimum = min;
        this.maximum = max;

        // String
        this.minLength = minLength;
        this.maxLength = maxLength;

        // Array
        this.items = items;
        this.minItems = minItems;
        this.maxItems = maxItems;
        this.uniqueItems = uniqueItems;

        // Object
        this.properties = properties;
    }
}

export const CustomFields = {
    TYPES: {
        0: { type: JsonFormSchemaType.STRING },
        1: { type: JsonFormSchemaType.INTEGER },
        2: { type: JsonFormSchemaType.NUMBER },
        3: { type: JsonFormSchemaType.STRING, format: JsonFormSchemaFormat.DATE_TIME },
        4: { type: JsonFormSchemaType.STRING, format: JsonFormSchemaFormat.DATE },
        5: { type: JsonFormSchemaType.STRING, format: JsonFormSchemaFormat.TIME },
        6: { type: JsonFormSchemaType.STRING },
        7: { type: JsonFormSchemaType.ARRAY },
        8: { type: JsonFormSchemaType.OBJECT },
    },

    /**
     *
     * @param customFields
     * @param ui
     */
    uiCustomFieldsToJsonFormSchema(customFields, ui) {
        let sections = {};

        for (let item of ui) {
            let section = new JsonFormSchema({ title: item.label });
            for (let fieldName of item.fields) {
                let field = customFields[fieldName];

                let property = new JsonFormSchema({
                    type: this.TYPES[field.type].type || JsonFormSchemaType.STRING,
                    format: this.TYPES[field.type].format || undefined,
                    title: field.locales[i18n.locale].label,
                    description: field.locales[i18n.locale].description,
                });

                // if (field.choices.length) {
                //     for (let choice of field.choices) {
                //     }
                // }

                section.properties[fieldName] = property;
            }
            section[item.label] = section;
        }

        let allOf = [];
        for (let sectionName of Object.keys(sections)) {
            allOf.push({ $ref: "#/definitions/" + sectionName });
        }

        let schema = new JsonFormSchema({
            allOf: allOf,
            definitions: sections,
        });
    },
};
// /**
//  * Define a properties's item of type Array
//  */
// export class JsonFormSchemaArrayItems {
//     /**
//      *
//      * @param {JsonFormSchemaType} type
//      * @param {string} title - the label
//      * @param {string[]} enums
//      */
//     constructor({ type = JsonFormSchemaType.STRING, title, enums }) {
//         this.type = type;
//         this.title = title;
//         this.enums = enums;
//     }
// }
