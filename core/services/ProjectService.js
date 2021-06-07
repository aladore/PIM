import axios from "@/plugins/axios";

export default {
    findAllWithLead({ activeOnly = undefined }) {
        return axios.get("/project/lead-management", { params: { activeOnly: activeOnly } });
    },
};
