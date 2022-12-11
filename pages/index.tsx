import React, { useEffect } from "react";
import Link from "next/link";

import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import { useRouter } from "next/router";
import TreeLogo from "./components/TreeLogo";
import useAuth from "../hooks/useAuth";

export default function Home() {

    const { dBUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (dBUser && !dBUser.username) {
            router.push(`/profile`) // prompt user to add username 
        }
    }, [dBUser, router])

    return (
        <div className="antialiased text-blue-50" style={{ minWidth: '100vw', }} >
            <NavBar hideLogo />

            <main className="pt-20 flex flex-col items-center m-auto">
                <div className="m-0 pb-10 text-left text-brandYellow w-3/5">
                    <h3 className="brand -translate-x-1 leading-9 text-2xl">
                        Welcome to
                    </h3>
                    <TreeLogo width={350} height={140} />
                </div>

                <div className={"flex flex-col med:flex-row mt-8 med:mt-16 "}>
                    <div
                        className={styles.leaf + " bg-green-700 hover:bg-green-600"}
                        style={{ transition: 'background-color 0.3s ease' }}
                    >
                        <Link href="/Tracking" passHref>
                            <div className={styles.card}>
                                <h2 className="font-extrabold brand absolute top-10 left-14 text-left justify-start ">
                                    Track &rarr;</h2>
                                <p className='brand absolute bottom-14 right-16 text-right   w-1/2 pt-8'>
                                    My plants&apos; maintenance
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div
                        className={styles.leaf + " bg-green-900 hover:bg-green-800  pt-10 lg:pt-0"}
                        style={{transition: 'background-color 0.3s ease'}}
                    >
                        <Link href="/social" passHref>
                            <div className={styles.card}>
                                <h2 className="brand absolute top-10 left-14 text-left justify-start font-light">
                                    Explore &rarr;
                                </h2>
                                <p className='brand absolute bottom-3 right-12 text-right font-light w-3/5 p-2 '>
                                    Find your friends and see their plants
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="text-right text-lightYellow text-sm pr-6 pb-2 pt-36">
                    An app by John Murray
                </div>
            </footer>
        </div>
    );
}

// export async function getStaticProps() {
//     return { props: { isStatic: true } }
// }
