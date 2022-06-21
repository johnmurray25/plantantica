import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/tracking.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Button } from "@mui/material";

function AddPlantTrackingDetails() {
  const [species, setSpecies] = useState("");
  const [dateObtained, setDateObtained] = useState(new Date());
  const [minDays, setMinDays] = useState(7);
  const [maxDays, setMaxDays] = useState(10);

  const router = useRouter();
  const back = () => {
    router.back();
  };

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
  const onChangeDateObtained = (d) => {
    setDateObtained(d);
  };
  const incMinDays = (n) => {
    setMinDays(n);
  };
  const incMaxDays = (n) => {
    setMaxDays(n);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <a>ADD PLANT TRACKING DETAILS</a>
      </div>
      <button onClick={back}>X</button>
      <div className={styles.main}>
        <form className={styles.form}>
          <fieldset>
            <label>species:</label>
            <input className={styles.input} type="text" value={species} onChange={onChangeSpecies} />
            <br></br>
            <label htmlFor="dateObtained">had since: </label>
            <DatePicker className={styles.input}
              id="dateObtained"
              selected={dateObtained}
              onChange={onChangeDateObtained}
            />
            <label htmlFor="minDays">min days between watering: </label>
            <Input 
              className={styles.input}
              type="number"
              defaultValue={7}
              name="minDays"
              id="minDays"
              min="0"
            />
            <br></br>
            <label htmlFor="maxDays">max days between watering: </label>
            <Input
              className={styles.input}
              type="number"
              defaultValue={10}
              name="maxDays"
              id="maxDays"
              min="0"
            />
          </fieldset>
          <br></br>
          <Button type="submit" onClick={savePlantTrackingDetails}>
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddPlantTrackingDetails;
