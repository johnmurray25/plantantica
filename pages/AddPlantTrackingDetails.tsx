import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter } from 'next/router';
import auth from '../firebase/auth';
import db from '../firebase/db';
import { collection, addDoc, doc, setDoc, DocumentReference, DocumentData } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Link, Select, MenuItem } from "@mui/material";
import Plant from "../domain/Plant";
import { useAuthState } from "react-firebase-hooks/auth";

const MILLIS_IN_DAY = 86400000;
interface Props {
  plant?: Plant,
}

const row = 'flex justify-between items-center '

const AddPlantTrackingDetails: FC<Props> = (props) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const todaysDate = new Date();
  const [plant, setPlant]: [Plant, Dispatch<SetStateAction<Plant>>] = useState(props.plant);
  const [species, setSpecies] = useState(plant ? plant.species : "");
  const [dateObtained, setDateObtained] = useState(plant ? plant.dateObtained : todaysDate);
  const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant ? plant.daysBetweenWatering : 7);
  const [dateLastWatered, setDateLastWatered] = useState(plant ? plant.dateLastWatered : todaysDate);
  const [dateToWaterNext, setDateToWaterNext] = useState(plant ? plant.dateToWaterNext : new Date(todaysDate.getTime() + daysBetweenWatering * MILLIS_IN_DAY));
  const [dateLastFed, setDateLastFed] = useState(plant ? plant.dateLastFed : todaysDate);
  const [dateToFeedNext, setDateToFeedNext] = useState(plant ? plant.dateToFeedNext : todaysDate);
  const [lightRequired, setLightRequired] = useState(plant ? plant.lightRequired : 2);

  const savePlantTrackingDetails = async (event) => {
    event.preventDefault();
    if (!species) {
      alert('You must enter a species. It can be anything :)');
      return;
    }
    if (!user) {
      console.error('No user is logged in');
      return;
    }
    console.log(`species: ${species}`);
    console.log(`days between watering: ${daysBetweenWatering}`);
    let plantTrackingDetails = {
      species: species,
      dateObtained: dateObtained.getTime(),
      daysBetweenWatering: daysBetweenWatering,
      dateLastWatered: dateLastWatered.getTime(),
      dateToWaterNext: dateToWaterNext.getTime(),
      dateLastFed: dateLastFed.getTime(),
      dateToFeedNext: dateToFeedNext.getTime(),
      lightRequired: lightRequired,
      dateCreated: (new Date()).getTime(),
    };
    let docRef: DocumentReference<DocumentData> = null;
    if (plant) {
      // Update an existing document
      await setDoc(doc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plant.id), plantTrackingDetails);
      console.log('Updated existing plant tracking details');
    } else {
      // Add a new document with a generated id.
      docRef = await addDoc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plantTrackingDetails);
      console.log(`Document written with ID: ${docRef.id}`);
    }
    // Redirect back to tracking page
    router.push('/Tracking');
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <a>{plant ? 'EDIT' : 'ADD'} PLANT TRACKING DETAILS</a>
      </div>
      <div className={styles.main}>
        <form>
          <fieldset className='grid grid-cols-2 gap-x-2 gap-y-6 m-7 items-center' >
            <label htmlFor='species'>
              Species:
            </label>
            <Input
              className={styles.input}
              type="text"
              name="species"
              id="species"
              placeholder="Enter a species..."
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required={true}
            />
            <label htmlFor="lightReq">
              Requires
            </label>
            <Select
              id="lightReq"
              className="bg-lightGrayGreen"
              value={lightRequired}
              label="light required"
              onChange={(e) => setLightRequired(e.target.value)}
            >
              <MenuItem value={2}>Bright indirect light</MenuItem>
              <MenuItem value={10}>Full sun</MenuItem>
            </Select>
            <label htmlFor="minDays">
              Days between watering:
            </label>
            <Input
              className={styles.input}
              type="number"
              name="minDays"
              id="minDays"
              value={daysBetweenWatering}
              onChange={(e) => {
                if (!e.target.value) {
                  return;
                }
                setDaysBetweenWatering(parseInt(e.target.value));
                let newWaterDate = new Date(dateLastWatered.getTime() + daysBetweenWatering * MILLIS_IN_DAY);
                setDateToWaterNext(newWaterDate);
              }}
            />
            <label htmlFor="nextWater">Last watered on</label>
            <DatePicker
              className={styles.input}
              id="nextWater"
              selected={dateLastWatered}
              onChange={(d: Date) => {
                setDateLastWatered(d);
                setDateToWaterNext(new Date(d.getTime() + daysBetweenWatering * MILLIS_IN_DAY));
              }}
            />
            <label htmlFor="nextWater">Water next on</label>
            <DatePicker
              className={styles.input}
              id="nextWater"
              selected={dateToWaterNext}
              onChange={(d: Date) => setDateToWaterNext(d)}
            />
            <label htmlFor="nextFeeding">Last fed on</label>
            <DatePicker
              className={styles.input}
              id="nextFeeding"
              selected={dateLastFed}
              onChange={(d: Date) => setDateLastFed(d)}
            />
            <label htmlFor="nextFeeding">Feed next on</label>
            <DatePicker
              className={styles.input}
              id="nextFeeding"
              selected={dateToFeedNext}
              onChange={(d: Date) => setDateToFeedNext(d)}
            />
            <label htmlFor="dateObtained">Obtained plant on (or around)</label>
            <DatePicker
              className={styles.input}
              id="dateObtained"
              selected={dateObtained}
              onChange={(d: Date) => setDateObtained(d)}
            />
          </fieldset>
          <div className='flex justify-evenly'>
            <Link href="/Tracking">
              <button className='border border-yellow rounded text-yellow py-2.5 px-7 mt-4'>
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="bg-yellow text-green py-2.5 rounded px-7 mt-4"
              onClick={savePlantTrackingDetails}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div >
  );
}

export default AddPlantTrackingDetails;
