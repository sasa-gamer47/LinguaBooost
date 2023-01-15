import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log('uri: ',uri);
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    new Error("Please add your Mongo URI to .env.local");
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
