import Link from "next/link";
import React, { useEffect, useState } from "react";
import firebase from '../firebase/clientApp';
import db from '../firebase/db';
import { collection, query, doc, getDocs } from "firebase/firestore";
import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import PlantTrackingDetails from "./components/PlantTrackingDetails";

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(firebase.auth().currentUser);

 console.log("Current user: ", currentUser ? currentUser.displayName : 'null');

  useEffect(() => {
    getPlants();
  }, []);

  const getPlants = async () => {
    setIsLoading(true);
    let user = currentUser;
    if (!user) {
      console.error('No user is logged in');
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
            species: doc.get('species'),
            dateObtained: doc.get('dateObtained'),
            minDaysBetweenWatering: doc.get('minDays'),
            maxDaysBetweenWatering: doc.get('maxDays'),
            dateLastWatered: doc.get('dateLastWatered'),
            dateToWaterNext: doc.get('dateToWaterNext'),
            dateLastFed: doc.get('dateLastFed'),
            dateToFeedNext: doc.get('dateToFeedNext'),
            lightRequired: doc.get('lightRequired')
          }
        }));
      plants.forEach((plant) => console.log(plant))
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
          </Link></div>
        <div className={styles.grid}>
          {isLoading && <h1>loading...</h1>}
          {plants.length > 0 && (
            <div>
              <p style={{ textAlign: "left" }}>
                {plants.length} plants found
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
    </div>
  );
};

export default Home;
