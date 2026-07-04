const WebhookEvent = require("../models/WebhookEvent");
const publishMessage = require("../queues/producer");
const generateHash = require("../utils/hash");
const processWebHook = require("../workers/ingest.worker");

const receiveWebhook =async ( req , res ) => {
    try {
        const secret = req.headers["x-webhook-secret"];

        if (secret !== (process.env.WEBHOOK_SECRET || "secretcode")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Header not validated"
            });
        }

        const { eventId , accountId , payload } = req.body;

        if (!eventId || !accountId || !payload) {
            return res.status(400).json({
                success: false,
                message: "eventId, accountId and payload are required"
            });
        }

        const eventHash =await generateHash(eventId, accountId, payload);
        // const existingEvent = await WebhookEvent.findOne({ eventHash });

        // if (existingEvent) {
        //     return res.status(200).json({
        //         success: true,
        //         message: "Duplicate Event Detected And Ignored"
        //     })
        // }

        // await WebhookEvent.create({
        //     eventId,
        //     accountId,
        //     payload,
        //     eventHash
        // });

        // await processWebHook(eventId);
        await publishMessage("webhook_queue", {eventId, accountId, payload, eventHash});

        return res.status(200).json({
            "success": true,
            "message": "Webhook accepted and queued successfully",
            "data": {
                "eventId": eventId,
                "accountId": accountId,
            }
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    receiveWebhook
}