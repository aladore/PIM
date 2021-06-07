import Vue from "vue";
import Vue2Filters from "vue2-filters";

// require all files in this directory except index.js
let req = require.context("./", false, /^((?!index).)*\.js$/);

req.keys().forEach(function(key) {
    let filters = req(key);
    // add each function exported has a filter
    Object.keys(filters).forEach(function(name) {
        Vue.filter(name, filters[name]);
    });
});

/**
 * https://www.npmjs.com/package/vue2-filters
 */
Vue.use(Vue2Filters);

// var Vue2FiltersConfig = {
//     capitalize: {
//         onlyFirstLetter: false
//     },
//     currency: {
//         symbol: '$',
//         decimalDigits: 2,
//         thousandsSeparator: ',',
//         decimalSeparator: '.',
//         symbolOnLeft: true,
//         spaceBetweenAmountAndSymbol: false
//     },
//     pluralize: {
//         includeNumber: false
//     },
//     ordinal: {
//         includeNumber: false
//     }
// }
//
// Vue.use(Vue2Filters, Vue2FiltersConfig)
