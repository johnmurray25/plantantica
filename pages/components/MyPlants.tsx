import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import PlantContext from '../../context/PlantContext';
import Plant from '../../domain/Plant';
import useAuth from '../../hooks/useAuth';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import TrackingCard2 from './TrackingCard2';

interface Props {
    plants: Plant[];
    waterPlant: (plant: Plant, userID: string) => Promise<Plant>;
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

const MyPlants = (props: Props) => {
    const { plants } = useContext(PlantContext)
    // const [filteredPlants, setFilteredPlants] = useState(plants)
    const { user } = useAuth()
    const { width } = useWindowDimensions()
    const router = useRouter()

    console.log("My plants:")
    console.log(plants)

    const [plantsToWater, setPlantsToWater] =
        useState(plants?.filter(p => new Date().getTime() >= p.dateToWaterNext?.getTime() || today.toLocaleDateString() == p.dateToWaterNext?.toLocaleDateString()))

    const [otherPlants, setOtherPlants] =
        useState(plants?.filter(p => today.toLocaleDateString() !== p.dateToWaterNext?.toLocaleDateString() && p.dateToWaterNext?.getTime() > todayMs))

    const handleWaterPlant = async (plant) => {
        const updatedPlant = await props.waterPlant(plant, user?.uid)
        setPlantsToWater(plantsToWater?.filter(p => p.id !== plant.id))
        const updatedOtherPlants = [...otherPlants]
        updatedOtherPlants.push(updatedPlant)
        setOtherPlants(updatedOtherPlants.sort(byDateToWaterNext))
    }

    return plants && (
        <div className='w-full items-center border-t bg-secondary bg-opacity-60 border-gray-400 border-opacity-50 pt-4'>
            <div className='max-w-[1200px] m-auto'>
                {plantsToWater?.length > 0 ?
                    <>
                        <h2 className='text-left font-bold text-sm text-primary text-opacity-70 pl-12'>
                            THESE PLANTS MIGHT NEED WATER:
                        </h2>
                        <motion.div className={`${width >= 420 ? "grid grid-cols-2 gap-y-1 gap-x-4" : "grid grid-cols-1"}  max-w-[960px] m-auto pt-6 sm:px-2`}>
                            <AnimatePresence>
                                {plantsToWater.map(p => {
                                    return (
                                        <TrackingCard2
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
                    </>
                    :
                    <h2 className='text-center font-bold text-sm text-primary text-opacity-70 pl-12'>
                        None of your plants need water today, according to the provided dates.
                    </h2>
                }
                {otherPlants?.length > 0 &&
                    <>
                        <h2 className='text-left font-bold text-sm text-primary text-opacity-70 pl-12 pt-6'>
                            WATER ANOTHER DAY:
                        </h2>
                        <motion.div className={`${width >= 420 ? "grid grid-cols-2 gap-y-1 gap-x-4" : "grid grid-cols-1"}  max-w-[960px] m-auto pt-6 sm:px-2`}>
                            <AnimatePresence>
                                {otherPlants.map(p => {
                                    return (
                                        <TrackingCard2
                                            key={p.id}
                                            plant={p}
                                            userID={user.uid}
                                            waterPlant={handleWaterPlant}
                                            goToEditScreen={(plantId) => router.push(`/EditPlantTrackingDetails/${plantId}`)}
                                            goToAddUpdateScreen={(plantId) => router.push(`/AddUpdateForPlant/${plantId}`)}
                                        />
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </>
                }
            </div>
        </div>
    )
}

export default MyPlants