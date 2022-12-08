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
        <div className=" text-stone-200" style={{ minWidth: '100vw', }} >
            <NavBar hideLogo />

            <main className="pt-20 flex flex-col items-center m-auto">
                <div className="m-0 pb-10 text-left text-[#FFE894] w-3/5">
                    <h3 className="brand -translate-x-1 leading-9 text-2xl">
                        Welcome to
                    </h3>
                    <TreeLogo width={350} height={140} />
                </div>

                <div className={styles.grid}>
                    <div className={styles.leaf + " bg-[#2bb32b] hover:bg-[#32cd32]"}>
                        <Link href="/Tracking" passHref>
                            <div className={styles.card + " text-green font-bold"}>
                                <h2 className="absolute top-10 left-14 text-left justify-start text-green font-bold">
                                    Track &rarr;</h2>
                                <p className='absolute bottom-14 right-16 text-right  text-green w-1/2'>
                                    your plants&apos; maintenance
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.leaf + " bg-[#1f801f] hover:bg-[#259925] pt-10 lg:pt-0"}>
                        <Link href="/social" passHref>
                            <div className={styles.card}>
                                <h2 className="absolute top-10 left-14 text-left justify-start font-bold">
                                    Connect &rarr;
                                </h2>
                                <p className='absolute bottom-3 right-12 text-right w-3/5 p-2'>
                                    Find people you know and see each other&apos;s plants
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
