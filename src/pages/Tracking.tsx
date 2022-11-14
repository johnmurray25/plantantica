import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import Plant from "../domain/Plant";
import { getPlants } from "../service/PlantService";
import { User } from "firebase/auth";
import NextHead from "./components/NextHead";
import TrackingPage from "./components/TrackingPage";

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const Home = () => {
  console.log("rendering Tracking")
  const [plants, setPlants] = useState<Plant[]>(null);
  const [status, setStatus]: [number, any] = useState(OK);
  const [isLoading, setIsLoading] = useState(false);
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
        {isLoading ?
          <ReactLoading type='bars' color="#fff" />
          :
          <div></div>
        }
        {user && plants &&
          // plants && plants.length > 0  ?
          // If user has plants, show plants
          <TrackingPage {...{ plants }} uid={user.uid} />
          // :
          // // If user doesn't have plants, show message
          // <div>
          //   {!isLoading && user && status === OK ?
          //     <div className='flex justify-evenly items-center m-10'>
          //       <p>
          //         You aren&apos;t tracking any plants yet...
          //       </p>
          //       <Link href="/AddPlantTrackingDetails" passHref>
          //         <a className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
          //           Add a plant +
          //         </a>
          //       </Link>
          //     </div>
          //     // :
          //     // <div>
          //     //   {status == ERR_STATUS && (
          //     //     <div>Error retrieving plant tracking details. Please try again later</div>
          //     //   )}
          //     //   {status == UNAUTHORIZED && (
          //     //     <div>No user is logged in.</div>
          //     //   )}
          //     </div>
          // }
          // </div>
        }
      </div>
    </div >
  );
};

export default Home;
