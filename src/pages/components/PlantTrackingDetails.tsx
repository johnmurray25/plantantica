import React, { FC, useState } from "react";
import gridStyles from '../../styles/grid.module.css';
import auth from '../../firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import Plant from "../../../domain/Plant";
import PlantCard from "./PlantCard";
import { User } from "firebase/auth";

interface PTDProps {
  plants: Array<Plant>;
  removePlant: (plant: Plant) => Promise<void>;
  waterPlant: (plant: Plant, user: User) => Promise<void>;
}

const PlantTrackingDetails: FC<PTDProps> = (props) => {

  const [user] = useAuthState(auth);
  const [plants] = useState(props.plants);

  return user ? (
    <div className={gridStyles.container}>
      {plants &&
        [].concat(plants)
        .sort((a:Plant,b:Plant) => a.dateToWaterNext <= b.dateToWaterNext ? -1 : 1)
        .map((plant, i) => (
          <PlantCard key={i} plant={plant} waterPlant={() => props.waterPlant(plant, user)} removePlant={props.removePlant} userEmail={user.email} />
        ))}
    </div>
  )
  : <div></div>
}

export default PlantTrackingDetails;
