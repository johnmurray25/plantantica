import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter } from 'next/router';
import auth from '../firebase/auth';
import db from '../firebase/db';
import storage from "../firebase/storage";
import { collection, addDoc, doc, setDoc, DocumentReference, DocumentData } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Link, Select, MenuItem } from "@mui/material";
import Plant from "../domain/Plant";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes } from "firebase/storage";

const MILLIS_IN_DAY = 86400000;
interface Props {
  plant?: Plant,
}

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
  const [selectedFile, setSelectedFile]: [File, Dispatch<SetStateAction<File>>] = useState();

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
    // save image to firebase storage
    let imageRef: string = null;
    if (selectedFile) {
      let storageRef = ref(storage, 'plant-images');
      let bytes = await selectedFile.arrayBuffer();
      let fileRef = await uploadBytes(storageRef, bytes);
      imageRef = fileRef.ref.fullPath;
    }
    // save document to firestore db
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
    if (imageRef) {
      plantTrackingDetails = {
        ...plantTrackingDetails,
        picture: imageRef
      }
    }
    console.log('image ref: '+imageRef);
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

  const onChangeDaysBetweenWatering = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value.replace(/\D/g, '');
    let val = Number(s);
    setDaysBetweenWatering(val);
    let newWaterDate = new Date(dateLastWatered.getTime() + val * MILLIS_IN_DAY);
    setDateToWaterNext(newWaterDate);
  }

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
            <label htmlFor="selectedFile">
              Image
            </label>
            <input
              id='selectedFile'
              type='file'
              onChange={(e) => setSelectedFile(e.target.files[0])}
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
              <MenuItem value={10}>Bright light</MenuItem>
            </Select>
            <label htmlFor="minDays">
              Days between watering:
            </label>
            <input
              className='bg-lightGrayGreen p-2 mb-2 text-slate text-center'
              type="text"
              name="minDays"
              id="minDays"
              value={String(daysBetweenWatering)}
              onChange={onChangeDaysBetweenWatering}
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
