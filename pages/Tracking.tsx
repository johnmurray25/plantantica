import React, { useCallback, useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import Plant from "../domain/Plant";
import { getPlants } from "../service/PlantService";
import TrackingPage from "./components/TrackingPage";
import Link from "next/link";
import SignInWithGoogleButton from "./components/SignInWithGoogleButton";

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const Home = () => {
  console.log("rendering Tracking")
  const [plants, setPlants] = useState<Plant[]>(null);
  const [status, setStatus]: [number, any] = useState(OK);
  const [isLoading, setIsLoading] = useState(true);
  const [user, loading] = useAuthState(auth);

  const loadPlants = useCallback(async () => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    console.log("Loading plants...")
    try {
      const res = await getPlants(user.uid)
      setPlants(res)
    } catch (e) {
      console.error(e)
      setStatus(ERR_STATUS)
    } finally {
      setIsLoading(false)
      console.log("finished loading plants")
    }
  }, [user])

  useEffect(() => {
    console.log('Tracking: in useEffect')
    if (!user && !loading) {
      console.log('unauthorized')
      setStatus(UNAUTHORIZED);
      return
    }
    if (plants === null && user) {
      loadPlants();
    }
  }, [loadPlants, loading, plants, user]);
  // end useEffect

  return (
    <div className='text-yellow min-w-screen bg-green' /**Container */>
      <NavBar />

      <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto mt-0'>
        {user ?
          plants ? //&& plants && plants.length > 0 ?
            // If user has plants, show plants
            <TrackingPage {...{ plants }} uid={user.uid} />
            :
            isLoading ?
              <ReactLoading type='bars' color="#fff" />
              :
              // If user doesn't have plants, show message
              <div className='flex justify-evenly items-center m-10'>
                <p>
                  You aren&apos;t tracking any plants yet...
                </p>
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
            <p className="pb-8">
              You aren&apos;t signed in...
            </p>
            <SignInWithGoogleButton />
          </main>
        }
      </div>
    </div >
  );
};

export default Home;
