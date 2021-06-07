import axios from "@/plugins/axios";
import store from "@/store/store";
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import * as path from "path";

export class BaseService {e
    constructor(basePath = "", tableName = null) {
        this.axios = axios;
        this.basePath = basePath;
        this.tableName = tableName || basePath;
    }

    /**
     * @return {Dexie.Promise<number>}
     */
    tableCount() {
        return this.table.count();
    }

    /**
     *
     * @param {Object} config
     * @param {number} lastUpdateTimestamp
     * @return {Promise<any>}
     */
    synchronize(config, lastUpdateTimestamp) {}

    /**
     * @return {Dexie.Promise<boolean>}
     */
    needSync() {}

    /**
     *
     * @param {AxiosRequestConfig} config
     * @return AxiosPromise
     */
    request(config) {
        config.url = path.join("/", this.basePath, config.url + "");

        return this.axios.request(config);
    }

    /**
     *
     * @param {string | number} url
     * @param {AxiosRequestConfig} config
     * @return {AxiosPromise}
     */
    get(url, config = {}) {
        config.method = "get";
        config.url = url;

        return this.request(config);
    }

    /**
     *
     * @param {string} url
     * @param {AxiosRequestConfig} config
     * @return {AxiosPromise}
     */
    delete(url, config = {}) {
        config.method = "delete";
        config.url = url;

        return this.request(config);
    }

    /**
     *
     * @param {string} url
     * @param data
     * @param {AxiosRequestConfig} config
     * @return {AxiosPromise}
     */
    post(url, data = null, config = {}) {
        config.method = "post";
        config.url = url;
        config.data = data;

        return this.request(config);
    }

    /**
     *
     * @param {string} url
     * @param data
     * @param {AxiosRequestConfig} config
     * @return {AxiosPromise}
     */
    put(url, data = null, config = {}) {
        config.method = "put";
        config.url = url;
        config.data = data;

        return this.request(config);
    }

    /**
     *
     * @param {string} url
     * @param data
     * @param {AxiosRequestConfig} config
     * @return {AxiosPromise}
     */
    patch(url, data = null, config = {}) {
        config.method = "patch";
        config.url = url;
        config.data = data;

        return this.request(config);
    }

    /**
     * @protected
     * @return {boolean}
     */
    get isOffline() {
        return store.getters.isOffline && store.getters.isGranted("OFFLINE") && this.isEnabledOffline;
    }

    get isEnabledOffline() {
        return store.getters.offlineConfig[this.basePath]?.enabled;
    }

    /**
     *
     * @param data
     * @param status
     * @return {AxiosResponse}
     */
    mockAxios(data, status = 200) {
        return {
            status: status,
            data: data,
        };
    }

    /**
     *
     * @param {Object[]} data
     * @param {number} count
     */
    mockElasticSearch(data, count) {
        return {
            hits: {
                total: count,
                hits: data.map(value => {
                    return {
                        _source: value,
                    };
                }),
            },
        };
    }
}
