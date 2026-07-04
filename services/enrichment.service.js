const axios = require("axios");

const enrichTransaction = async (accountId) => {
    try {
        accountId = Number(accountId);
        if (!Number.isInteger(accountId) || accountId < 1 || accountId > 208) {
            return {
                success: false,
                error: "Account number is not valid"
            };
        }
        const response = await axios.get(
            `https://dummyjson.com/users/${accountId}`
        );
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

module.exports = enrichTransaction;