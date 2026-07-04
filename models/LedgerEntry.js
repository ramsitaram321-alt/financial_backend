const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    transcationId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["credit","debit"],
        required: true
    },
    balanceAfterTranscation: {
        type: Number,
        required: true
    }
},
    {timestamps: true}
);

module.exports = mongoose.model("LedgerEntry", ledgerSchema);