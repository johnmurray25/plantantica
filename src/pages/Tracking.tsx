import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
// import { IoRefresh } from '@react-icons/all-files/io5/IoRefresh';
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import PlantTrackingDetails from "./components/PlantTrackingDetails";
import Plant from "../../domain/Plant";
import { getPlants, deletePlant } from "../../service/PlantService";
import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import db from "../firebase/db";
import NextHead from "./components/NextHead";

const loadPlantData = async (user: User): Promise<Plant[]> => {
  // get plants from DB 
  let results = await getPlants(user);
  return results;
}

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const Home = () => {
  const [plants, setPlants]: [Plant[], Dispatch<SetStateAction<Plant[]>>] = useState([]);
  const [status, setStatus]: [number, any] = useState(OK);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      setStatus(UNAUTHORIZED);
      return
    }
    setIsLoading(true);
    loadPlantData(user)
      .then(data => {
        setPlants(data)
      })
      .catch(e => {
        console.error(e);
        setStatus(ERR_STATUS)
      })
      .finally(() => setIsLoading(false))
  }, [user, loading, refreshToggle]);

  const remove = useCallback(async (plant: Plant) => {
    if (!confirm(`Delete ${plant.species}?`)) return;

    try {
      await deletePlant(plant, user);
      // setPlants(plants.filter(p => p.species !== plant.species));
      setPlants([]);
      setRefreshToggle(!refreshToggle);
    } catch (e) {
      console.error(e);
      setStatus(ERR_STATUS);
    }
  }, [user, refreshToggle]);

  const waterPlant = useCallback(async (plant: Plant, user: User) => {
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 10;
    // Calculate next watering date
    let newWateringDate = today.getTime() + (daysBetweenWatering * 86400000);
    // Update DB
    await setDoc(
      doc(
        collection(doc(db, 'users', user.email), 'plantTrackingDetails'),
        plant.id),
      { dateToWaterNext: newWateringDate, dateLastWatered: today.getTime() },
      { merge: true }
    );
    // Update state
    let newDate = new Date(newWateringDate);
    plant.dateToWaterNext = newDate;
    plant.dateLastWatered = today;
    let filteredPlants = plants.filter((p) => p.id !== plant.id);
    filteredPlants.push(plant);
    let results = filteredPlants
      .sort((a, b) => {
        if (a.species.toLocaleLowerCase() < b.species.toLocaleLowerCase()) {
          return -1;
        }
        else if (a.species.toLocaleLowerCase() > b.species.toLocaleLowerCase()) {
          return 1;
        }
        else return 0;
      });
    if (results && results.length > 0) setPlants(results);
  }, [plants]);

  return (
    <div className='text-yellow bg-green min-w-full' /**Container */>
      <NextHead /**Header */ />
      <NavBar />

      <div className='min-h-screen p-4 flex flex-col items-center m-auto'>
        <div
          className='m-0 italic'
          style={{ lineHeight: 1.15, fontSize: '3.5rem', }}
        >
          <a>Tracking</a>
          {!plants &&
            <div>
              
            </div>
          }
        </div>
        {isLoading && <ReactLoading type='bars' color="#fff" />}
        {plants && plants.length > 0 ?
          // If user has plants, show plants
          <div>
            <div className="flex justify-between items-center text-center pb-3 pt-6 px-4">
              <p>
                You are tracking {plants.length} plants
              </p>
              <Link href="/AddPlantTrackingDetails" passHref>
                <a className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
                  Add a plant!
                </a>
              </Link>
            </div>
            <PlantTrackingDetails plants={plants} removePlant={remove} waterPlant={waterPlant} />
          </div>
          :
          // If user doesn't have plants, show message
          (!isLoading && user && status === OK ?
            <div className='flex justify-evenly items-center m-10'>
              <p>
                You aren&apos;t tracking any plants yet...
              </p>
              <Link href="/AddPlantTrackingDetails" passHref>
                <a className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
                  Add a plant!
                </a>
              </Link>
            </div>
            :
            <div></div>
          )
        }
        {status == ERR_STATUS && (
          <div>Error retrieving plant tracking details. Please try again later</div>
        )}
        {status == UNAUTHORIZED && (
          <div>No user is logged in.</div>
        )}
      </div>
    </div >
  );
};

export default Home;
