const enrichTransaction = require("../services/enrichment.service");
const publishMessage = require("../queues/producer");
const Transaction = require("../models/Transaction");

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const processEnrichment = async (data) => {
    try {

        console.log("Starting Enrichment Worker...");
        let result;
        for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`API Attempt ${attempt}`);
            result = await enrichTransaction(data.accountId);
            if (result.success) {
                break;
            }
            if (result.error === "Account number is not valid") {
                throw new Error(result.error);
            }
            console.log("API Failed. Retrying...");
            await delay(attempt * 1000);
        }

        if (!result.success) {
            throw new Error("External API Failed after 3 retries");
        }

        console.log("External API Success");
        const transaction = await Transaction.findOne({
            transactionId: data.transactionId
        });

        if (transaction) {
            transaction.customerName = result.data.firstName + " " + result.data.lastName;
            transaction.customerEmail = result.data.email;
            transaction.status = "ENRICHED";
            await transaction.save();
        }

        await publishMessage("ledger_queue", {
            accountId: data.accountId,
            transactionId: data.transactionId
        });

        console.log("Published to ledger_queue");

    } catch (error) {
        console.log("Enrichment Worker Error:", error.message);
        throw error;
    }
};

module.exports = processEnrichment;