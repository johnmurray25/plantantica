import Link from "next/link";
import React, { useEffect, useState } from "react";
import firebase from '../firebase/clientApp';
import db from '../firebase/db';
import auth from '../firebase/auth';
import { collection, query, doc, getDocs, setDoc } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import NavBar from "./components/NavBar";
import PlantTrackingDetails from "./components/PlantTrackingDetails";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  console.log(`${user ? user.email : 'No one'} is logged in`);

  useEffect(() => {
    getPlants();
  }, [loading]);

  const getPlants = async () => {
    setIsLoading(true);
    if (!user) {
      console.log('No user is logged in');
      setPlants(403);
      setIsLoading(false);
      return;
    }
    try {
      // Load all plant tracking data for current user
      const collectionRef = collection(doc(db, 'users', user.email), 'plantTrackingDetails');
      const queryRef = query(collectionRef);
      const trackingDetails = await getDocs(queryRef);
      setPlants(trackingDetails.docs
        .map((doc) => {
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
        }));
      setIsLoading(false);
    } catch (error) {
      setPlants(500);
      setIsLoading(false);
      console.error(error);
      console.error("Failed to fetch plant tracking details")
    }
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.main}>
        <div className={styles.title}>
          <a>Tracking</a>
        </div>
        <div className="text-right w-60 hover:underline">
          <Link href="/AddPlantTrackingDetails">
            <a>
              Add a plant!
            </a>
          </Link>
        </div>
          {isLoading && <h1>loading...</h1>}
          {plants.length > 0 && (
            <div>
              <p className='text-left'>
                You are tracking {plants.length} plants
              </p>
              <PlantTrackingDetails {...{ plants }} />
            </div>
          )}
          {plants === 500 && (
            <div>Error retrieving plant tracking details. Please try again later</div>
          )}
          {plants === 403 && (
            <div>No user is logged in.</div>
          )}
      </div>
    </div>
  );
};

export default Home;
