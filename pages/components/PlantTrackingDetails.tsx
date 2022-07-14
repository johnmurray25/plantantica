import React, { FC, useState } from "react";
import styles from "../../styles/tracking.module.css";
import gridStyles from '../../styles/grid.module.css';
import { IoWater } from "@react-icons/all-files/io5/IoWater";
import { IoMenu } from "@react-icons/all-files/io5/IoMenu";
import db from '../../firebase/db';
import auth from '../../firebase/auth';
import { collection, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Plant from "../domain/Plant";
import DropDownOption from "../domain/DropDownOption";
import DropDownMenu from "./DropDownMenu";

const MILLIS_IN_DAY = 86400000;

const dropDownOptions = [
  new DropDownOption('edit', '/'),
  new DropDownOption('remove', null),
]
interface PTDProps {
  plants: Array<Plant>;
  removePlant: any;
  linkToEdit: any;
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
    let newWateringDate: number = today.getTime() + (daysBetweenWatering * MILLIS_IN_DAY);
    // Persist changes
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

  const removePlant = (plant: Plant) => {
    props.removePlant(plant)
      .then(() => setPlants(plants.filter(p => p.id !== plant.id)));
  }

  return (
    <div className={gridStyles.container}>
      {plants.map((plant: Plant) => (
        <div key={plant.id} className='border border-yellow rounded-md p-5 m-2'>
          <DropDownMenu plantId={plant.id} onClickRemove={() => removePlant(plant)} />
          <h2>
            <a className='hover:underline' href={`http://wikipedia.org/wiki/${plant.species.replaceAll(' ', '_')}`}>
              {plant.species}
            </a>
          </h2>
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
          <div className='pt-4'>
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
        </div>
      ))}
    </div>
  );
}

export default PlantTrackingDetails;
