import Head from 'next/head'
import React from 'react'

function NextHead() {
    return (
        <Head>
            <title>Plantantica</title>
            <meta
                name="description"
                content="A place to track your plants' maintenance"
            />
            <link rel="icon" href="../public/tree-logo.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300&family=Montserrat&display=swap" rel="stylesheet" />
        </Head>
    )
}

export default NextHead