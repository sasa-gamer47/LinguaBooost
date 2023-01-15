import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.JWT_SECRET,

    pages: {
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: "/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)

        callbacks: {
        jwt: async (token, user, account, isNewUser) => {
            console.log("isNewUser: ", isNewUser);
            //There is no relevant info using this
        },
        },
    },
    adapter: MongoDBAdapter(clientPromise),
});
