import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";

import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import NextHead from './components/NextHead'
// import Cubes from './components/Cubes'
import auth from '../firebase/auth';
import { getUser, mapDocToUser } from '../service/UserService';
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import Plant from "../domain/Plant";
import DBUser from "../domain/DBUser";

const bgImage = `background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1017%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(39%2c 47%2c 39%2c 1)'%3e%3c/rect%3e%3cpath d='M140 101.82C132.89 119.73 146.23 126.79 133.11 140C76.23 197.27 41.31 242.78 0 242.78C-25.25 242.78 0 191.39 0 140C0 70 -35 35 0 0C35 -35 70 0 140 0C164.35 0 188.7 -15.35 188.7 0C188.7 35.56 160.68 49.73 140 101.82' stroke='rgba(43%2c 179%2c 43%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M339.23 140C360.93 80.31 319.25 45.73 345.63 0C359.63 -24.27 382.82 0 420 0C490 0 490 0 560 0C630 0 630 0 700 0C719.09 0 719.75 -4.27 738.18 0C789.75 11.96 788.32 31.93 840 32.46C909.23 33.18 910.28 1.22 980 2.5C1050.28 3.79 1056.6 6.16 1120 37.61C1195.2 74.91 1188.6 88.8 1257.2 140C1258.6 141.04 1258.56 142.09 1260 142.09C1261.59 142.09 1262.86 141.88 1263.26 140C1277.86 70.83 1251.41 39.51 1290 0C1319.78 -30.49 1345 0 1400 0C1470 0 1505 -35 1540 0C1575 35 1540 70 1540 140C1540 210 1540 210 1540 280C1540 350 1540 350 1540 420C1540 490 1568 518 1540 560C1521.33 588 1492.51 565.09 1446.67 560C1422.51 557.31 1422.1 544.44 1400 544.44C1388.26 544.44 1391.61 558.6 1379 560C1321.61 566.38 1319.5 560 1260 560C1216.72 560 1210.65 574.47 1173.45 560C1140.65 547.25 1147.94 505.56 1120 505.56C1089.26 505.56 1092.81 545.72 1056.09 560C1022.81 572.94 1018.05 560 980 560C910 560 910 560 840 560C770 560 770 560 700 560C630 560 630 560 560 560C490 560 490 560 420 560C350 560 350 560 280 560C210 560 210 560 140 560C70 560 43.85 586.15 0 560C-26.15 544.4 -26.15 492.72 0 476.49C43.85 449.27 80.24 492.64 140 473.1C166.63 464.39 168.08 449.76 172.77 420C183.29 353.21 144.36 338.21 170.43 280C197.98 218.48 223.16 227.67 280 180.53C307.56 157.67 328.12 170.57 339.23 140' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M560 92.54C531 92.54 504 118.3 504 140C504 159.53 531.34 175 560 175C592.68 175 626.67 159.76 626.67 140C626.67 118.53 592.33 92.54 560 92.54' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M560 387.69C543.78 387.69 526.84 404.44 526.84 420C526.84 434.59 543.73 448 560 448C575.49 448 590.36 434.54 590.36 420C590.36 404.39 575.54 387.69 560 387.69' stroke='rgba(43%2c 179%2c 43%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M103.38 0C125.34 40.59 106.68 80.59 75.74 140C54.99 179.83 23.51 198.48 0 198.48C-14.36 198.48 0 169.24 0 140C0 70 -29.73 40.27 0 0C21.96 -29.73 87.47 -29.41 103.38 0' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M406.54 140C425.15 121.34 413.14 86.15 420 86.15C426.87 86.15 414.93 121.94 434 140C484.93 188.24 491.59 200.75 560 218.75C624.59 235.75 649.1 236.11 700 210C725.87 196.73 689.78 161.54 713.55 140C759.78 98.13 773.99 101.77 840 83.19C907.22 64.27 910.25 63.34 980 65C1050.25 66.67 1054.83 66.26 1120 89.85C1158.43 103.76 1153.6 114.92 1187.2 140C1223.6 167.16 1222.64 194.33 1260 194.33C1301.37 194.33 1314.28 177.6 1344.65 140C1384.28 90.94 1367.9 77.13 1400 21C1407.93 7.13 1409.34 2.31 1424.71 0C1479.34 -8.19 1507.48 -25.13 1540 0C1565.13 19.42 1552.72 49.34 1540 89.09C1530.32 119.34 1495.2 118.07 1495.2 140C1495.2 156.86 1532.94 144.61 1540 166.67C1555.34 214.61 1540 223.33 1540 280C1540 350 1540 350 1540 420C1540 467.25 1567.7 502.7 1540 514.5C1497.7 532.52 1464.18 467.88 1400 479.63C1339.93 490.63 1348.26 527.42 1291.5 560C1278.26 567.6 1275.75 560 1260 560C1248.55 560 1245.53 567.19 1237.09 560C1175.53 507.56 1181.2 440.74 1120 440.74C1052.66 440.74 1050 500.37 980 560C980 560 980 560 980 560C910 560 910 560 840 560C770 560 770 560 700 560C630 560 630 560 560 560C509.38 560 501.97 575.25 458.77 560C431.97 550.54 442.07 510.59 420 510.59C392.69 510.59 394.5 547.83 360 560C324.5 572.53 320 560 280 560C225.81 560 178.25 588.36 171.61 560C161.86 518.36 234.16 493.88 247.23 420C258.93 353.88 210.64 342.07 221.16 280C227.03 245.36 248.36 250.48 280 226.58C341.05 180.48 355.15 191.55 406.54 140' stroke='rgba(43%2c 179%2c 43%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M560 33.22C516.73 33.22 470.91 8.58 470.91 0C470.91 -8.03 515.45 0 560 0C589.69 0 619.39 -7.74 619.39 0C619.39 8.87 590.97 33.22 560 33.22' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1120 214.67C1079.42 214.67 1028.13 242.34 1028.13 280C1028.13 325.7 1081.69 381.38 1120 381.38C1151.34 381.38 1167.42 328.43 1167.42 280C1167.42 245.07 1149.06 214.67 1120 214.67' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M560 342.82C521.24 342.82 480.79 382.82 480.79 420C480.79 454.85 521.13 486.89 560 486.89C597 486.89 632.53 454.74 632.53 420C632.53 382.71 597.11 342.82 560 342.82' stroke='rgba(43%2c 179%2c 43%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M0 537.89C31 537.89 78.75 554.37 78.75 560C78.75 565.42 30.74 568.63 0 560C-8.63 557.58 -8.38 537.89 0 537.89' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M49.54 0C56.36 52.03 39.68 73.64 18.36 140C14.91 150.73 5.7 154.18 0 154.18C-3.48 154.18 0 147.09 0 140C0 70 -18.3 51.7 0 0C6.47 -18.3 47.18 -17.97 49.54 0' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M826.45 140C828.22 133.08 832.64 134.51 840 133.91C909.42 128.26 910.15 125.84 980 127.5C1038.48 128.89 1096.67 127.92 1096.67 140C1096.67 152.59 1028.66 143.73 980 176.84C925.78 213.73 918.93 220.52 890.91 280C861.66 342.1 882.16 351.08 865.45 420C856.7 456.08 868.73 478.24 840 490C786 512.11 754.5 510.82 700 487.74C671.85 475.82 674.7 453.48 674.7 420C674.7 391.23 679.54 385.63 700 363.24C743.52 315.63 772.19 333.81 802.67 280C835.42 222.19 809.55 206.13 826.45 140' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M271.88 280C271.88 275.11 274.86 274.45 280 272.63C348.92 248.2 349.33 230.06 420 227.5C489.33 224.99 490.74 242.71 560 262.5C582.62 268.96 603.75 271.15 603.75 280C603.75 288.88 577.99 283.05 560 297.95C493.48 353.05 495.54 357.45 434.74 420C425.54 429.46 430.6 441.96 420 441.96C397.78 441.96 388.88 438.49 369.09 420C318.88 373.07 319.56 368.09 280 311.11C270.96 298.09 271.88 294.35 271.88 280' stroke='rgba(43%2c 179%2c 43%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1223.87 280C1228.62 257.44 1238.17 246.57 1260 246.57C1309.57 246.57 1343.36 241.5 1366.67 280C1395.86 328.22 1394.66 370.45 1365 420C1341.33 459.54 1308.04 458.18 1260 458.18C1237.28 458.18 1228.43 444.41 1223.48 420C1210.36 355.32 1210.36 344.16 1223.87 280' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1450 280C1464.05 245.87 1505.81 250 1540 250C1550.81 250 1540 265 1540 280C1540 350 1540 350 1540 420C1540 423.5 1543.17 427 1540 427C1508.17 427 1484.95 444.42 1470 420C1439.95 370.92 1429.05 330.87 1450 280' stroke='rgba(43%2c 179%2c 43%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M512.62 560C512.62 550.55 534.37 525.78 560 525.78C598.58 525.78 641.05 551.09 641.05 560C641.05 568.2 600.53 560 560 560C536.31 560 512.62 567.66 512.62 560' stroke='rgba(250%2c 252%2c 214%2c 1)' stroke-width='2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1017'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");`

