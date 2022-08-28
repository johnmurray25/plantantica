import React, { useCallback, useEffect } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";

import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import NextHead from './components/NextHead'
// import Cubes from './components/Cubes'
import auth from '../firebase/auth';
import { getUserByEmailDeprecated, getUserByUid, initializeUser, mapDocToUser } from '../service/UserService';
import { User } from "firebase/auth";
import { useRouter } from "next/router";

export default function Home() {

    const [user] = useAuthState(auth);
    const router = useRouter()

    const getUserInfo = useCallback(async (user: User) => {
        // Get user doc, or create new
        let userDoc = await getUserByUid(user)

        // If user does not have username... 
        let loggedInUser = await mapDocToUser(userDoc);
        if (!loggedInUser.username && loggedInUser.email) {
            // Redirect to 'Edit Profile' page
            router.push(`/profile`)
        }
    }, [router])

    useEffect(() => {
        if (user) {
            getUserInfo(user)
        }
    }, [user, getUserInfo])

    return (
        <div className="bg-green text-yellow"
            style={{ minWidth: '100vw' }}
        >
            <NextHead />
            <NavBar />

            <main className="p-4 flex flex-col items-center m-auto"
                style={{ minHeight: '100vh' }}
            >
                <h1 className="m-0 italic text-center"
                    style={{ lineHeight: 1.15, fontSize: '3.5rem' }}
                >
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

                <p className="text-center mt-4 mb-6"
                    style={{
                        lineHeight: 1.5,
                        fontSize: '1.3rem',
                    }}
                >
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

                    <Link href="/search">
                        <a className={styles.card}>
                            <h2>Connect &rarr;</h2>
                            <p className='text-center'>
                                Find people you know and see each other&apos;s plants
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
