const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    eventId: {
        type: String,
        required: true
    },
    accountId: {
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
    customerName: {
        type: String,
        default: null
    },
    customerEmail: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: "PENDING"
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Transaction", transactionSchema);