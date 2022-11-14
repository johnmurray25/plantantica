"use client"
import Link from 'next/link'
import React, { use, useCallback, useEffect, useState } from 'react'
import Plant from '../../domain/Plant'
import { deletePlant, feedPlantInDB, getPlants, waterPlantInDB } from '../../service/PlantService';
import TextField from '../components/TextField';
import TrackingCard from '../components/TrackingCard';
import gridStyles from '../../styles/grid.module.css';

interface Props {
    uid: string;
}

const TrackingPage: React.FC<Props> = (props) => {
    console.log(`rendering TrackingPage ${props.uid}`)

    const uid = props?.uid;
    const plants = use(getPlants(uid));

    const [searchText, setSearchText] = useState('')
    const [trackingCards, setTrackingCards] = useState<JSX.Element[]>([])

    const waterPlant = useCallback(async (plant: Plant) => {
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
    }, [uid]);

    const feedPlant = useCallback(async (plant: Plant) => {
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
        // TODO test this
        plant.dateLastFed = today;
    }, [uid]);

    const remove = useCallback(async (plant: Plant) => {
        if (!confirm(`Delete ${plant.species}?`)) return;
        try {
            await deletePlant(plant, uid);
            let filtered = plants.filter(p => p.id !== plant.id)
            // setPlants({ ...filtered });
        } catch (e) {
            console.error(e);
        }
    }, [plants, uid]);

    const plantToCard = useCallback((p: Plant): JSX.Element => {
        return (
            <TrackingCard
                key={p.id}
                plant={p}
                waterPlant={() => waterPlant(p)}
                feedPlant={() => feedPlant(p)}
                removePlant={remove}
                userID={uid}
                updates={p.updates}
            />
        )
    }, [feedPlant, remove, uid, waterPlant])

    const filterPlants = useCallback(() => {
        console.log('filterPlants')
        let filteredResults =
            (searchText ?
                plants.filter(plant => {
                    return plant.species.toLowerCase().includes(searchText.toLowerCase())
                })
                :
                { ...plants }
            ).sort((a, b) => {
                if (a.dateToWaterNext > b.dateToWaterNext) return 1
                else if (a.dateToWaterNext < b.dateToWaterNext) return -1
                return a.species < b.species ? -1 : 1
            })

        // map results to TrackingCard[]
        let filteredCards =
            filteredResults
                .map(plantToCard)
        setTrackingCards(filteredCards)
        filteredResults.map(p => p.species).forEach(console.log)
        // if (searchText) setFilterActive(true)
    }, [plantToCard, plants, searchText])
    // end filterPlants

    useEffect(() => {
        // effect
        // document.addEventListener('keydown', handleKeyPress)

        // on first render
        if (!trackingCards.length && plants && plants.length) {
            console.log('setting tracking cards')
            setTrackingCards(
                plants.sort((a, b) => {
                    if (a.dateToWaterNext > b.dateToWaterNext) return 1
                    else if (a.dateToWaterNext < b.dateToWaterNext) return -1
                    return a.species < b.species ? -1 : 1
                })
                    .map(plantToCard))
        }
    }, [plantToCard, plants, trackingCards])
    // end useEffect

    useEffect(() => {
        console.log('filterPlants useEffect')
        if (searchText) {
            filterPlants()
        } else {
            // if (props.plants && plants &&
            //     props.plants.length > plants.length) {
            //     setPlants(props.plants)
            // }
        }
    }, [filterPlants, plants, searchText])

    return (
        <div className="relative">
            <div
                className="absolute top-0 right-2 pb-3 pt-3 px-4 bg-[#145914] w-fit hover:text-green hover:bg-yellow"
                style={{
                    borderRadius: '0 222px'
                }}
            >
                <Link href="/AddPlantTrackingDetails" passHref>
                    <p className='cursor-pointer p-2 m-2'>
                        Add a plant +
                    </p>
                </Link>
            </div>
            <div className="flex justify-between items-center pr-2 pl-2 pb-1 pt-16">
                <p>
                    You are tracking {plants?.length} plants
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
                </div>
            </div>
            <div className={gridStyles.container}>
                {trackingCards}
            </div>
        </div>
    )
}

export default TrackingPage