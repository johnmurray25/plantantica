import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import PlantContext from '../../context/PlantContext';
import Plant from '../../domain/Plant';
import useAuth from '../../hooks/useAuth';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { waterPlantInDB } from '../../service/PlantService';
import TrackingCardSmall from './TrackingCardSmall';

interface Props {
    plants: Plant[];
    waterPlant: (plant: Plant, userID: string) => Promise<Plant>;
}

const waterPlant = async (plant: Plant, uid: string): Promise<Plant> => {
    // Calculate next watering date
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 7;
    let nextWaterDateMs = today.getTime() + (daysBetweenWatering * 86400000);

    // Save to DB
    await waterPlantInDB(uid, plant.id, nextWaterDateMs);

    // Return updated plant 
    return {
        ...plant,
        dateLastWatered: today,
        dateToWaterNext: new Date(nextWaterDateMs)
    }
}

const byDateToWaterNext = (a: Plant, b: Plant) => {
    if (a.dateToWaterNext > b.dateToWaterNext) {
        return 1
    }
    else if (a.dateToWaterNext < b.dateToWaterNext) {
        return -1
    }
    return a.species < b.species ? -1 : 1
}

const today = new Date();
const todayMs = today.getTime()

const MyPlantsCondensed = () => {
    const { plants, setPlants } = useContext(PlantContext)
    // const [filteredPlants, setFilteredPlants] = useState(plants)
    const { user } = useAuth()
    const { width } = useWindowDimensions()
    const router = useRouter()

    console.log("My plants:")
    console.log(plants)

    const [plantsToWater, setPlantsToWater] = useState([])

    const [alreadyChecked, setAlreadyChecked] = useState(false)

    const handleWaterPlant = async (plant) => {
        const updatedPlant = await waterPlant(plant, user?.uid)
        setPlantsToWater(plantsToWater?.filter(p => p.id !== plant.id))
        const updatedPlants = plants.filter(p => p.id !== plant.id)
        updatedPlants.push(updatedPlant)
        setPlants(updatedPlants)
    }

    useEffect(() => {
        if (!plants || plantsToWater?.length || alreadyChecked) {
            return;
        }
        setPlantsToWater(plants?.filter(p => new Date().getTime() >= p.dateToWaterNext?.getTime() || today.toLocaleDateString() == p.dateToWaterNext?.toLocaleDateString()))
        setAlreadyChecked(true)
    }, [alreadyChecked, plants, plantsToWater.length])

    return plantsToWater?.length && (
        <div className='max-w-[960px] flex justify-center m-auto items-center  '>
            <div className='m-auto'>
                <div className='w-full flex items-center justify-between text-gray-100 text-opacity-80 font-bold text-sm px-2'>
                    <h2 className='inter text-left lowercase max-w-1/2 italic text-xl font-normal'>
                        {plantsToWater.length} PLANTS MIGHT NEED WATER:
                    </h2>
                    <h2 className={`text-right ${width >= 420 ? "" : " "}`}>
                        <Link href="/Tracking" className={`text-right text-primary text-opacity-70 font-bold hover:text-primary transition-colors`}>
                            All my plants &rarr;
                        </Link>
                    </h2>
                </div>
                <motion.div className={`${width >= 420 ? "grid grid-cols-3 gap-y-4 gap-x-4" : "grid grid-cols-1"}  m-auto pt-2 `}>
                    <AnimatePresence>
                        {plantsToWater.map(p => {
                            return (
                                <TrackingCardSmall
                                    key={p.id}
                                    plant={p}
                                    userID={user.uid}
                                    needsWater
                                    waterPlant={handleWaterPlant}
                                    goToEditScreen={(plantId) => router.push(`/EditPlantTrackingDetails/${plantId}`)}
                                    goToAddUpdateScreen={(plantId) => router.push(`/AddUpdateForPlant/${plantId}`)}
                                />
                            )
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}

export default MyPlantsCondensed