const amqp = require('amqplib');
let connection;
let channel;
const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost:5672");
        channel = await connection.createChannel();
        console.log("RabbitMq connected");
    } catch (error) {
        console.log("Error with RabbitMQ connection:" , error);
    }
}

const getChannels = () => {
    return channel;
}

module.exports = {
    getChannels,
    connectRabbitMQ,
}