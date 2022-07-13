import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter } from 'next/router';
import auth from '../firebase/auth';
import db from '../firebase/db';
import { collection, addDoc, doc } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Button, Link, Select, MenuItem } from "@mui/material";
import Plant from "./domain/Plant";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  plant?: Plant,
}

const AddPlantTrackingDetails: FC<Props> = (props) => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const todaysDate = new Date();
  const [plant, setPlant]: [Plant, Dispatch<SetStateAction<Plant>>] = useState(props.plant);
  const [species, setSpecies] = useState(plant ? plant.species : "");
  const [dateObtained, setDateObtained] = useState(plant ? plant.dateObtained : todaysDate);
  const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant ? plant.daysBetweenWatering : 7);
  const [dateLastWatered, setDateLastWatered] = useState(plant ? plant.dateLastWatered : todaysDate);
  const [dateToWaterNext, setDateToWaterNext] = useState(plant ? plant.dateToWaterNext : todaysDate);
  const [dateLastFed, setDateLastFed] = useState(plant ? plant.dateLastFed : todaysDate);
  const [dateToFeedNext, setDateToFeedNext] = useState(plant ? plant.dateToFeedNext : todaysDate);
  const [lightRequired, setLightRequired] = useState(plant ? plant.lightRequired : 2);

  const savePlantTrackingDetails = async (event) => {
    event.preventDefault();
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
    console.log(`Saving plant tracking details for species: ${plantTrackingDetails.species}`)
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plantTrackingDetails);
    console.log(`Document written with ID: ${docRef.id}`);
    // Redirect back to tracking page
    router.push('/Tracking');
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <a>ADD PLANT TRACKING DETAILS</a>
      </div>
      <div className={styles.main}>
        <form className={styles.form}>
          <fieldset>
            <label htmlFor="species">
              species:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <Input
              className={styles.input}
              type="text"
              name="species"
              id="species"
              placeholder="Enter a species..."
              selected={species}
              onChange={(e) => setSpecies(e.target.value)}
            />
            <br></br>
            <label htmlFor="lightReq">
              light required:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <Select
              id="lightReq"
              className="bg-lightGrayGreen m-2 w-2/5"
              value={lightRequired}
              label="light required"
              onChange={(e) => setLightRequired(e.target.value)}
            >
              <MenuItem value={2}>Bright indirect</MenuItem>
              <MenuItem value={10}>Full sun</MenuItem>
            </Select>
            <br></br>
            <label htmlFor="minDays">
              days between watering:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <Input
              className={styles.input}
              type="number"
              defaultValue={7}
              name="minDays"
              id="minDays"
              min="0"
            />
            <br></br>
            <div className="flex">
              <label htmlFor="nextWater">date last watered:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextWater"
                selected={dateLastWatered}
                onChange={(d) => setDateLastWatered(d)}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="nextWater">date to water next:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextWater"
                selected={dateToWaterNext}
                onChange={(d: Date) => setDateToWaterNext(d)}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="nextFeeding">date last fed:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextFeeding"
                selected={dateLastFed}
                onChange={(d: Date) => setDateLastFed(d)}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="nextFeeding">date to feed next:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextFeeding"
                selected={dateToFeedNext}
                onChange={(d: Date) => setDateToFeedNext(d)}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="dateObtained">date obtained: </label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="dateObtained"
                selected={dateObtained}
                onChange={(d: Date) => setDateObtained(d)}
              />
            </div>
          </fieldset>
          <br></br>
          <Link
            href="/Tracking"
            style={{
              textDecoration: "none",
              alignItems: "space-evenly",
              alignContent: "space-evenly",
              justifyContent: "space-evenly"
            }}
          >
            <Button
              variant="outlined"
              style={{
                color: "rgb(216, 216, 0)",
                borderColor: "rgb(216, 216, 0)",
              }}
            >
              Cancel
            </Button>
          </Link>
          <span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <Button
            type="submit"
            variant="contained"
            className="bg-yellow text-green font-bold hover:bg-lighterYellow"
            onClick={savePlantTrackingDetails}
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddPlantTrackingDetails;
