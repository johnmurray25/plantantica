import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Nav from "./components/Nav";
import PlantTrackingDetails from "./components/PlantTrackingDetails";

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPlants();
  }, []);

  const getPlants = () => {
    setIsLoading(true);
    const response = fetch("http://localhost:8080/plant-tracking-details/all")
      .then((response) => {
        if (response.ok) return response.json();
        else {
            setPlants(500);
            throw new Error("Failed to fetch plant tracking details");
        }
      })
      .then((data) => {
        if (data.plantTrackingDetailsList)
          setPlants(data.plantTrackingDetailsList);
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.main}>
        <div className={styles.title}>
          <a>Tracking</a>
        </div>
        <div className={styles.grid}>
          {isLoading && <h1>loading...</h1>}
          {plants.length > 0 && (
            <div>
              <p style={{ textAlign: "left" }}>{plants.length} plants found</p>
              <PlantTrackingDetails {...{ plants }} />
            </div>
          )}
          {plants == 500 && (
              <div>Error retrieving plant tracking details. Please try again later</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
