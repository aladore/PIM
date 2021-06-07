import { BaseService } from "@/core/services/BaseService";
import axios from "@/plugins/axios";

const MAX_AGE = 16 * 60 * 60 * 1000; // 16 hours

export class TransactionService extends BaseService {
    constructor() {
        super("transaction");
    }

    /*
     * Contract
     */
    /**
     *
     * @param {number} contractId
     * @param {number} statusId
     */
    contractSetStatus(contractId, statusId) {
        return this.patch(`/contract/${contractId}/status`, { status: statusId });
    }

    /*
     * Lead
     */
    contractsGetDownloadLink(contractId) {
        return this.get(`/contract/${contractId}/download-link`);
    }
}

export default {
    add(data) {
        return axios.post("/transaction/lead", data);
    },

    leadSummary() {
        return axios.get("/transaction/lead/summary", { cache: { maxAge: MAX_AGE } });
    },

    /**
     *
     * @param {Date | string} dateBegin
     * @param {Date | string} dateEnd
     * @return {AxiosPromise<any>}
     */
    contractSummary({ dateBegin, dateEnd }) {
        return axios.get("/transaction/contract/summary", {
            params: { dateBegin: dateBegin, dateEnd: dateEnd },
            cache: { maxAge: MAX_AGE, exclude: { query: false } },
        });
    },

    contractStatuses() {
        return axios.get("/transaction/contract/statuses", { cache: { maxAge: MAX_AGE } });
    },
};
