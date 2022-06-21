import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../styles/tracking.module.css";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import EditIcon from "@material-ui/icons/Edit";
import Link from "next/link";

function PlantTrackingDetails(props) {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  const [plants, setPlants] = useState(props.plants);

  return (
    <div>
      <Link href="/AddPlantTrackingDetails">
        <div style={{ textAlign: "right", color: "#063a20" }}>
          Add a plant!
          <IconButton className={styles.icon}>
            <AddCircleOutlineRoundedIcon fontSize="large" />
          </IconButton>
        </div>
      </Link>
      {plants.map((plant) => (
        <div key={plant.id} className={[styles.card]}>
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
              <IconButton className={styles.icon}>
                <EditIcon textAlign="right" />
              </IconButton>
            </p>
            <h4>{plant.body}</h4>
          </a>
        </div>
      ))}
    </div>
  );
}

export default PlantTrackingDetails;
