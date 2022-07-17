import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import db from '../firebase/db';
import auth from '../firebase/auth';
import { collection, query, doc, getDocs, deleteDoc } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import NavBar from "./components/NavBar";
import PlantTrackingDetails from "./components/PlantTrackingDetails";
import { useAuthState } from "react-firebase-hooks/auth";
import Plant from "../domain/Plant";
import { User } from "firebase/auth";
import { IoRefresh } from '@react-icons/all-files/io5/IoRefresh';

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const getPlants = async (user: User) => {
  try {
    if (!user) return;
    // Load all plant tracking data for current user
    const collectionRef = collection(doc(db, 'users', user.email), 'plantTrackingDetails');
    const queryRef = query(collectionRef);
    const trackingDetails = await getDocs(queryRef);
    return trackingDetails.docs
      .map((doc): Plant => {
        return {
          id: doc.id,
          species: doc.get('species'),
          dateObtained: new Date(doc.get('dateObtained')),
          daysBetweenWatering: doc.get('daysBetweenWatering'),
          dateLastWatered: new Date(doc.get('dateLastWatered')),
          dateToWaterNext: new Date(doc.get('dateToWaterNext')),
          dateLastFed: new Date(doc.get('dateLastFed')),
          dateToFeedNext: new Date(doc.get('dateToFeedNext')),
          lightRequired: doc.get('lightRequired'),
          dateCreated: new Date(doc.get('dateCreated'))
        }
      });
  } catch (error) {
    console.error(error);
    console.error("Failed to fetch plant tracking details");
    throw error;
  }
};

const deletePlant = async (plant: Plant, user: User) => {
  confirm(`Are you sure you want to delete tracking details for your ${plant.species}?`);
  await deleteDoc(doc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plant.id));
  console.log('deleted plant');
}

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
    // force refresh if user's token has expired
    await user.getIdToken();
    console.log('re-authenticated user')
    setIsLoading(true);
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
          <a onClick={refresh} className='hover:text-green hover:bg-yellow cursor-pointer border rounded border-yellow p-2 m-auto absolute'>
            <IoRefresh />
          </a>
        </div>
        {isLoading && <h1>loading...</h1>}
        {plants.length > 0 &&
          (
            <div>
              <div className="flex justify-between items-center text-center pb-3 pt-6">
                <p>
                  You are tracking {plants.length} plants
                </p>
                <p className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
                  <Link href="/AddPlantTrackingDetails">
                    Add a plant!
                  </Link>
                </p>
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
