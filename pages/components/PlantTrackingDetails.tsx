import React, { FC, useState } from "react";
import styles from "../../styles/tracking.module.css";
import { IoWater } from "@react-icons/all-files/io5/IoWater";
import { IoMenu } from "@react-icons/all-files/io5/IoMenu";
import db from '../../firebase/db';
import auth from '../../firebase/auth';
import { collection, setDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Plant from "../domain/Plant";

const MILLIS_IN_DAY = 86400000;

interface PTDProps {
  plants: Array<Plant>;
}

const PlantTrackingDetails: FC<PTDProps> = (props) => {

  const [user] = useAuthState(auth);
  const [plants, setPlants] = useState(props.plants);

  const waterPlant = async (plant: Plant) => {
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 10;
    // calculate next watering date
    let newWateringDate: number = today.getTime() + (daysBetweenWatering * MILLIS_IN_DAY);
    // uodate/persist document
    await setDoc(
      doc(
        collection(doc(db, 'users', user.email), 'plantTrackingDetails'),
        plant.id),
      { dateToWaterNext: newWateringDate, dateLastWatered: today.getTime() },
      { merge: true }
    );
    // return object for UI
    let newDate = new Date(newWateringDate);
    console.log(`Updated watering date from ${(plant.dateToWaterNext ? plant.dateToWaterNext : today).toLocaleDateString()} to ${newDate.toLocaleDateString()}`)
    plant.dateToWaterNext = newDate;
    plant.dateLastWatered = today;
    let filteredPlants = plants.filter((p: Plant) => p.id !== plant.id);
    filteredPlants.push(plant);
    setPlants(filteredPlants
      .sort((a, b) => {
        if (a.species.toLocaleLowerCase() < b.species.toLocaleLowerCase()) {
          return -1;
        }
        else if (a.species.toLocaleLowerCase() > b.species.toLocaleLowerCase()) {
          return 1;
        }
        else return 0;
      }));
  }

  return (
    <div className='grid md:grid-rows-2 md:grid-flow-col md:gap-2'>
      {plants.map((plant: Plant) => (
        <div key={plant.id} className={styles.card}>
          <IoMenu className='cursor-pointer' />
          <a href={'http://wikipedia.org/wiki/' + plant.species.replaceAll(' ', '_')}>
            <h2>{plant.species}</h2>
          </a>
          {
            plant.dateObtained &&
            <p style={{ fontSize: "0.7rem", textAlign: "left" }}>
              had since&nbsp;
              {plant.dateObtained.toLocaleDateString()}
            </p>
          }
          <div className="flex justify-end">
            <a onClick={() => waterPlant(plant)}
              className="flex cursor-pointer text-sm px-4 py-2 leading-none border rounded border-yellow text-yellow 
                          hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-0">
              Water <IoWater className="cursor-pointer text-blue" /> ?
            
            </a>
          </div>
          species: {plant.species}
          <br></br>
          days between watering: {plant.daysBetweenWatering}
          <br></br>
          date last watered: {plant.dateLastWatered.toLocaleDateString()}
          <br></br>
          date to water next: {plant.dateToWaterNext.toLocaleDateString()}
          <br></br>
          date last fed: {plant.dateLastFed.toLocaleDateString()}
          <br></br>
          date to feed next: {plant.dateToFeedNext.toLocaleDateString()}
          <br></br>
          light required: {plant.lightRequired}
          <br></br>
        </div>
      ))}
    </div>
  );
}

export default PlantTrackingDetails;
