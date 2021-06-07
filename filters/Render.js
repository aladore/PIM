import Twig from "twig/twig.min";

/**
 * @param {string} str
 * @param {Object} params
 * @return {string}
 */
export function render(str, params) {
    if (typeof str !== "string") {
        throw new Error("str must be of type string");
    }

    if (typeof params !== "object") {
        throw new Error("params must be of type object");
    }

    if (str) {
        try {
            let template = Twig.twig({ data: str });
            str = template.render(params);
        } catch (e) {
            console.error(e);
        }

        return str;
    }

    return "";
}
