import React from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import firebase from '../firebase/clientApp';
import auth from '../firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import Main from "./components/Main";
import Link from "next/link";

export default function Home() {

  const [user, loading, error] = useAuthState(auth);
  // if (!loading) console.log(`${user ? user.email : 'No one'} is logged in`);

  return (
    <div className={styles.container}>
      <Head>
        <title>Plantantica</title>
        <meta
          name="description"
          content="A place to track your plants' maintenance"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className={styles.main}>
            <h1 className={styles.title}>
                {
                    user ?
                        <a>
                            Welcome, {user.displayName}!
                        </a>
                        :
                        <a>
                            Welcome to Plantantica!
                        </a>
                }
            </h1>

            <p className={styles.description}>
                {!user && 'A place to track your plants&apos; maintenance'}
            </p>

            <div className={styles.grid}>
                {/* <Link href="/Blog">
                    <a className={styles.card}>
                        <h2>Blog &rarr;</h2>
                        <p>Ask a question, or see what other users have to say.</p>
                    </a>
                </Link> */}

                <Link href="/Tracking">
                    <a className={styles.card}>
                        <h2>Track &rarr;</h2>
                        <p>Track the watering/feeding of your plants</p>
                    </a>
                </Link>

                {/* <Link href="/Cube">
                    <a className={styles.card}>
                        <h2>Cube &rarr;</h2>
                        <p>Look at this cube</p>
                    </a>
                </Link> */}

                {/* <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    className={styles.card}
                >
                    <h2>Deploy &rarr;</h2>
                    <p>
                        Instantly deploy your Next.js site to a public URL with Vercel.
                    </p>
                </a> */}
            </div>
        </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
