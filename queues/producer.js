const { getChannels } = require("../config/rabbitmq");

const publishMessage =async ( queueName, message ) => {
    try {
        const channel = getChannels();
        if (!channel) { 
            throw new Error ("RabbitMQ channel not found");
        }
        await channel.assertQueue(queueName, {durable: true});
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {persistent: true});
        console.log("Message sent to" + queueName);
    }catch (error) {
        console.log(error, "consume error");

        await channel.assertQueue("dead_letter_queue", {
            durable: true
        });

        channel.sendToQueue(
            "dead_letter_queue",
            Buffer.from(message.content),
            {
                persistent: true
            }
        );

        console.log("Message moved to dead_letter_queue");

        channel.ack(message);
    }
}

module.exports = publishMessage;