import React, { FC, useState } from "react";
import gridStyles from '../../styles/grid.module.css';
import { IoWater } from "@react-icons/all-files/io5/IoWater";
import { IoSunny } from "@react-icons/all-files/io5/IoSunny";
import db from '../../firebase/db';
import auth from '../../firebase/auth';
import { collection, setDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Plant from "../../domain/Plant";
import DropDownMenu from "./DropDownMenu";
import PlantCard from "./PlantCard";

const MILLIS_IN_DAY = 86400000;

interface PTDProps {
  plants: Array<Plant>;
  removePlant: any;
}

const PlantTrackingDetails: FC<PTDProps> = (props) => {

  const [user] = useAuthState(auth);
  const [plants, setPlants] = useState(props.plants);

  const waterPlant = async (plant: Plant) => {
    if (!confirm(`Do you want to mark your ${plant.species} as watered today?`)) {
      return;
    }
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 10;
    // Calculate next watering date
    let newWateringDate = today.getTime() + (daysBetweenWatering * MILLIS_IN_DAY);
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
    console.log(`Updated watering date from ${(plant.dateToWaterNext ? plant.dateToWaterNext : today).toLocaleDateString()} to ${newDate.toLocaleDateString()}`)
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
  }

  const removePlant = (plant: Plant) => {
    props.removePlant(plant)
      .then(() => setPlants(plants.filter(p => p.id !== plant.id)));
  }

  return (
    <div className={gridStyles.container}>
      {plants &&
        plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} waterPlant={waterPlant} removePlant={removePlant} />
        ))}
    </div>
  );
}

export default PlantTrackingDetails;
