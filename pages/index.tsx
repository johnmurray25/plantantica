import React, { useEffect } from "react";
import { useRouter } from "next/router";

import useAuth from "../hooks/useAuth";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {

    const { dBUser, user, initialized } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (dBUser && !dBUser.username) {
            router.push(`/profile`) // prompt user to add username 
        }
    }, [dBUser, router])

    return !initialized ?
        <LoadingScreen />
        :
        user ?
            <HomePage />
            :
            <LandingPage />
    }
    
    // export async function getStaticProps() {
        //     return { props: { isStatic: true } }
        // }
        
        // <div className={`antialiased text-blue-50 font-light
        //         ${width <= 420 ? '' : 'bg-repeat-space'}`} >
        //     <NavBar hideLogo />
    
        //     <main className="pt-36 flex flex-col items-center w-full">
        //         {/* <div className="m-0 mb-2 p-6 px-12 text-left text-white w-fit bg-gray-200 bg-opacity-10 shadow-md ">
        //             <h3 className=" -translate-x-1 leading-9 text-2xl">
        //                 Welcome to
        //             </h3>
        //             <TreeLogo width={125} height={200} />
        //         </div> */}
        //         <div
        //             style={{
        //                 fontSize: "1.7rem"
        //             }}
        //             className="unbounded pr-1 text-center text-gray-100 "
        //         >
        //             <div
        //                 style={{ fontSize: "1.5rem" }}
        //                 className="text-gray-100 text-opacity-80 -translate-x-12"
        //             >
        //                 WELCOME TO
        //             </div>
        //             <div className="flex items-center justify-center text-left ">
        //                 {/* {width <= 420 && <TreeLogo width={125} height={200} />} */}
        //                 <TreeLogo width={125} height={200} />
        //                 PLANTANTICA
        //                 {/* <TreeLogo width={125} height={200} /> */}
        //                 {/* {width <= 420 && <TreeLogo width={125} height={200} />} */}
        //             </div>
        //         </div>
    
        //         <div className="flex items-center flex-col med:flex-row mt-8 med:mt-16 w-fit ">
        //             <button
        //                 className="w-full bg-primary bg-opacity-80 hover:bg-opacity-40  p-4 px-10 mb-12 shadow rounded-md border-b border-r border-stone-500 border-opacity-25 transition-colors"
        //                 style={{ transition: 'background-color 0.3s ease', fontSize: "2.1rem" }}
        //                 onClick={() => router.push("/Tracking")}
        //             >
        //                 <h2
        //                     className="//font-light flex items-center text-left justify-between text-gray-50 text-opacity-80"
        //                 >
        //                     TRACK&nbsp;<IoChevronForward />
        //                 </h2>
        //                 <p className='futura text-right pt-6 text-xl text-gray-100 text-opacity-90'>
        //                     My plants&apos; maintenance
        //                 </p>
        //             </button>
    
        //             <button
        //                 className="w-full px-8 bg-opacity-80 bg-primary hover:bg-opacity-40 //hover:bg-gradient-to-tl p-4 mb-12 shadow rounded-md border-b border-r border-stone-500 border-opacity-25"
        //                 style={{ transition: 'background-color 0.3s ease', fontSize: "2.1rem" }}
        //                 onClick={() => router.push("/social")}
        //             >
        //                 <h2 className="//font-light w-full text-left justify-between flex items-center text-gray-50 text-opacity-80">
        //                     EXPLORE&nbsp;<IoChevronForward />
        //                 </h2>
        //                 <div className="flex justify-end">
        //                     <p className='futura text-right pt-6 w-full text-lg text-gray-100 text-opacity-90'>
        //                         Connect with friends
        //                     </p>
        //                 </div>
        //             </button>
        //         </div>
        //     </main>
    
        //     <footer className={styles.footer}>
        //         {/* <div className="text-right text-lightYellow text-sm pr-6 pb-2 pt-36">
        //             An app by John Murray
        //         </div> */}
        //     </footer>
        // </div>