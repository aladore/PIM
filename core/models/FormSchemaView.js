/**
 * https://json-schema.org/understanding-json-schema/reference/numeric.html
 * https://vuejsfeed.com/blog/generate-forms-using-json-schema-and-vue-js
 * https://github.com/koumoul-dev/vuetify-jsonschema-form
 */
import { insertChildrenIntoSlot } from "vuescroll/src/shared/util";

// TODO
// checkbox and radiobox tests

// {id: '0', text: wtrans('types.string')},
// {id: 1, text: wtrans('types.long')},
// {id: 2, text: wtrans('types.double')},
// {id: 3, text: wtrans('types.datetime')},
// {id: 4, text: wtrans('types.date')},
// {id: 5, text: wtrans('types.time')},
// {id: 6, text: wtrans('types.location')},
// {id: 7, text: wtrans('types.array')},
// {id: 8, text: wtrans('types.object')},

// OBJECT: "object",
//     STRING: "string",
//     INTEGER: "integer",
//     BOOLEAN: "boolean",
//     ARRAY: "array",
//     NULL: "null",
//     NUMBER: "number" // integer & decimal

export class FormSchemaView {
    types = {
        0: "string",
        1: "integer",
        2: "number",
    };

    /**
     *
     * @param {object} [customFields] - customFields
     * @param {object} [view] - the view
     */
    constructor(store, locale, viewType, subscriberType) {
        this.fields = store.getters.fields;
        this.customFields = store.getters.customFields;
        this.views = store.getters.views;
        this.viewType = viewType;
        this.viewTypeUser = store.getters.app("user").customFields.ViewType;
        this.subscriberType = subscriberType;
        this.locale = locale;
    }

    check() {
        if (!this.viewType) {
            throw new Error("view.type.notfound");
        }

        if (!this.views.hasOwnProperty(this.viewType)) {
            throw new Error("view.notfound");
        }

        if (!this.viewTypeUser) {
            throw new Error("view.type.notfound");
        }
    }

    properties(name, obj, field, ui) {
        if (field.format) {
            if (field.properties && field.properties.indexOf("multiple") > -1) {
                if (["choice", "radiobox", "checkbox"].indexOf(field.format.type) > -1) {
                    // only customFields
                    obj.type = "array";
                    obj.items = { type: "string", oneOf: [] };

                    let choices = this.customFields[name].locales[this.locale]?.choices || [];
                    for (let i of choices) {
                        obj.items.oneOf.push({ const: i.id, title: i.text });
                    }

                    if (ui.required && ui.required.length > 0 && ui.required.indexOf(name) > -1) {
                        obj.minItems = 1;
                    }
                } else {
                    obj.format = field.format.type;
                }
            } else {
                if (["choice", "radiobox", "checkbox"].indexOf(field.format.type) > -1) {
                    // only customFields
                    obj.oneOf = [];
                    let choices = this.customFields[name].locales[this.locale]?.choices || [];
                    for (let i of choices) {
                        obj.oneOf.push({ const: i.id, title: i.text });
                    }
                } else {
                    obj.format = field.format.type;
                }
            }
        }

        if (field.type === 3) {
            obj.format = "date-time";
        } else if (field.type === 4) {
            obj.type = "string";
            obj.format = "date";
        } else if (field.type === 5) {
            obj.format = "time";
        }

        if (obj.format === "email") {
            obj["x-display"] = "custom-email";
        } else if (obj.format === "tel") {
            obj["x-display"] = "custom-tel";
        } else if (obj.format === "textarea") {
            obj.format = "string";
            obj.maxLength = 100;
        } else if (obj.format === "simple") {
            obj.format = "text";
        } else if (obj.format === "choice") {
            obj.format = "array";
        }

        if (ui.readonly && ui.readonly.length > 0 && ui.readonly.indexOf(name) > -1) {
            obj.readOnly = true;
        }

        if (ui.disabled && ui.disabled.length > 0 && ui.disabled.indexOf(name) > -1) {
            obj.disabled = true;
        }

        if (ui.required && ui.required.length > 0 && ui.required.indexOf(name) > -1) {
            obj.required = true;
        }

        return obj;
    }

    getFields() {
        const ui = this.views[this.viewType][this.viewTypeUser][`T${this.subscriberType}`];
        let fields = {};
        for (let v of ui) {
            for (let n of v.fields) {
                fields[n] = 1;
            }
        }

        return fields;
    }

    schema() {
        this.check();

        const schema = {
            $id: "https://example.com/person.schema.json",
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            "x-options": {
                allOfTabs: true,
            },
            allOf: [],
            definitions: {},
        };

        const ui = this.views[this.viewType][this.viewTypeUser][`T${this.subscriberType}`];

        if (ui) {
            for (let index of Object.keys(ui)) {
                const defName = `tab${index}`,
                    uiItem = ui[index],
                    xclass = uiItem["x-class"] || null;
                schema.allOf.push({ $ref: `#/definitions/${defName}` });
                schema.definitions[defName] = {
                    title: uiItem.label[this.locale],
                    properties: {},
                };

                for (let fullFieldName of uiItem.fields) {
                    let field = null;

                    if (fullFieldName.startsWith("cf_")) {
                        // CustomFields
                        // get the custom field definition, defined on the brand
                        field = this.customFields[fullFieldName];
                        if (!field) {
                            continue;
                        }

                        if (!schema.definitions[defName].properties.hasOwnProperty("customFields")) {
                            schema.definitions[defName].properties.customFields = {
                                type: "object",
                                properties: {},
                            };
                        }

                        const fieldName = fullFieldName.replace("cf_", "");
                        if (!schema.definitions[defName].properties.customFields.properties.hasOwnProperty(fieldName)) {
                            schema.definitions[defName].properties.customFields.properties[fieldName] = {
                                type: this.types[field.type || 0],
                                title: field.locales[this.locale]?.label || fieldName,
                            };

                            if (xclass) {
                                schema.definitions[defName].properties.customFields.properties[fieldName]["x-class"] = xclass;
                            }
                        }

                        schema.definitions[defName].properties.customFields.properties[fieldName] = this.properties(
                            fullFieldName,
                            schema.definitions[defName].properties.customFields.properties[fieldName],
                            field,
                            uiItem,
                        );
                    } else {
                        // Main fields
                        field = this.fields[fullFieldName];

                        let title = this.fields[fullFieldName].locales[this.locale]?.label;
                        if (title && title.indexOf("|") > -1) {
                            // Define Label for Third or Contact
                            title = title.split("|");
                            title = title[this.subscriberType];
                        }

                        schema.definitions[defName].properties[fullFieldName] = {
                            type: this.types[field.type],
                            title: title,
                        };

                        if (xclass) {
                            schema.definitions[defName].properties[fullFieldName]["x-class"] = xclass;
                        }

                        schema.definitions[defName].properties[fullFieldName] = this.properties(
                            fullFieldName,
                            schema.definitions[defName].properties[fullFieldName],
                            field,
                            uiItem,
                        );
                    }
                }
            }
        }

        // console.log('JSON Schema', JSON.stringify(schema));
        return schema;
    }
}
