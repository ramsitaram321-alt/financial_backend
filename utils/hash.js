const crypto = require("crypto");

const generateHash = (eventId, accountId, payload) => {
    return crypto.createHash("sha256").update(eventId + accountId + JSON.stringify(payload)).digest("hex");
}

module.exports = generateHash;