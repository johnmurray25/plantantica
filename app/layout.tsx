"use client"
/* eslint-disable @next/next/no-page-custom-font */
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

import './globals.css'

// Bind loading/progress functions to Next event listeners
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
import Head from "next/head"
import NavBar from "./NavBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
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
      <body>
        <div className=" text-yellow"
          style={{
            minWidth: '100vw',
          }}
        >
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  )

}
