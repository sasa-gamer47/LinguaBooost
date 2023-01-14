import mongoose from "mongoose";

const connection = {}

export default async function dbConnect() {
    if (connection.db) {
        return connection.db;
    }

    const db = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    });

    connection.db = db;

    return db;
}