import { IoWater } from '@react-icons/all-files/io5/IoWater';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import PlantContext from '../../../context/PlantContext';
import Plant from '../../../domain/Plant';
import useAuth from '../../../hooks/useAuth';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { waterPlantInDB } from '../../../service/PlantService';

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
        <div className='max-w-[960px] m-auto text-[16px] mt-2 '>
            <section>
                <div className='w-full  items-center justify-between text-gray-100 text-opacity-75 p-2 '>
                    <h2 className={`text-right ${width >= 420 ? "" : " "}`}>
                        <Link passHref href="/Tracking" className={`text-black dark:text-gray-100 text-opacity-60 leading-relaxed tracking-widest text-right hover:text-primary dark:hover:text-highlight active:text-primary dark:active:text-highlight transition-colors`}>
                            All my plants <span className=' dark:text-highlight'>&rarr;</span>
                        </Link>
                    </h2>
                    <h2 className='flex mt-8 justify-center text-center  text-black dark:text-gray-100 text-opacity-60 font-semibold leading-relaxed tracking-wider '>
                        <IoWater className='text-blue-900 dark:text-blue-400 mr-1 translate-y-1' /> {plantsToWater.length} plants might need water <IoWater className='text-blue-900 dark:text-blue-400 mr-1 translate-y-1' />
                    </h2>
                </div>
                <div id="plants_horizontal"
                    className='flex flex-wrap justify-center  //sm:w-[600px] z-40 m-auto  '
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
                            <div key={p.id} className='w-[120px] h-fit relative flex-col m-2 mb-4'>
                                <Image
                                    src={p.imageUrl}
                                    alt={p.species}
                                    width={120}
                                    height={120}
                                    className="object-cover h-[120px] w-full rounded-full border-2 border-primary border-opacity-40 dark:border-highlight "
                                />
                                <div className='mt-2 text-center whitespace-normal text-sm italic text-black text-opacity-80 dark:text-gray-100 tracking-normal'>
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