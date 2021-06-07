import Vue from "vue";

Vue.directive("define-text-color", {
    inserted(el) {
        let rgbText = window.getComputedStyle(el, null).getPropertyValue("background-color"),
            rgb = parseRgbCss(rgbText);
        el.classList.add(isDark(rgb) ? "white--text" : "dark--text");
    },
});

/**
 *
 * @param {string} rgbCssString
 */
function parseRgbCss(rgbCssString) {
    let rgb = rgbCssString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    rgb.shift();
    return rgb;

    // return rgbCssString
    //     .substring(4, rgbCssString.length - 1)
    //     .replace(/ /g, "")
    //     .split(",");
}

/**
 *
 * @param {array|string} rgb array of 3 elements: [Red, Green, Blue]
 * @param {boolean} hexa
 */
function isDark(rgb, hexa = false) {
    if (hexa) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb);
        rgb = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
    // http://www.w3.org/TR/AERT#color-contrast
    const o = Math.round((parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000);
    return !(o > 125);
}
