"use client"
/* eslint-disable @next/next/no-page-custom-font */
import React, { useContext } from "react";
import Link from "next/link";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import UserContext from "./context/UserContext";
import DBUserContext from "./context/DBUserContext";

export default function Home() {
    console.log('rendering Home')

    const user = useContext(UserContext)
    const userInDB = useContext(DBUserContext)

    return (
        <div className=" text-yellow"
            style={{
                minWidth: '100vw',
            }}
        >
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

            <main className="p-4 pt-28 flex flex-col items-center m-auto"
                style={{ minHeight: '100vh' }}
            >
                <h1 className="m-0 text-center"
                    style={{ lineHeight: 1.15, fontSize: '2rem' }}
                >
                    <p className='py-6'>
                        {userInDB ?
                            `Welcome, ${userInDB.displayName.split(' ')[0] || user.displayName.split(' ')[0]}`
                            : 'Welcome to Plantantica'}
                    </p>
                </h1>

                <div className={styles.grid}>
                    <div className={styles.leaf + " bg-[#2bb32b] hover:bg-[#32cd32]"}>
                        <Link href={`Tracking/${user?.uid}`} passHref className={styles.card}>
                            <h2 className="absolute top-10 left-14 text-left justify-start text-green font-bold"
                            >
                                Track &rarr;
                            </h2>
                            <p className='absolute bottom-14 right-16 text-right font-bold text-green w-1/2'>
                                your plants&apos; watering/feeding
                            </p>
                        </Link>
                    </div>

                    <div className={styles.leaf + " bg-[#1f801f] hover:bg-[#259925]"}>
                        <Link href="/social" passHref className={styles.card}>
                            <h2 className="absolute top-10 left-14 text-left justify-start font-bold">Connect &rarr;</h2>
                            <p className='absolute bottom-3 right-12 text-right w-3/5 p-2'>
                                Find people you know and see each other&apos;s plants
                            </p>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="text-right text-sm pr-6 pb-2">
                    An app by John Murray
                </div>
            </footer>
        </div>
    );
}