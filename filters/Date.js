import moment from "@/plugins/moment";

/**
 * @see moment
 * @param {string | date} date
 * @param {string} format
 * @return {string}
 */
export function date(date, format = "L") {
    return datetime(date, format);
}

/**
 * @see moment
 * @param {string | date} date
 * @param {string} format
 * @return {string}
 */
export function datetime(date, format = "L LT") {
    if (!date) return "";

    return moment(date).format(format);
}

/**
 * @param {string} date
 * @param {string} substitute "-" or "/"
 * @return {string}
 */
// export function parseDate(date, substitute) {
//     if (!date || !substitute) return null;
//     if (substitute === "/") {
//         // console.log(date, substitute);
//         const [year, month, day,] = date.split("-");
//         return `${day}/${month}/${year}`;
//     } else if (substitute === "-") {
//         // console.log(date, substitute);
//         const [year, month, day,] = date.split("/");
//         return `${day}-${month}-${year}`;
//     }
// }
