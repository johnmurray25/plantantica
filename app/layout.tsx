"use client"
/* eslint-disable @next/next/no-page-custom-font */
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import Head from "next/head"
import ReactLoading from 'react-loading';

import NavBar from "./NavBar"
import './globals.css'
import { Suspense, useEffect, useState } from 'react';
import UserContext from './context/UserContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../firebase/auth';
import DBUser from '../domain/DBUser';
import { getUserDBRecord } from '../service/UserService';
import DBUserContext from './context/DBUserContext';
import { getProfilePictureByFilename } from '../service/FileService';
import ProfPicUrlContext from './context/ProfPicUrlContext';

// Bind loading/progress functions to Next event listeners
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [firebaseUser] = useAuthState(auth);
  const [dbUser, setDbUser] = useState<DBUser>();
  const [profPicUrl, setProfPicUrl] = useState('');

  console.log("HOME:: firebase user: " + firebaseUser?.email)

  useEffect(() => {
    if (firebaseUser) {
      getUserDBRecord(firebaseUser.uid)
        .then((u) => {
          setDbUser(u)
          if (u?.profilePicture) {
            getProfilePictureByFilename(firebaseUser.uid, u.profilePicture)
              .then(setProfPicUrl)
              .catch(e => {
                console.error(e)
                console.error("Failed to get profPicUrl")
              })
          }
        })
        .catch(e => {
          console.error(e)
          console.error("Failed to get user document")
        })
    }
  }, [firebaseUser])

  return (
    <html>
      <Head>
        <title>Plantantica</title>
        <meta
          name="description"
          content="A place to track your plants' maintenance"
        />
        <link rel="icon" href="../public/tree-logo.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300&family=Montserrat&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <div className="text-white antialiased"
          style={{
            minWidth: '100vw',
          }}
        >
          {firebaseUser && dbUser &&
            <UserContext.Provider value={firebaseUser}>
              <DBUserContext.Provider value={dbUser}>
                <ProfPicUrlContext.Provider value={profPicUrl}>
                  <Suspense fallback={<ReactLoading type='bars' />}>
                    <NavBar />
                    {children}
                  </Suspense>
                </ProfPicUrlContext.Provider>
              </DBUserContext.Provider>
            </UserContext.Provider>
          }
        </div>
      </body>
    </html>
  )

}
