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
            <link rel="icon" href="../src/public/tree-logo.ico" />
        </Head>
    )
}

export default NextHead