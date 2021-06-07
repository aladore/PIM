import { SearchExtraValidator, SubscriberTypeValidator } from "@/utils/PropsValidator";

export const SubscriberTypeProp = {
    type: Number,
    default: null,
    validator: SubscriberTypeValidator,
};

export const SearchExtraProp = {
    type: Array,
    validator: SearchExtraValidator,
};
