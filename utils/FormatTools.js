export const SMS = {
    /**
     * Check if contains valid chars for SMS
     * @param {string} value
     * @returns {number}
     */
    checkChars(value) {
        // eslint-disable-next-line
        let smsCharsAccepted = /^[ 0-9a-zA-Zàèéêù!\n\r\"#%&€\$'\(\)\*\+,-\.\/:;<=>?@\[\]_ÀÁÂÃÄÅÈÉËÌÍÎÏÒÓÔÖÙÚÛÜáâãäåçëìíîïðñòóôõöúûüýÿ]*$/g;
        return value.match(smsCharsAccepted);
    },

    /**
     * Count the number of chars for SMS and count double special chars
     * @param {string} value
     * @returns {number}
     */
    countChar(value) {
        return value.length + this.countSpecialChar(value);
    },

    /**
     * Count special chars
     * @param {string} value
     * @returns {number}
     */
    countSpecialChar(value) {
        // eslint-disable-next-line
        let smsCharsDouble = /[àèéêù€\r\n\$ÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜáâãäåçëìíîïðñòóôõöúûüýÿ\[\]]+/g,
            specialChars = value.match(smsCharsDouble);

        if (specialChars) {
            specialChars = specialChars.join("");
            return specialChars.length;
        }

        return 0;
    },

    /**
     * Count the number of SMS
     * @param {string} value
     * @returns {number}
     */
    countNumberOfSms(value) {
        let num;
        if (value.length <= 160) {
            num = 1;
        } else {
            num = Math.ceil(value.length / 153);
        }
        return num;
    },
};
