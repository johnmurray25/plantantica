import React, { Suspense, use, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import Plant from "../domain/Plant";
import { getPlants } from "../service/PlantService";
import NextHead from "./components/NextHead";
import TrackingPage from "./components/TrackingPage";
import { User } from "firebase/auth";

interface Props {
  plants: Plant[];
  user: User;
}

const Tracking: React.FC<Props> = (props) => {
  console.log("rendering Tracking")
  const user = props.user;
  const plants = props.plants;

  return (
    <div className='text-yellow min-w-screen bg-green' /**Container */>
      <NextHead />
      <NavBar />

      <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto mt-0'>
        {user &&
          <TrackingPage {...{ plants }} uid={user.uid} />
        }
      </div>
    </div >
  );
};

export default Tracking;

export async function getStaticProps() {
  const user = get;
  const plants = await getPlants(user.uid);
  return { props: { user, plants } }
}
