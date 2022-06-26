import React, { useState } from "react";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Button, Link } from "@mui/material";
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
    console.log(`species: ${species}`);
    console.log(`min days: ${minDays}`);
    console.log(`max days: ${maxDays}`);
    let details = {
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
    console.log(`details: ${details.species}`)
    let response = await fetch(
      "http://localhost:8080/plant-tracking-details/save",
      {
        method: "POST",
        body: JSON.stringify(details),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((data) => {
      console.log(`Saved plant tracking details with id ${data.id}`);
    });
  };

  const onChangeSpecies = (s) => {
    setSpecies(s);
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
            <input
              className="text-start  bg-lightGrayGreen text-slate"
              type="text"
              name="species"
              id="species"
              placeholder="Enter a species..."
              selected={species}
              onChange={onChangeSpecies}
            />
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
            <label htmlFor="nextWater">date last watered:</label>
            <DatePicker
              className={styles.input}
              id="nextWater"
              selected={dateLastWatered}
              onChange={(d) => setDateLastWatered(d)}
            />
            <br></br>
            <label htmlFor="nextWater">date to water next:</label>
            <DatePicker
              className={styles.input}
              id="nextWater"
              selected={dateToWaterNext}
              onChange={onChangeNextWater}
            />
            <br></br>
            <label htmlFor="nextFeeding">date last fed:</label>
            <DatePicker
              className={styles.input}
              id="nextFeeding"
              selected={dateLastFed}
              onChange={(d) => setDateLastFed(d)}
            />
            <br></br>
            <label htmlFor="nextFeeding">date to feed next:</label>
            <DatePicker
              className={styles.input}
              id="nextFeeding"
              selected={dateToFeedNext}
              onChange={onChangeNextFeeding}
            />
            <br></br>
            <label htmlFor="dateObtained">date obtained: </label>
            <DatePicker
              className={styles.input}
              id="dateObtained"
              selected={dateObtained}
              onChange={onChangeDateObtained}
            />
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
            className="bg-yellow text-green font-bold"
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