export default function Home() {

    const [user] = useAuthState(auth);
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
        <div className=" text-yellow"
            style={{
                minWidth: '100vw',
                backgroundImage: bgImage
            }}
        >
            <NextHead />
            <NavBar />

            <main className="p-4 pt-28 flex flex-col items-center m-auto"
                style={{ minHeight: '100vh' }}
            >
                <h1 className="m-0 text-center"
                    style={{ lineHeight: 1.15, fontSize: '2rem' }}
                >
                    {
                        userInDB ?
                            <a>
                                Welcome {userInDB.displayName.split(' ')[0] || user.displayName.split(' ')[0]}
                            </a>
                            :
                            <a>
                                Welcome to Plantantica
                            </a>
                    }
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
                        <Link href="/Tracking">
                            <div className={styles.card}>
                                <h2 className="absolute top-10 left-14 text-left justify-start text-green font-bold"
                                >
                                    Track &rarr;</h2>
                                <p className='absolute bottom-14 right-16 text-right font-bold text-green w-1/2'>
                                    your plants&apos; watering/feeding
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.leaf + " bg-[#1f801f] hover:bg-[#259925]"}>
                        <Link href="/social">
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
                <div className="text-right text-sm pr-6 pb-2">
                    An app by John Murray
                </div>
            </footer>
        </div>
    );
}

export async function getStaticProps() {
    return { props: { isStatic: true } }
}
