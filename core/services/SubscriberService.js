import { BaseService } from "@/core/services/BaseService";
import { OfflineBadRequest, OfflineNotFound } from "@/core/services/Responses";
import Tools from "@/utils/Tools";
import { defaultsDeep } from "lodash";

const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

export class SubscriberService extends BaseService {
    constructor() {
        super("subscriber");
    }

    needSync() {
        return this.table
            .where("edited")
            .equals(1)
            .count()
            .then(count => !!count);
    }

    /**
     *
     * @param {Object} config
     * @param {number} lastUpdateTimestamp
     * @return {Promise<any>}
     */
    async synchronize(config, lastUpdateTimestamp) {
        /// SEND
        let subsEdited = await this.table
            .where("edited")
            .equals(1)
            .toArray();

        let subPromises = [];
        for (let sub of subsEdited) {
            let promise = this.tableSync.get(sub.id).then(originSub => {
                if (originSub) {
                    let subDiff = Tools.difference(
                        JSON.parse(JSON.stringify(sub)), // to avoid observer
                        originSub,
                    );

                    subDiff = Tools.objectRemoveEmptyValues(subDiff);
                    subDiff.id = sub.id;
                    subDiff.customId = sub.customId;

                    sub = subDiff;
                }

                return sub;
            });

            subPromises.push(promise);
        }

        subsEdited = await Promise.all(subPromises);
        console.debug("Subscribers to sync:", subsEdited);
        if (subsEdited.length) {
            await this.post("sync", {
                subscribers: subsEdited,
            });
        }

        /// RECEIVE
        const { data } = await this.get("list", {
            params: {
                size: 10000,
                searchExtra: [{ id: "permission" }],
            },
        });

        const subscribers = data.hits.hits.map(value => value._source);

        return await super.dbPutItems(subscribers);
    }

    /**
     * @param {Object[]} searchExtra
     * @return {AxiosPromise}
     */
    async count({ searchExtra = undefined }) {
        return this.get("/count", {
            params: { searchExtra: searchExtra },
            cache: {
                maxAge: MAX_AGE,
                exclude: { query: false },
            },
        });
    }

    /**
     * @param {string} search
     * @param {number} subscriberType - '0' for thirds & '1' for contact
     * @param display - ???
     * @param {number | boolean} enabled
     * @param {Object[]} searchExtra
     * @param {Object[]} searchIn
     * @param {string} filter
     * @param {string} sort - the field name we want to order
     * @param {string} order - 'ASC' OR 'DESC'
     * @param {number} page - greater than 0
     * @param {number} maxResult - item per page
     * @return {AxiosPromise}
     */
    async getList(
        {
            search = undefined,
            month = undefined,
            subscriberType = undefined,
            display = undefined,
            enabledOnly = true,
            all = false,
            searchExtra = undefined,
            searchIn = undefined,
            filter = undefined,
            sort = "name",
            order = undefined,
            page = 1,
            maxResult = 20,
        },
        url = "list",
    ) {
        if (this.isOffline) {
            try {
                const where = {};

                if (enabledOnly) {
                    where.enabled = "1";
                }

                if (typeof subscriberType === "number") {
                    where.type = subscriberType;
                }

                let req = this.table.where(where);

                if (search) {
                    let r = new RegExp(search, "i");
                    req = req.and(function(item) {
                        return r.test(item.name) || r.test(item.customId) || r.test(item.email);
                    });
                }

                let count = await req.count();

                let data = [];
                if (sort) {
                    data = await req.sortBy(sort);
                } else {
                    data = await req.toArray();
                }

                // pagination
                let startIndex = (page - 1) * maxResult,
                    endIndex = startIndex + maxResult;
                data = data.slice(startIndex, endIndex);

                return this.mockAxios(this.mockElasticSearch(data, count));
            } catch (e) {
                console.error(e);
            }
        } else {
            let params = {
                s: search,
                p: page,
                d: display,
                type: subscriberType,
                size: maxResult,
                filter: filter,
                searchExtra: searchExtra,
                searchIn: searchIn,
                sort: sort,
                order: order,
                enabledOnly: enabledOnly ? 1 : null,
                all: all ? 1 : null,
            };

            if (month) {
                params.month = month;
            }

            return await this.get(url, { params: params, });
        }
    }

    /**
     *
     * @param {number|string} subscriberId
     * @param {boolean} customId
     * @return {AxiosPromise}
     */
    async getByIdOrCustomId(subscriberId, customId = false) {
        if (this.isOffline) {
            // dexie doesn't find if it's a number
            subscriberId = "" + subscriberId;

            const where = {};
            if (customId) where.customId = subscriberId;
            else where.id = subscriberId;

            const sub = await this.table.get(where);

            if (!sub) {
                throw new OfflineNotFound();
            }

            return this.mockAxios(sub);
        } else {
            return await this.get((customId ? "customid/" : "") + subscriberId);
        }
    }

    /**
     * Edit subscriber by id or customId
     * @param {string|number} subscriberId
     * @param {string|number} customId
     * @param {Object} data
     * @return {Promise<AxiosResponse>}
     */
    async edit({ id = undefined, customId = undefined, data }) {
        if (!id && !customId) {
            throw new Error("Missing parameter id OR customId");
        }

        if (this.isOffline) {
            const { data: subscriber } = await this.getByIdOrCustomId(id || customId, !!customId);
            data.edited = 1;

            // store the original subscriber for the sync, to make a differential
            let originSub = await this.tableSync.get(subscriber.id);
            if (!originSub) await this.tableSync.put(subscriber);

            const newSub = defaultsDeep(data, subscriber),
                ok = await this.table.update(subscriber.id, newSub);

            if (ok) {
                return this.mockAxios(newSub);
            } else {
                throw new OfflineBadRequest();
            }
        } else {
            let endPath = "";

            if (id) {
                endPath += id;
            } else if (customId) {
                endPath += "customid/" + customId;
            }

            return await this.patch("edit/" + endPath, data);
        }
    }
}
