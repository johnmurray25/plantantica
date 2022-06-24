import React, { useState } from "react";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Button, Link } from "@mui/material";

function AddPlantTrackingDetails() {
  const todaysDate = new Date();
  const [species, setSpecies] = useState("");
  const [dateObtained, setDateObtained] = useState(todaysDate);
  const [minDays, setMinDays] = useState(7);
  const [maxDays, setMaxDays] = useState(10);
  const [nextWater, setNextWater] = useState(todaysDate);
  const [nextFeeding, setNextFeeding] = useState(todaysDate);

  const savePlantTrackingDetails = async (event) => {
    event.preventDefault();
    console.log(`species: ${species}`);
    console.log(`min days: ${minDays}`);
    console.log(`max days: ${maxDays}`);
    let details = {
      species: species,
      minDaysBetweenWatering: minDays,
      maxDaysBetweenWatering: maxDays,
      
    };
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
    setNextWater(date);
  };
  const onChangeNextFeeding = (date) => {
    setNextFeeding(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <a>ADD PLANT TRACKING DETAILS</a>
      </div>
      <div className={styles.main}>
        <form className={styles.form}>
          <fieldset>
            <label>
              species:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <Input
              className={styles.input}
              type="text"
              name="species"
              id="minDays"
              min="0"
              value={species}
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
            <label htmlFor="nextWater">next watering date: </label>
            <DatePicker
              className={styles.input}
              id="nextWater"
              selected={nextWater}
              onChange={onChangeNextWater}
            />
            <br></br>
            <label htmlFor="nextFeeding">next feeding date: </label>
            <DatePicker
              className={styles.input}
              id="nextFeeding"
              selected={nextFeeding}
              onChange={onChangeNextFeeding}
            />
            <br></br>
            <label htmlFor="dateObtained">had since: </label>
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
            style={{
              backgroundColor: "rgb(216, 216, 0)",
              color: "rgb(28, 61, 28)",
            }}
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
