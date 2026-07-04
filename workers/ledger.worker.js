const Account = require("../models/Account");
const LedgerEntry = require("../models/LedgerEntry");
const Transaction = require("../models/Transaction");

const updateLedger =async (data) => {
    try { 
        const { accountId, transactionId } = data;
        const transcations =await Transaction.find({accountId}).sort({createdAt : -1});

        let balance = 0;

        await LedgerEntry.deleteMany({accountId});

        for (const transcation of transcations){
            if (transcation.type == "credit"){
                balance += transcation.amount;
            }else {
                balance -= transcation.amount;
            }
            
            await LedgerEntry.create({
                accountId,
                transcationId: transcation.transactionId,
                amount: transcation.amount,
                type: transcation.type,
                balanceAfterTranscation: balance
            });
        }

        await Account.findOneAndUpdate({accountId},{balance},{ upsert: true, new: true });
         const latestTransaction = await Transaction.findOne({
            transactionId
        });

        if (latestTransaction) {
            latestTransaction.status = "COMPLETED";
            await latestTransaction.save();
        }
        console.log("Ledger Updated");

    } catch(error) {
        console.log(error);
    }
}

module.exports = updateLedger;