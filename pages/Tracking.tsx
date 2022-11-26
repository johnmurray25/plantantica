import React, { useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import TrackingPageBody from "./components/TrackingPageBody";
import Link from "next/link";
import SignInWithGoogleButton from "./components/SignInWithGoogleButton";
import usePlants from "../hooks/usePlants";

const Home = () => {
  const { plants, isLoading } = usePlants();
  const [user] = useAuthState(auth);

  return (
    <div className='text-yellow min-w-screen bg-green' /**Container */>
      <NavBar />

      <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto mt-0'>
        {user ?
          plants && plants.length > 0 ?
            <TrackingPageBody
              {...{ plants }}
              uid={user.uid}
            />
            :
            isLoading ?
              <ReactLoading
                type='bars'
                color="#fff"
              />
              :
              // If user doesn't have plants, show message
              <div className='flex justify-evenly items-center m-10'>
                You aren&apos;t tracking any plants yet...
                <Link href="/AddPlantTrackingDetails" passHref >
                  <div
                    className="ml-4 p-4 bg-[#2bb32b] hover:bg-[#32cd32] cursor-pointer"
                    style={{ borderRadius: '222px 0' }}
                  >
                    Add a plant +
                  </div>
                </Link>
              </div>
          :
          <main className="pt-10 text-center">
            You aren&apos;t signed in...
            <SignInWithGoogleButton />
          </main>
        }
      </div>
    </div >
  );
};

export default Home;
