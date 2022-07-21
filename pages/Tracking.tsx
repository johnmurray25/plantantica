import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
// import { IoRefresh } from '@react-icons/all-files/io5/IoRefresh';
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import PlantTrackingDetails from "./components/PlantTrackingDetails";
import styles from "../styles/tracking.module.css";
import Plant from "../domain/Plant";
import { getPlants, deletePlant } from "../service/PlantService";

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const Home = () => {
  const [plants, setPlants]: [Plant[], Dispatch<SetStateAction<Plant[]>>] = useState([]);
  const [status, setStatus]: [number, any] = useState(OK);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  const refresh = useCallback(async () => {
    if (!user) {
      if (!loading) setStatus(UNAUTHORIZED);
      return
    }
    setIsLoading(true);
    // reload in case user's token has expired
    await user.reload();
    await user.getIdToken();
    console.log('re-authenticated user')
    getPlants(user)
      .then(results => setPlants(results))
      .then(() => setIsLoading(false))
      .catch((e) => {
        console.error(e);
        setStatus(ERR_STATUS);
        setIsLoading(false);
      });
  }, [user, loading])

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (plant: Plant) => {
    try {
      await deletePlant(plant, user);
      setPlants(plants.filter((p: Plant) => p.id !== plant.id));
    } catch (e) {
      console.error(e);
      setStatus(ERR_STATUS);
    }
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.main}>
        <div className={styles.title}>
          <a>Tracking</a>
        </div>
        <div className="flex justify-end w-10/12 mb-4">
          {/* <a onClick={refresh} className='hover:text-green hover:bg-yellow cursor-pointer border rounded border-yellow p-2 m-auto absolute'>
            <IoRefresh />
          </a> */}
        </div>
        {isLoading && <ReactLoading type='bars' color="#fff" />}
        {plants.length > 0 &&
          (
            <div>
              <div className="flex justify-between items-center text-center pb-3 pt-6">
                <p>
                  You are tracking {plants.length} plants
                </p>
                <Link href="/AddPlantTrackingDetails" passHref>
                  <a className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
                    Add a plant!
                  </a>
                </Link>
              </div>
              <PlantTrackingDetails plants={plants} removePlant={remove} />
            </div>
          )}
        {plants.length === 0 && !isLoading && user && status === OK &&
          (
            <div>
              You aren&apos;t tracking any plants yet
            </div>
          )
        }
        {status === ERR_STATUS && (
          <div>Error retrieving plant tracking details. Please try again later</div>
        )}
        {status === UNAUTHORIZED && (
          <div>No user is logged in.</div>
        )}
      </div>
    </div >
  );
};

export default Home;
