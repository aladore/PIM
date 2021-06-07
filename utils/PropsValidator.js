/**
 * @return {boolean}
 */
import Tools from "@/utils/Tools";

/**
 * @param value
 * @return {boolean}
 */
export function SubscriberTypeValidator(value) {
    return [0, 1, null, undefined].indexOf(value) !== -1;
}

/**
 * @param {array} value
 * @return {boolean}
 */
export function SearchExtraValidator(value) {
    // allow null or empty array
    if (!value?.length) return true;

    for (let item of value) {
        if (!item.hasOwnProperty("id")) {
            return false;
        }

        if (item.id === "permission" || item.id === "other") continue;

        if (!item.hasOwnProperty("value")) {
            return false;
        }
    }

    return true;
}

/**
 * @param value
 * @return {boolean}
 */
export function DateValidator(value) {
    if (!value) return true;

    let date = Tools.parseDate(value);
    return !isNaN(date.getTime());
}
