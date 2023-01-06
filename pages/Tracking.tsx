import React, { useContext } from "react";


import NavBar from "./components/NavBar";
import TrackingPageBody from "./components/TrackingPageBody";
import Link from "next/link";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useAuth from "../hooks/useAuth";
import PlantContext from "../context/PlantContext";
import Container from "./components/BlurredFlowerContainer"

const Home = () => {

  useAuthRedirect()

  // const { plants, isLoading } = usePlants();
  const { plants } = useContext(PlantContext);
  const { user } = useAuth()

  return (
    <Container>
      <NavBar/>

      <div className='min-h-screen text-gray-100 text-opacity-90 pb-12 flex flex-col items-center m-auto '>
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
                className="ml-4 p-4 text-gray-100 bg-[#2bb32b] hover:bg-[#32cd32] cursor-pointer"
                style={{ borderRadius: '222px 0' }}
              >
                Add a plant +
              </div>
            </Link>
          </div>
        }
      </div>
    </Container >
  );
};

export default Home;
