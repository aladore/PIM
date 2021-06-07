import i18n from "@/plugins/i18n";
import * as jmespath from "jmespath";
import * as _ from "lodash";
const set = require("set-value");

export const Tools = {
    _isAndroid: false,
    _isapple: false,

    objectRemoveEmptyValues(obj) {
        Object.keys(obj).forEach(key => {
            // console.log(key, obj[key] instanceof Array, obj[key] instanceof Object, obj[key]);
            if (obj[key] && obj[key] instanceof Object) this.objectRemoveEmptyValues(obj[key]);
            else if (obj[key] === undefined || obj[key] === null) delete obj[key];
        });

        return obj;
    },

    difference(object, base) {
        // lodash
        return _.transform(object, (result, value, key) => {
            if (!_.isEqual(value, base[key])) {
                if (_.isArray(base[key]) || _.isArray(value)) {
                    result[key] = value;
                } else {
                    result[key] = _.isObject(value) && _.isObject(base[key]) ? this.difference(value, base[key]) : value;
                }
            }
        });
    },

    isApple() {
        let r = this._isapple;
        if (r === null) {
            if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
                r = true;
            } else {
                r = false;
            }
            this._isapple = r;
        }
        return r;
    },

    isAndroid() {
        let r = this._isandroid;
        if (r === null) {
            if (navigator.userAgent.toLowerCase().match(/(android)/)) {
                r = true;
            } else {
                r = false;
            }
            this._isandroid = r;
        }
        return r;
    },

    urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

        const rawData = window.atob(base64);
        let outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },
    arrayToBase64String(a) {
        return btoa(String.fromCharCode(...a));
    },

    getList(storeGetters, fields, exclude = null) {
        let list = [];

        for (let n in fields) {
            let choice = fields[n].locales[i18n.locale]?.hasOwnProperty("choices") && fields[n].locales[i18n.locale].choices.length > 0;

            if (exclude) {
                if (exclude.indexOf(n) === -1) {
                    let text = fields[n].locales[i18n.locale]?.label || n.replace("cf_", "");
                    list.push({ id: n, text: text, choice: choice });
                }
            } else {
                let text = fields[n].locales[i18n.locale]?.label || n.replace("cf_", "");
                list.push({ id: n, text: text, choice: choice });
            }
        }

        list.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0));

        return list;
    },
    /**
     * Get Fields list for v-select
     * @returns {[]}
     */
    getFieldList(storeGetters, exclude = null) {
        return this.getList(storeGetters, storeGetters.config.brand.subscriber.Fields, exclude);
    },

    /**
     * Get CustomFields list for v-select
     * @returns {[]}
     */
    getCustomFieldList(storeGetters, exclude = null) {
        return this.getList(storeGetters, storeGetters.config.brand.subscriber.CustomFields, exclude);
    },

    /**
     * Get map like [{"id": "VJA", text: "Vincent JAULIN"}, {"id": "DGO", text: "David GOMES"}] into {"VJA": "Vincent JAULIN", "DGO": "David GOMES"}
     * @param choice
     */
    getChoiceMap(choice) {
        const map = {};

        for (let c of choice) {
            map[c.id] = c.text;
        }

        return map;
    },

    /**
     *
     * @param json
     * @param key
     */
    getJsonPath(json, key, defaultValue = null) {
        return jmespath.search(json, key) || defaultValue;
    },

    setJsonPath(json, key, value) {
        set(json, key, value);
    },

    /**
     * Generate a color related to the name given
     * @param {string | number} name
     * @return {number}
     */
    randomColor(name) {
        let a = 0;
        if (typeof name === "string") name.split("").forEach(v => (a += v.charCodeAt(0)));
        else if (typeof name === "number") a = name;
        else return 1; // default color

        return a % 9;
    },
    /**
     * @see {@link lodash.debounce}
     * @param {Function} func
     * @param {Number} wait
     * @param {Object} options
     * @return {Function}
     */
    debounce(func, wait = process.env.VUE_APP_DEBOUNCE_WAIT, options = {}) {
        return _.debounce(func, wait, options);
    },

    /**
     *
     * @param {array} keys
     * @param {Object} objectToCheck
     * @return {boolean}
     */
    hasAllKeys(keys, objectToCheck) {
        return keys.every(function(key) {
            return objectToCheck.hasOwnProperty(key);
        });
    },

    getSubscriberIcon(subscriber) {
        if (subscriber.customFields?.ViewType === "user") {
            subscriber.type = "$user";
        }

        if (subscriber.type === 0) {
            return "$third";
        } else if (subscriber.type === 1) {
            return "$contact";
        } else {
            return "$user";
        }
    },
};

export default Tools;
