import React, { useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";

import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import { getUser, mapDocToUser } from '../service/UserService';
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import DBUser from "../domain/DBUser";
import TreeLogo from "./components/TreeLogo";
import UserContext from "../context/UserContext";

export default function Home() {

    const { user } = useContext(UserContext)
    const router = useRouter()
    const [userInDB, setUserInDB] = useState<DBUser>(null);

    const getUserInfo = useCallback(async (user: User) => {
        // Get user doc, or create new
        let userDoc = await getUser(user)

        let u = await mapDocToUser(userDoc);
        setUserInDB(u);
        // If user does not have username... 
        if (!u.username && u.email) {
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
        <div className=" text-stone-200" style={{ minWidth: '100vw', }} >
            <NavBar hideLogo />

            <main className="p-4 pt-20 flex flex-col items-center m-auto"
                style={{ height: '100vh' }}
            >
                <h1 className="m-0 text-left text-[#FFE894] w-3/5"
                    style={{ lineHeight: 1.15, fontSize: '2rem' }}
                >
                    <h3 style={{fontSize: "1.5rem"}} className="brand">
                        Welcome to
                    </h3>
                    <TreeLogo width={350} />
                    {/* {
                        userInDB ?
                            <a>
                                Welcome, {userInDB.displayName.split(' ')[0] || user.displayName.split(' ')[0]}
                            </a>
                            :
                            <a>
                                Welcome to Plantantica
                            </a> 
                    */}
                </h1>

                <p className="text-center mt-4 mb-6"
                    style={{
                        lineHeight: 1.5,
                        fontSize: '1.3rem',
                    }}
                >
                    {/* {!user && "A place to track your plants' maintenance"} */}
                </p>

                <div className={styles.grid}>
                    {/* <Link href="/Blog">
                    <a className={styles.card}>
                        <h2>Blog &rarr;</h2>
                        <p>Ask a question, or see what other users have to say.</p>
                    </a>
                </Link> */}

                    <div className={styles.leaf + " bg-[#2bb32b] hover:bg-[#32cd32]"}>
                        <Link href="/Tracking" passHref>
                            <div className={styles.card}>
                                <h2 className="absolute top-10 left-14 text-left justify-start text-green font-bold"
                                >
                                    Track &rarr;</h2>
                                <p className='absolute bottom-14 right-16 text-right font-bold text-green w-1/2'>
                                    your plants&apos; maintenance
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.leaf + " bg-[#1f801f] hover:bg-[#259925] pt-10 lg:pt-0"}>
                        <Link href="/social" passHref>
                            <div className={styles.card}>
                                <h2 className="absolute top-10 left-14 text-left justify-start font-bold">Connect &rarr;</h2>
                                <p className='absolute bottom-3 right-12 text-right w-3/5 p-2'>
                                    Find people you know and see each other&apos;s plants
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="text-right text-lightYellow text-sm pr-6 pb-2">
                    An app by John Murray
                </div>
            </footer>
        </div>
    );
}

export async function getStaticProps() {
    return { props: { isStatic: true } }
}
