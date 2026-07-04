const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: true
    },
    eventHash: {
        type: String,
        unique: true,
        required: true,
    },
    payload: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "PENDING"
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("WebHookEvent", webhookEventSchema);