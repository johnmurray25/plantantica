import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../styles/tracking.module.css";
import Link from "next/link";

function PlantTrackingDetails(props) {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  const [plants, setPlants] = useState(props.plants);

  return (
    <div>
      {plants.map((plant) => (
        <div key={plant.species} className={[styles.card]}>
          <a>
            <h2>{plant.species}</h2>
            <p
              style={{
                fontSize: "0.7rem",
                textAlign: "right",
              }}
            >
              had since&nbsp;
              {formatDate(plant.dateCreated)}
              <br></br>
              <br></br>
              
            </p>
            <h4>{plant.body}</h4>
          </a>
        </div>
      ))}
    </div>
  );
}

export default PlantTrackingDetails;
