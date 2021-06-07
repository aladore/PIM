/* Module1.store.js */
import axios, { cacheStore as axiosCacheStore } from "../../plugins/axios";

// State object
const state = {
    products: [],
};
// Getter functions
const getters = {
    collection: state => state.products,
};
const mutations = {
    setProducts(state, res) {
        let products = [];
        console.log(res.data);
        res.data.hits.hits.forEach(hit => {
            products.push(hit._source.data);
        });
        state.products = [...products];
    },
};
// Actions
const actions = {
    async fetch({ commit, rootGetters }) {
        let supplierId = "";
        if (rootGetters.config.extra) {
            supplierId = rootGetters.config.extra;
        }
        let bucket = rootGetters.config.brand.drive.bucket;
        let path = rootGetters.config.brand.drive.productPath;
        const config = {
            headers: { Authorization: `Bearer ${this.state.app.token}` },
        };

        try {
            let res = await axios.get(`https://apidev.send-up.net/internal/drive/resources?bucket=${bucket}&path=/${path}`, {
                config,
            });
            if (res) {
                commit("setProducts", res);
                return true;
            }
        } catch (e) {
            console.log("Error", e);
            return false;
        }
    },
    async create({ commit, rootGetters }, data) {
        let bucket = rootGetters.config.brand.drive.bucket;

        const config = {
            headers: { Authorization: `Bearer ${this.state.app.token}`, },
        };
        try {
            let res = await axios.post(
                `https://apidev.send-up.net/internal/drive/resources?bucket=${bucket}&path=/Private/Produits`,
                data,
                config,
            );
            if (res) {
                commit("setProducts", res);
                return true;
            }
        } catch (e) {
            console.log("Error", e);
            return false;
        }
    },
    async search({ commit, rootGetters }, data) {
        let bucket = rootGetters.config.brand.drive.bucket;
        const config = {
            headers: { Authorization: `Bearer ${this.state.app.token}`, },
        };
        try {
            let res = await axios.post(
                `https://apidev.send-up.net/internal/drive/resources?bucket=${bucket}&path=/Private/Produits`,
                data,
                config,
            );
            if (res) {
                commit("setProducts", res);
                return true;
            }
        } catch (e) {
            console.log("Error", e);
            return false;
        }
    },
    read: (context, id) => {},
    update: (context, todoData) => {},
    delete: (context, id) => {},
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
