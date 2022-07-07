import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import firebase from '../firebase/clientApp';
// import { useAuthState } from "react-firebase-hooks/auth";
import Main from "./components/Main";

export default function Home() {

  // Destructure user, loading, and error out of the hook.  
  // const [user, loading, error] = useAuthState(firebase.auth());
  const [user, setUser] = useState(firebase.auth().currentUser);
  // console.log the current user and loading status
 console.log("Current user: ", user ? user.displayName : 'null');

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

      <Main />

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
