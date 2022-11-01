import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
import ReactLoading from 'react-loading';

import auth from '../firebase/auth';
import NavBar from "./components/NavBar";
import Plant from "../domain/Plant";
import { getPlants, deletePlant, waterPlantInDB, feedPlantInDB } from "../service/PlantService";
import { User } from "firebase/auth";
import NextHead from "./components/NextHead";
import TextField from "./components/TextField";
import TrackingCard from "./components/TrackingCard";
import gridStyles from '../styles/grid.module.css';

const loadPlantData = async (user: User): Promise<Plant[]> => {
  if (!user) {
    return null;
  }
  // get plants from DB 
  try {
    let results = await getPlants(user.uid);
    return results;
  } catch (e) {
    console.error(e)
    return []
  }
}

const OK = 200;
const UNAUTHORIZED = 403;
const ERR_STATUS = 500;

const Home = () => {
  const [plants, setPlants] = useState<Plant[]>(null);
  // const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [status, setStatus]: [number, any] = useState(OK);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const [searchText, setSearchText] = useState('')
  const [filterActive, setFilterActive] = useState(false)

  const [trackingCards, setTrackingCards] = useState<JSX.Element[]>([])

  const remove = useCallback(async (plant: Plant) => {
    if (!confirm(`Delete ${plant.species}?`)) return;

    try {
      await deletePlant(plant, user);
      let filtered = plants.filter(p => p.species !== plant.species)
      setPlants(filtered);
      setRefreshToggle(!refreshToggle);
    } catch (e) {
      console.error(e);
      setStatus(ERR_STATUS);
    }
  }, [user, refreshToggle, plants]);

  const waterPlant = useCallback(async (plant: Plant, uid: string) => {
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 10;
    // Calculate next watering date
    let newWateringDate = today.getTime() + (daysBetweenWatering * 86400000);
    // Update DB
    try {
      await waterPlantInDB(uid, plant.id, newWateringDate);
    } catch (e) {
      console.error(e)
      alert("An error occured...")
      return;
    }
    // Update state
    let newDate = new Date(newWateringDate);
    plant.dateToWaterNext = newDate;
    plant.dateLastWatered = today;
    //   plants.filter((p) => p.id !== plant.id)
    //   : [];
    // filtered.push(plant);
    // let results = filtered
    //   .sort((a, b) => {
    //     if (a.species.toLocaleLowerCase() < b.species.toLocaleLowerCase()) {
    //       return -1;
    //     }
    //     else if (a.species.toLocaleLowerCase() > b.species.toLocaleLowerCase()) {
    //       return 1;
    //     }
    //     else return 0;
    //   });
  }, []);

  const feedPlant = useCallback(async (plant: Plant, uid: string) => {
    let today = new Date();
    // Update DB
    try {
      await feedPlantInDB(uid, plant.id);
    } catch (e) {
      console.error(e)
      alert("An error occured...")
      return;
    }
    // Update state
    plant.dateLastFed = today;
    // let filtered = plants ?
    //   plants.filter((p) => p.id !== plant.id)
    //   : [];
    // filtered.push(plant);
    // let results = filtered
    //   .sort((a, b) => {
    //     if (a.species.toLocaleLowerCase() < b.species.toLocaleLowerCase()) {
    //       return -1;
    //     }
    //     else if (a.species.toLocaleLowerCase() > b.species.toLocaleLowerCase()) {
    //       return 1;
    //     }
    //     else return 0;
    //   });
    // if (results && results.length > 0) setPlants(results);
  }, []);

  const filterPlants = useCallback(() => {
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
          <TrackingCard
            key={plant.id}
            plant={plant}
            waterPlant={() => waterPlant(plant, user.uid)}
            feedPlant={() => feedPlant(plant, user.uid)}
            removePlant={remove}
            userID={user.uid}
            updates={plant.updates}
          />
        ))
    setTrackingCards(filteredCards)
    filteredResults.map(p => p.species).forEach(console.log)
    if (searchText) setFilterActive(true)
  }, [feedPlant, plants, remove, searchText, user, waterPlant])


  useEffect(() => {
    console.log('Tracking: in useEffect')
    if (!user && !loading) {
      setStatus(UNAUTHORIZED);
      return
    }
    // bind enter key to searchbar
    const handleKeyPress = (e) => {
      const key = e.key;
      if (key === 'Enter') {
        filterPlants()
      }
    };
    document.addEventListener('keydown', handleKeyPress)
    //
    if (plants === null && user) {
      setIsLoading(true);
      console.log("Loading plants...")
      loadPlantData(user)
        .then(data => {
          console.log('loaded plants:')
          console.log(data)
          setPlants(data)
          // setFilteredPlants(data)
          if (!data) {
            console.log("no data")
            return;
          }
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
                  key={plant.id}
                  plant={plant}
                  waterPlant={() => waterPlant(plant, user.uid)}
                  feedPlant={() => feedPlant(plant, user.uid)}
                  removePlant={remove}
                  userID={user.uid}
                  updates={plant.updates}
                />
                // </div >
              ))
          )
        })
        .catch(e => {
          console.error(e);
          setStatus(ERR_STATUS)
          setIsLoading(false)
        })
        .finally(() => {
          console.log("finished loading plants")
          setIsLoading(false)
        })
    }
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [user, loading, plants, remove, waterPlant, filterActive, feedPlant, filterPlants]);
  // end useEffect

  const cancelFilter = () => {
    setSearchText('')
    filterPlants()
    setFilterActive(false)
  }

  return (
    <div className='text-yellow min-w-screen bg-green' /**Container */>
      <NextHead /**Header */ />
      <NavBar />

      <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto mt-0'>

        {/* <div className='m-0 italic p-0 text-3xl' style={{ lineHeight: 1.15, }}>
          <a>TRACKING</a>
        </div> */}

        {isLoading && <ReactLoading type='bars' color="#fff" />}

        {plants && plants.length > 0 ?
          // If user has plants, show plants
          <div className="relative">
            <div
              className="absolute top-0 right-2 pb-3 pt-3 px-4 bg-[#145914] w-fit hover:text-green hover:bg-yellow"
              style={{
                borderRadius: '0 222px'
              }}
            >
              <Link href="/AddPlantTrackingDetails" passHref>
                <a className='cursor-pointer p-2 m-2'>
                  Add a plant +
                </a>
              </Link>
            </div>
            <div className="flex justify-between items-center pr-2 pl-2 pb-1 pt-16">
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
                  width={24}
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
                    className='cursor-pointer bg-[#145914] text-yellow rounded justify-center h-12 w-8 text-center content-center'
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
                  Add a plant +
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
