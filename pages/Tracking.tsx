import React, { useContext } from "react";

import ReactLoading from 'react-loading';

import NavBar from "./components/NavBar";
import TrackingPageBody from "./components/TrackingPageBody";
import Link from "next/link";
import usePlants from "../hooks/usePlants";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useAuth from "../hooks/useAuth";
import PlantContext from "../context/PlantContext";
import NavBar2 from "./components/NavBar2";

const Home = () => {

  useAuthRedirect()

  // const { plants, isLoading } = usePlants();
  const { plants } = useContext(PlantContext);
  const { user } = useAuth()

  return (
    <div className='text-gray-100 min-w-screen bg-[#A3A9A3]' >
        <NavBar2 />

        <div className='min-h-screen p-4 px-0 pt-28 flex flex-col items-center m-auto mt-0'>
          {plants && plants.length > 0 ?
            <TrackingPageBody
              uid={user?.uid}
            />
            :
            // isLoading ?
            //   <ReactLoading
            //     type='bars'
            //     color="#FFF7ED"
            //   />
            //   :
            // If user doesn't have plants, show message
            <div className='flex justify-evenly items-center m-10 '>
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
