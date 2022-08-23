import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';
import { v4 as uuidv4 } from 'uuid';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import Plant from "../../domain/Plant";
import { getPlants, deletePlant } from "../../service/PlantService";
import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import db from "../firebase/db";
import NextHead from "./components/NextHead";
import TextField from "./components/TextField";
import TrackingCard from "./components/TrackingCard";
import gridStyles from '../styles/grid.module.css';

const loadPlantData = async (user: User): Promise<Plant[]> => {
  // get plants from DB 
  let results = await getPlants(user);
  return results;
}

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const Home = () => {
  const [plants, setPlants] = useState<Plant[]>(null);
  // const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [status, setStatus]: [number, any] = useState(OK);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const [searchText, setSearchText] = useState('')
  const [filterActive, setFilterActive] = useState(false)

  const [trackingCards, setTrackingCards] = useState([])

  const remove = useCallback(async (plant: Plant) => {
    if (!confirm(`Delete ${plant.species}?`)) return;

    try {
      await deletePlant(plant, user);
      let filtered = plants.filter(p => p.species !== plant.species)
      setPlants(filtered);
      // setFilteredPlants(filteredPlants)
      // setPlants([]);
      // if (totalPlants) setTotalPlants(totalPlants - 1);
      setRefreshToggle(!refreshToggle);
    } catch (e) {
      console.error(e);
      setStatus(ERR_STATUS);
    }
  }, [user, refreshToggle, plants]);

  const waterPlant = useCallback(async (plant: Plant, user: User) => {
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 10;
    // Calculate next watering date
    let newWateringDate = today.getTime() + (daysBetweenWatering * 86400000);
    // Update DB
    await setDoc(
      doc(
        collection(doc(db, 'users', user.email), 'plantTrackingDetails'),
        plant.id),
      { dateToWaterNext: newWateringDate, dateLastWatered: today.getTime() },
      { merge: true }
    );
    // Update state
    let newDate = new Date(newWateringDate);
    plant.dateToWaterNext = newDate;
    plant.dateLastWatered = today;
    console.log(`plants:  ${plants}`)
    let filtered = plants ?
      plants.filter((p) => p.id !== plant.id)
      : [];
    filtered.push(plant);
    let results = filtered
      .sort((a, b) => {
        if (a.species.toLocaleLowerCase() < b.species.toLocaleLowerCase()) {
          return -1;
        }
        else if (a.species.toLocaleLowerCase() > b.species.toLocaleLowerCase()) {
          return 1;
        }
        else return 0;
      });
    if (results && results.length > 0) setPlants(results);
  }, [plants]);

  useEffect(() => {
    if (!user && !loading) {
      setStatus(UNAUTHORIZED);
      return
    }
    if (plants === null) {
      setIsLoading(true);
      loadPlantData(user)
        .then(data => {
          setPlants(data)
          // setFilteredPlants(data)
          if (data) {
            // setTotalPlants(data.length)
            setTrackingCards(
              data
                .sort((a, b) => {
                  if (a.dateToWaterNext > b.dateToWaterNext) return 1
                  else if (a.dateToWaterNext < b.dateToWaterNext) return -1
                  return a.species < b.species ? -1 : 1
                })
                .map((plant) => (
                  // <div key={i} >
                  <TrackingCard
                    key={uuidv4()}
                    plant={plant}
                    waterPlant={() => waterPlant(plant, user)}
                    removePlant={remove}
                    userEmail={user.email}
                  />
                  // </div >
                )))
          }
        }, e => {
          console.error(e);
          setStatus(ERR_STATUS)
          setIsLoading(false)
        })
        .finally(() => setIsLoading(false))
    }
  }, [user, loading, plants, remove, waterPlant, filterActive]);
  // end useEffect

  const filterPlants = () => {
    // filter plants
    let filteredResults =
      (searchText ?
        plants
          .filter(plant => {
            return plant.species.toLowerCase().includes(searchText.toLowerCase())
          })
        :
        plants
      )
        .sort((a, b) => {
          if (a.dateToWaterNext > b.dateToWaterNext) return 1
          else if (a.dateToWaterNext < b.dateToWaterNext) return -1
          return a.species < b.species ? -1 : 1
        })
    // setFilteredPlants(filteredResults)

    // map results to TrackingCard[]
    // setTrackingCards([])
    let filteredCards =
      filteredResults
        .map((plant) => (
          // <div key={i} >
          <TrackingCard
            key={uuidv4()}
            plant={plant}
            waterPlant={() => waterPlant(plant, user)}
            removePlant={remove}
            userEmail={user.email}
          />
          // </div>
        ))
    setTrackingCards(filteredCards)
    filteredResults.map(p => p.species).forEach(console.log)
    if (searchText) setFilterActive(true)
  }

  const cancelFilter = () => {
    setSearchText('')
    filterPlants()
    setFilterActive(false)
  }

  return (
    <div className='text-yellow bg-green min-w-full' /**Container */>
      <NextHead /**Header */ />
      <NavBar />

      <div className='min-h-screen p-4 flex flex-col items-center m-auto'>

        <div className='m-0 italic' style={{ lineHeight: 1.15, fontSize: '3.5rem', }}>
          <a>Tracking</a>
        </div>

        {isLoading && <ReactLoading type='bars' color="#fff" />}

        {plants && plants.length > 0 ?
          // If user has plants, show plants
          <div>
            <div className="flex justify-end pb-3 pt-6 px-4">
              <Link href="/AddPlantTrackingDetails" passHref>
                <a className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
                  Add a plant!
                </a>
              </Link>
            </div>
            <div className="flex justify-between items-center pr-2">
              <p>
                You are tracking {plants.length} plants
              </p>
              <div className='flex justify-end'>
                <TextField
                  name="search"
                  type="text"
                  value={searchText}
                  onChange={setSearchText}
                  placeholder="Search..."
                />
                {filterActive ?
                  <a
                    className='cursor-pointer bg-red-900 text-yellow rounded justify-center h-12 w-8 text-center content-center'
                    onClick={cancelFilter}
                  >
                    X
                  </a>
                  :
                  <a
                    className='cursor-pointer bg-[#53984D] text-yellow rounded justify-center h-12 w-8 text-center content-center'
                    onClick={filterPlants}
                  >
                    &rarr;
                  </a>
                }
              </div>
            </div>
            {/* <PlantTrackingDetails plants={plants} removePlant={remove} waterPlant={waterPlant} /> */}
            <div className={gridStyles.container}>
              {trackingCards}
            </div>
          </div>
          :
          // If user doesn't have plants, show message
          (!isLoading && user && status === OK ?
            <div className='flex justify-evenly items-center m-10'>
              <p>
                You aren&apos;t tracking any plants yet...
              </p>
              <Link href="/AddPlantTrackingDetails" passHref>
                <a className='hover:text-green hover:bg-yellow cursor-pointer border rounded-sm border-yellow p-2 m-2'>
                  Add a plant!
                </a>
              </Link>
            </div>
            :
            <div></div>
          )
        }
        {status == ERR_STATUS && (
          <div>Error retrieving plant tracking details. Please try again later</div>
        )}
        {status == UNAUTHORIZED && (
          <div>No user is logged in.</div>
        )}
      </div>
    </div >
  );
};

export default Home;
