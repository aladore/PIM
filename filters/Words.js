/**
 * @param value
 * @returns {string|*}
 */
export function initial(value) {
    if (!value) {
        return "";
    }

    if (value.length > 3) {
        value = value.split(" ");
        value = value.map(item => item.charAt(0).toUpperCase());

        return value.slice(0, 2).join("");
    }

    return value;
}

/**
 * @param value
 * @param separator
 * @returns {string|*}
 */
export function join(value, separator = ", ") {
    console.log(value);
    if (!value) {
        return "";
    }

    return value.join(separator);
}
