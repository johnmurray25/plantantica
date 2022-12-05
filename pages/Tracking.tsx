import React, { useContext } from "react";

import ReactLoading from 'react-loading';

import NavBar from "./components/NavBar";
import TrackingPageBody from "./components/TrackingPageBody";
import Link from "next/link";
import usePlants from "../hooks/usePlants";
import useAuthRedirect from "../hooks/useAuthRedirect";
import UserContext from "../context/UserContext";

const Home = () => {

  useAuthRedirect()

  const { plants, isLoading } = usePlants();
  const { user } = useContext(UserContext)

  return (
    <div className='text-stone-100 min-w-screen bg-green' /**Container */>
      <NavBar />

      <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto mt-0'>
        {plants && plants.length > 0 ?
            <TrackingPageBody
              {...{ plants }}
              uid={user.uid}
            />
            :
            isLoading ?
              <ReactLoading
                type='bars'
                color="#FFF7ED"
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
        }
      </div>
    </div >
  );
};

export default Home;
