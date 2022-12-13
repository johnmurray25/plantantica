import Link from 'next/link'
import { useCallback, useContext, useEffect, useState } from 'react'
import Plant from '../../domain/Plant'
import TextField from './TextField';
import TrackingCard from './TrackingCard';
import MiniTrackingCard from './MiniTrackingCard';
import gridStyles from '../../styles/grid.module.css';
import { IoList } from '@react-icons/all-files/io5/IoList';
import { IoGrid } from '@react-icons/all-files/io5/IoGrid';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import db from '../../firebase/db';
import { useRouter } from 'next/router';
import { waterPlantInDB } from '../../service/PlantService';
import { AnimatePresence, motion } from "framer-motion";
import PlantContext from '../../context/PlantContext';

const saveViewPreference = async (uid: string, cols: number) => {
    setDoc(doc(db, `users/${uid}`),
        { viewPreference: cols },
        { merge: true })
        .then(() => console.log("Saved view preference " + cols))
}

const getViewPreference = async (uid: string) => {
    console.log("Reading viewPreference from DB")
    return (await getDoc(doc(db, `users/${uid}`)))?.data()?.viewPreference;
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

interface Props {
    uid: string;
}

const TrackingPageBody = (props: Props) => {

    const router = useRouter()
    const { width } = useWindowDimensions()

    const uid = props.uid || "";
    const { plants, setPlants } = useContext(PlantContext)

    const [searchText, setSearchText] = useState('')
    const [trackingCards, setTrackingCards] = useState<JSX.Element[]>([])

    const [columns, setColumns] = useState<number>(null);

    const handleWaterPlant = useCallback(async (plant: Plant, userID: string): Promise<Plant> => {
        const updatedPlant = await waterPlant(plant, userID)

        const plantId = plant.id
        const updatedPlants = plants.filter((p) => p.id !== plantId)
        updatedPlants.push(updatedPlant)
        setPlants(updatedPlants)

        return updatedPlant
    }, [plants, setPlants])

    const plantToCard = useCallback((p: Plant, index: number): JSX.Element => {
        // console.log("i = " + index)
        if (columns === 1 || width > 650 || !columns) {
            return (
                <TrackingCard
                    key={p?.id}
                    plant={p}
                    userID={uid}
                    updates={p?.updates}
                    goToEditScreen={(plantId) => router.push(`/EditPlantTrackingDetails/${plantId}`)}
                    goToAddUpdateScreen={(plantId) => router.push(`/AddUpdateForPlant/${plantId}`)}
                    waterPlant={handleWaterPlant}
                />
            )
        } else {
            return (
                <MiniTrackingCard
                    key={p.id}
                    plant={p}
                    userID={uid}
                    waterPlant={handleWaterPlant}
                />
            )
        }
    }, [columns, handleWaterPlant, router, uid, width])

    const filterPlants = useCallback(() => {
        if (searchText) {
            setTrackingCards(plants
                .filter(p => p.species.toLowerCase().includes(searchText.toLowerCase()))
                .sort(byDateToWaterNext)
                .map((p, i) => plantToCard(p, i)))
        } else {
            setTrackingCards(plants
                .sort(byDateToWaterNext)
                .map((p, i) => plantToCard(p, i)))
        }
    }, [plantToCard, plants, searchText])

    useEffect(() => {
        if (!columns) {
            getViewPreference(uid).then(setColumns)
        }
        filterPlants()
    }, [columns, filterPlants, uid])

    return (
        <>
            <div className={`flex px-2 items-center w-full
                    ${width <= 650 ? 'justify-between' : 'justify-end'}`}
            >
                {width <= 650 &&
                    <div className="flex">
                        <button className={`border p-3 m-2 hover:bg-gray-600 hover:text-gray-100 border-gray-600 cursor-pointer
                                ${columns === 1 && 'bg-gray-700 border-gray-700 text-gray-100'}`}
                            onClick={() => {
                                setColumns(1)
                                saveViewPreference(uid, 1)
                            }}
                            style={{ transition: 'background-color 0.2s ease' }}
                        >
                            <IoList />
                        </button>
                        <button className={`border p-3 m-2 hover:bg-gray-600 hover:text-gray-100 border-gray-600 cursor-pointer
                                ${columns > 1 && 'bg-gray-700 border-gray-700 text-gray-100'}`}
                            onClick={() => {
                                setColumns(2)
                                saveViewPreference(uid, 2)
                            }}
                            style={{ transition: 'background-color 0.2s ease' }}
                        >
                            <IoGrid />
                        </button>
                    </div>
                }
                <button
                    className="py-3 px-6 brand bg-gray-700  hover:text-brandGreen hover:bg-lime-300 p-2 shadow-sm shadow-gray-800"
                    style={{ borderRadius: '0 222px', transition: 'background-color 0.7s ease' }}
                    onClick={() => router.push("/AddPlantTrackingDetails")}
                >
                        Add a plant <span className='text-2xl text-green-400 '>+</span>
                </button>
            </div>
            <div className="text-sm flex justify-between items-center pr-2 pl-2 pb-1 pt-6 text-gray-200 w-full">
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
            {width <= 650 ?
                <motion.div className={`grid grid-cols-${columns || 1} gap-1`} style={{ width: '100vw' }}>
                    <AnimatePresence>
                        {trackingCards}
                    </AnimatePresence>
                </motion.div>
                :
                <motion.div layout className={gridStyles.container}>
                    <AnimatePresence>
                        {trackingCards}
                    </AnimatePresence>
                </motion.div>
            }
        </>
    )
}

export default TrackingPageBody