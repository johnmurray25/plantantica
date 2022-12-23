import { createContext } from "react";
import Plant from "../domain/Plant";

interface I {
    plants: Plant[];
    setPlants: (plants: Plant[]) => void;
    deletePlant: (plant: Plant) => void;
}

const PlantContext = createContext<I>(null);

export default PlantContext