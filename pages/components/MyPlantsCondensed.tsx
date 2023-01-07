import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image';
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
        <div className='max-w-[960px] m-auto '>
            <section>
                <div className='w-full flex items-center justify-between text-gray-100 text-opacity-80 font-bold text-sm p-2 pt-8'>
                    <h2 className='inter flex items-center text-left lowercase max-w-1/2 italic text-xl font-normal'>
                        <IoWater className='text-blue-400 mr-1' /> {plantsToWater.length} PLANTS MIGHT NEED WATER:
                    </h2>
                    <h2 className={`text-right ${width >= 420 ? "" : " "}`}>
                        <Link href="/Tracking" className={`text-right text-opacity-70 font-bold hover:text-primary transition-colors`}>
                            All my plants &rarr;
                        </Link>
                    </h2>
                </div>
                <div id="plants_horizontal"
                    className='flex overflow-auto //sm:w-[600px] z-40 m-auto '
                >
                    {plantsToWater.map(p => {
                        return (
                            // <TrackingCardSmall
                            //     key={p.id}
                            //     plant={p}
                            //     userID={user.uid}
                            //     needsWater
                            //     waterPlant={handleWaterPlant}
                            //     goToEditScreen={(plantId) => router.push(`/EditPlantTrackingDetails/${plantId}`)}
                            //     goToAddUpdateScreen={(plantId) => router.push(`/AddUpdateForPlant/${plantId}`)}
                            // />
                            <div key={p.id} className='w-[120px] h-fit relative flex-col m-2'>
                                <Image
                                    src={p.imageUrl}
                                    alt={p.species}
                                    width={120}
                                    height={120}
                                    className="object-cover h-[120px] w-full rounded-full border-2 border-[#A1C720]"
                                />
                                <div className='mt-2 w-[120px] whitespace-normal text-sm italic text-gray-100 text-opacity-80 '>
                                    {p.species}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default MyPlantsCondensed