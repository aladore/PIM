export function renderTemplate(data, params) {
    if (typeof params !== "object") {
        throw new Error("params must be of type object");
    }

    if (data) {
        try {
            data = eval("`" + data + "`");
        } catch (e) {
            console.log("Error Eval", e);
        }

        return data;
    }

    return "";
}
