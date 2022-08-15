import React from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";

import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import NextHead from './components/NextHead'
// import Cubes from './components/Cubes'
import auth from '../firebase/auth';

export default function Home() {

    const [user, loading, error] = useAuthState(auth);

    return (
        <div className={styles.container + " bg-green "}>
            <NextHead />
            <NavBar />

            <main className={styles.main + " bg-green "}>
                <h1 className={styles.title}>
                    {
                        user && user.displayName ?
                            <a>
                                Welcome, {user.displayName.split(' ')[0]}!
                            </a>
                            :
                            <a>
                                Welcome to Plantantica!
                            </a>
                    }
                </h1>

                <p className={styles.description}>
                    {!user && "A place to track your plants' maintenance"}
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
                            <p className='text-center'>
                                Track your plants&apos; watering/feeding
                            </p>
                        </a>
                    </Link>

                    {/*<Link href='/Magic'>
                        <a className={styles.card}>
                            <h2>Magic &rarr;</h2>
                            <p>Enter the nature</p>
                        </a>
                        </Link>*/}

                </div>
            </main>

            {/* <footer className={styles.footer}>
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
      </footer> */}
        </div>
    );
}

export async function getStaticProps() {
    return { props: { isStatic: true } }
}
