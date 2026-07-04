const { getChannels } = require("../config/rabbitmq");

const startConsumer =async (queueName, callback) => {
    try {
        const channel = getChannels();
        if (!channel) throw new Error("No channel Found RabbitMQ");
        await channel.assertQueue(queueName, {durable: true});
        console.log("lising on" + queueName);
        channel.consume(queueName, async(message)=> {
            if (!message) return;
            try {
                const data = JSON.parse(message.content.toString());
                await callback(data);
                channel.ack(message);
            }catch (error){
                console.log(error, "consume error");
                channel.nack(message, false, false);
            }
        })
    }catch(error){
        console.log(error);
    }
}
module.exports = startConsumer;