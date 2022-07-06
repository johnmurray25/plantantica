import React, { useState } from "react";
import firebase from '../firebase/clientApp';
import db from '../firebase/db';
import { collection, addDoc, doc } from "firebase/firestore";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Button, Link, Select, MenuItem } from "@mui/material";
import brightness from './util/BrightnessConstant';

function AddPlantTrackingDetails() {
  const todaysDate = new Date();
  const [species, setSpecies] = useState("");
  const [dateObtained, setDateObtained] = useState(todaysDate);
  const [minDays, setMinDays] = useState(7);
  const [maxDays, setMaxDays] = useState(10);
  const [dateLastWatered, setDateLastWatered] = useState(todaysDate);
  const [dateToWaterNext, setDateToWaterNext] = useState(todaysDate);
  const [dateLastFed, setDateLastFed] = useState(todaysDate);
  const [dateToFeedNext, setDateToFeedNext] = useState(todaysDate);
  const [lightRequired, setLightRequired] = useState(2)

  const savePlantTrackingDetails = async (event) => {
    event.preventDefault();
    let user = firebase.auth().currentUser;
    if (!user) {
      console.error('No user is logged in');
      return;
    }
    console.log(`species: ${species}`);
    console.log(`min days: ${minDays}`);
    console.log(`max days: ${maxDays}`);
    let plantTrackingDetails = {
      species: species,
      dateObtained: dateObtained,
      minDaysBetweenWatering: minDays,
      maxDaysBetweenWatering: maxDays,
      dateLastWatered: dateLastWatered,
      dateToWaterNext: dateToWaterNext,
      dateLastFed: dateLastFed,
      dateToFeedNext: dateToFeedNext,
      lightRequired: lightRequired
    };
    console.log(`Saving plant tracking details for species: ${plantTrackingDetails.species}`)
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plantTrackingDetails);
    console.log(`Document written with ID: ${docRef.id}`);
  };

  const onChangeDateObtained = (date) => {
    setDateObtained(date);
  };
  const incMinDays = (n) => {
    setMinDays(n);
  };
  const incMaxDays = (n) => {
    setMaxDays(n);
  };
  const onChangeNextWater = (date) => {
    setDateToWaterNext(date);
  };
  const onChangeNextFeeding = (date) => {
    setDateToFeedNext(date);
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
              species:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
              min days between watering:
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
            <label htmlFor="maxDays">
              max days between watering:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <Input
              className={styles.input}
              type="number"
              defaultValue={10}
              name="maxDays"
              id="maxDays"
              min="0"
            />
            <br></br>
            <div className="flex">
              <label htmlFor="nextWater">date last watered:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextWater"
                selected={dateToWaterNext}
                onChange={onChangeNextWater}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="nextFeeding">date last fed:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextFeeding"
                selected={dateLastFed}
                onChange={(d) => setDateLastFed(d)}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="nextFeeding">date to feed next:</label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="nextFeeding"
                selected={dateToFeedNext}
                onChange={onChangeNextFeeding}
              />
            </div>
            <br></br>
            <div className="flex">
              <label htmlFor="dateObtained">date obtained: </label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker
                className={styles.input}
                id="dateObtained"
                selected={dateObtained}
                onChange={onChangeDateObtained}
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
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
