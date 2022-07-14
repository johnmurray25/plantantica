import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import db from '../firebase/db';
import auth from '../firebase/auth';
import { collection, query, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import NavBar from "./components/NavBar";
import PlantTrackingDetails from "./components/PlantTrackingDetails";
import { useAuthState } from "react-firebase-hooks/auth";
import Plant from "./domain/Plant";
import { User } from "firebase/auth";

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const getPlants = async (user: User) => {
  try {
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
  const router = useRouter();

  // if (!loading) console.log(`${user ? user.email : 'No one'} is logged in`);

  useEffect(() => {
    if (loading && !user) {
      return;
    }
    if (!loading && !user) {
      setStatus(UNAUTHORIZED);
      return;
    }
    setIsLoading(true);
    getPlants(user)
      .then(results => setPlants(results))
      .then(() => setIsLoading(false))
      .catch((e) => {
        console.error(e);
        setStatus(ERR_STATUS);
        // setIsLoading(false);
      });
  }, [user, loading]);

  const remove = async (plant: Plant) => {
    try {
      await deletePlant(plant, user);
      setPlants(plants.filter((p: Plant) => p.id !== plant.id));
    } catch (e) {
      console.error(e);
      setStatus(ERR_STATUS);
    }
  }

  const linkToEdit = (p: Plant) => {
    router.push({
      pathname: '/AddPlantTrackingDetails',
      query: { plant: JSON.stringify(p) }
    }, '/AddPlantTrackingDetails')
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.main}>
        <div className={styles.title}>
          <a>Tracking</a>
        </div>
        {isLoading && <h1>loading...</h1>}
        {plants.length > 0 &&
          (
            <div>
              <div className="flex justify-between pb-3 pt-6">
                <p>
                  You are tracking {plants.length} plants
                </p>
                <p className='hover:underline cursor-pointer'>
                  <Link href="/AddPlantTrackingDetails">
                    Add a plant!
                  </Link>
                </p>
              </div>
              <PlantTrackingDetails plants={plants} removePlant={remove} linkToEdit={linkToEdit} />
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
    </div>
  );
};

export default Home;
