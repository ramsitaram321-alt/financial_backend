const express = require('express');
const connectDB = require('./config/db');
const WebHookRouter = require('./routes/webhook.routes');
const { connectRabbitMQ } = require('./config/rabbitmq');
const startConsumer = require('./queues/consumer');
const processWebHook = require('./workers/ingest.worker');
const processEnrichment = require('./workers/enrichment.worker');
const updateLedger = require('./workers/ledger.worker');
const app = express();
require("dotenv").config();

app.use(express.json());

connectDB();
connectRabbitMQ().then(()=>{
    startConsumer("webhook_queue", processWebHook);
    startConsumer("enrichment_queue", processEnrichment);
    startConsumer("ledger_queue", updateLedger);
});

app.use("/webhook", WebHookRouter);

app.get("/", (req, res) => {
    res.send("Backend server is running");
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});