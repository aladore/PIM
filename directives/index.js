// import Vue from "vue";

// require all files in this directory except index.js
let req = require.context("./", false, /^((?!index).)*\.js$/);
req.keys().forEach(function(key) {
    req(key);
});
