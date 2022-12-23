import React, { useEffect } from "react";
import Link from "next/link";
import { IoPeople } from '@react-icons/all-files/io5/IoPeople';
import { IoChevronForward } from '@react-icons/all-files/io5/IoChevronForward';

import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import { useRouter } from "next/router";
import TreeLogo from "./components/TreeLogo";
import useAuth from "../hooks/useAuth";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function Home() {

    const { width } = useWindowDimensions()
    const { dBUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (dBUser && !dBUser.username) {
            router.push(`/profile`) // prompt user to add username 
        }
    }, [dBUser, router])

    return (
        <div className={`antialiased text-blue-50 //bg-tree 
                ${width <= 420 ? '' : 'bg-repeat-space'}`} >
            <NavBar hideLogo />

            <main className="pt-36 flex flex-col items-center w-full">
                {/* <div className="m-0 mb-2 p-6 px-12 text-left text-white w-fit bg-gray-200 bg-opacity-10 shadow-md ">
                    <h3 className=" -translate-x-1 leading-9 text-2xl">
                        Welcome to
                    </h3>
                    <TreeLogo width={125} height={200} />
                </div> */}
                <div
                    style={{
                        fontSize: "2.2rem"
                    }}
                    className="pr-1 text-center text-gray-100"
                >
                    <div
                        style={{ fontSize: "1.5rem" }}
                        className="text-opacity-80 text-gray-100 -translate-x-12"
                    >
                        WELCOME TO
                    </div>
                    <div className="flex items-center justify-center text-left text-opacity-100">
                        {/* {width <= 420 && <TreeLogo width={125} height={200} />} */}
                        <TreeLogo width={125} height={200} />
                        PLANTANTICA
                        {/* <TreeLogo width={125} height={200} /> */}
                        {/* {width <= 420 && <TreeLogo width={125} height={200} />} */}
                    </div>
                </div>

                <div className="flex items-center flex-col med:flex-row mt-8 med:mt-16 w-9/12 ">
                    <button
                        className="w-auto bg-primary bg-opacity-80 hover:bg-opacity-40  p-4 px-6 mb-12 shadow rounded-md border-b border-r border-stone-500 border-opacity-25 transition-colors"
                        style={{ transition: 'background-color 0.3s ease', fontSize: "2.1rem" }}
                        onClick={() => router.push("/Tracking")}
                    >
                        <h2
                            className="//font-light flex items-center text-left justify-between text-gray-100 text-opacity-80"
                        >
                            TRACK&nbsp;<IoChevronForward />
                        </h2>
                        <p className=' text-right pt-6 text-xl text-gray-100 text-opacity-90'>
                            My plants&apos; maintenance
                        </p>
                    </button>

                    <button
                        className="w-auto px-8 bg-opacity-80 bg-primary hover:bg-opacity-40 //hover:bg-gradient-to-tl p-4 mb-12 shadow rounded-md border-b border-r border-stone-500 border-opacity-25"
                        style={{ transition: 'background-color 0.3s ease', fontSize: "2.1rem" }}
                        onClick={() => router.push("/social")}
                    >
                        <h2 className="//font-light w-full text-left justify-between flex items-center text-gray-100 text-opacity-80">
                            EXPLORE&nbsp;<IoChevronForward />
                        </h2>
                        <div className="flex justify-end">
                            <p className=' text-right pt-6 w-full text-lg text-gray-100 text-opacity-90'>
                                Connect with friends
                            </p>
                        </div>
                    </button>
                </div>
            </main>

            <footer className={styles.footer}>
                {/* <div className="text-right text-lightYellow text-sm pr-6 pb-2 pt-36">
                    An app by John Murray
                </div> */}
            </footer>
        </div>
    );
}

// export async function getStaticProps() {
//     return { props: { isStatic: true } }
// }
