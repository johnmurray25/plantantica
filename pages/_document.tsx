import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                {/* <link href="https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@600&display=swap" rel="stylesheet" /> */}
                {/* <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300&family=Montserrat&display=swap" rel="stylesheet" /> */}
                {/* <link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni&display=swap" rel="stylesheet" /> */}
                <link href="https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Inconsolata:wght@300&family=Inter&family=Inter+Tight&family=Poppins&family=Unbounded&family=Work+Sans:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}