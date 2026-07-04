Webhook

1st install the required packages by 
npm install / npm i (in termial)

then the api endpoint is 

http://localhost:3001/webhook
type : POST

and please also give header with name and value of

x-webhook-secret: secretcode

Request Body Example :-

{
  "eventId": "evt_1001",
  "accountId": "1",
  "payload": {
    "amount": 1000,
    "type": "credit"
  }
}

eventid :- we need to pass the unique event ID
accountId :- account id is like a account number and please pass it in number from 1 to 208 because we have use extrenal api https://dummyjson.com/users
payload :- need to pass an object with amount and with type of debit/credit

in db we will get 1 db name financial_backend

in that 4 collection with created

- ACCOUNTS :- where we can see the balance and accountId
- ledgerentries :- where we can see the activity of tracations it have accountId , transationId, amount, type(debit/credit), balanceAfterTranscation
- transactions :- where the whole transactions are saved with eventId, accuntId, amount, type, customerName, customerEmail, status
- webhookevents :- where the webhooks events are stored with its status with eventId, accountId, eventHash (unique), payload, status 

RabbitMQ queues are :-
webhook_queue, -> create a webbhook and also create a pending transactions then goes to enrichment_queue
enrichment_queue, -> update the transaction and fails then try 3 times i success then goes to ledger_queue
ledger_queue -> updates ladger and accounts


