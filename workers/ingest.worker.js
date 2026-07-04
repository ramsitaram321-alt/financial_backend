const Transaction = require("../models/Transaction");
const WebhookEvent = require("../models/WebhookEvent");
const publishMessage = require("../queues/producer");
const updateLedger = require("./ledger.worker");

const processWebHook = async (data) => {
    try {
        const existingEvent = await WebhookEvent.findOne({
            eventHash: data.eventHash
        });

        if (existingEvent) {
            console.log("Duplicate Event Ignored");
            return;
        }

        const webhook = await WebhookEvent.create({
            eventId: data.eventId,
            accountId: data.accountId,
            payload: data.payload,
            eventHash: data.eventHash,
            status: "PENDING"
        });

        const transaction = await Transaction.create({
            transactionId: Date.now().toString(),
            eventId: data.eventId,
            accountId: data.accountId,
            amount: data.payload.amount,
            type: data.payload.type
        });

        await publishMessage("enrichment_queue", {
            accountId: data.accountId,
            transactionId: transaction.transactionId,
            webhookId: webhook._id
        });

        console.log("Published to enrichment_queue");

        // console.log("Webhook Processed Successfully");

    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = processWebHook;