import React from "react";
import Head from "next/head";
import { Navbar } from "./";

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>LinguaBoost</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <main>{children}</main>
        </>
    );
};

export default Layout;
