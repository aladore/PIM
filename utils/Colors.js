export const Colors = {
    colors: {
        0: "amber darken-1", // note
        1: "cyan darken-1", // E-mail
        2: "red darken-3", // SMS
        3: "deep-purple darken-2", // Task
        4: "green darken-1", // Event
    },

    hexa: {
        0: "#ffb300",
        1: "#00acc1",
        2: "#c62828",
        3: "#512da8",
        4: "#43a047",
    },

    getColor(type, hexa = false) {
        if (hexa) {
            return this.hexa[type];
        }
        return this.colors[type];
    },
};

export default Colors;
