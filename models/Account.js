const mongooes = require("mongoose");

const accountSchema = new mongooes.Schema({
    accountId: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
},
    {timestamps: true}
);

module.exports = mongooes.model("Account", accountSchema);