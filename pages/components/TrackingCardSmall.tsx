import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown';
import { IoChevronUp } from '@react-icons/all-files/io5/IoChevronUp';
import { IoLeafOutline } from '@react-icons/all-files/io5/IoLeafOutline';
import { IoWaterOutline } from '@react-icons/all-files/io5/IoWaterOutline';
import { IoEllipsisHorizontalSharp } from '@react-icons/all-files/io5/IoEllipsisHorizontalSharp';
import Image from 'next/image'
import { formatDistance, compareAsc } from 'date-fns'
import ReactLoading from 'react-loading'

import Plant from '../../domain/Plant';
import { feedPlantInDB, getUpdatesForPlant, updateDaysBetweenWatering } from '../../service/PlantService';
import ResizablePanel from './ResizablePanel';
import Update from '../../domain/Update';
import TimelineInCard from './TimelineInCard';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { IoPencilOutline } from '@react-icons/all-files/io5/IoPencilOutline';
import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import PlantContext from '../../context/PlantContext';
import ImageWithZoom from './ImageWithZoom';

interface Props {
    plant: Plant;
    userID: string;
    needsWater?: boolean;
    goToEditScreen: (plantId: string) => void;
    goToAddUpdateScreen: (plantId: string) => void;
    waterPlant: (plant: Plant) => void;
}

const MILLIS_IN_DAY = 86400000

const getWaterNext = (date: Date): string => {
    if (!date) {
        return "N/A"
    }

    const today = new Date()

    const distance = formatDistance(date, today, { addSuffix: true })
    // console.log(distance)

    if (distance.localeCompare("1 day ago") === 0) {
        return "yesterday"
    }

    if (distance.localeCompare("in 1 day") === 0) {
        return "tomorrow";
    }

    if (!distance.includes("hour") && !distance.includes("minute")) {
        return distance
    }

    const diff = today.toLocaleDateString().localeCompare(date.toLocaleDateString());
    if (diff === 0) {
        return "today"
    } else {
        if (compareAsc(today, date) < 0) {
            return "tomorrow"
        } else {
            return "yesterday"
        }
    }
}

const TrackingCardSmall = (props: Props) => {
    const { userID, needsWater } = props
    const [plant, setPlant] = useState(props.plant)
    const { deletePlant } = useContext(PlantContext)
    const [updates, setUpdates] = useState<Update[]>([])
    const [showUpdates, setShowUpdates] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [isLoadingUpdates, setIsLoadingUpdates] = useState(true)
    const [waterNext, setWaterNext] = useState(getWaterNext(plant?.dateToWaterNext))
    const { width, height } = useWindowDimensions()
    // console.log(plant.species)
    // console.log(plant.dateToWaterNext?.toLocaleDateString())
    // console.log(waterNext)
    const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant?.daysBetweenWatering);
    const [expanded, setExpanded] = useState(false)
    const [showEditDelete, setShowEditDelete] = useState(false)
    const [hidden, setHidden] = useState(false)

    const loadUpdates = useCallback(async () => {
        if (!isLoadingUpdates) {
            return;
        }
        console.log("Reading updates")
        await getUpdatesForPlant(userID, plant?.id).then(setUpdates);
    }, [isLoadingUpdates, plant?.id, userID])

    useEffect(() => {
        if (!showUpdates || (updates && updates?.length > 0)) {
            return;
        }
        loadUpdates().finally(() => setIsLoadingUpdates(false))
    }, [loadUpdates, showUpdates, updates])

    return plant && (
        <div className={hidden ? "hidden" : ' bg-[#aaad8c] bg-opacity-80 backdrop-blur text-gray-100 flex shadow mb-2 mx-auto w-full //max-w-[300px] rounded-md'}>
            <div className="w-1/3 relative h-full transition-all py-2 pl-1">
                {plant.imageUrl &&
                    <ImageWithZoom
                        src={plant.imageUrl}
                        alt={`Photo of ${plant.species}`}
                        width={200}
                        height={200}
                        // sizes="200px"
                        // className='object-cover max-h-[150px]'
                    />
                }
            </div>
            <div className="w-2/3 relative h-fit ">
                <div className='flex justify-between w-full h-full pr-2 pt-3 //pb-2 '>
                    <h3 className='text-left text-xl ml-4 mr-2 italic text-gray-100 text-opacity-70'>
                        {plant.species}
                    </h3>
                </div>
                <div className='flex-col justify-between '>
                    <div className={`w-full p-1 py-3 pl-3 flex justify-between items-center relative `}>
                        {/* Water dates */}
                        <div className={`text-left px-1 text-gray-100 text-opacity-90`}>
                            <p className={`text-md flex pt-1`}>
                                Water&nbsp;
                                <div className='text-md '>
                                    {waterNext}
                                </div>
                            </p>
                        </div>
                        {/* Water button: */}
                        <button
                            onClick={() => {
                                if (!confirm('Mark as watered today?')) {
                                    return;
                                }
                                props.waterPlant(plant)
                                // let wnext = 
                                // setWaterNext(getWaterNext(p?.dateToWaterNext))
                            }}
                            className='flex items-center hover:bg-gray-100 hover:bg-opacity-40  hover:border-blue-300 text-blue-800  //hover:text-sky-200
                            cursor-pointer px-3 py-2 rounded-full h-fit //bg-tertiarybg-opacity-80 transition-colors'
                        >
                            <IoWaterOutline className={`text-2xl `} />
                        </button>
                    </div>
                    <div className=" flex justify-center py-1 text-lg">
                        <div>
                            <div className='futura text-xs flex items-center text-gray-100 text-opacity-70 '>
                                <>
                                    Water every&nbsp;
                                </>
                                <div className="bg-gray-100bg-opacity-30 //shadow-sm rounded-full pt-1">
                                    <button
                                        className="bg-green-700 bg-opacity-70 text-white text-opacity-70 hover:bg-lime-700 transition-colors text-2xl font-bold rounded-full h-fit px-1 mx-2 "
                                        style={{ lineHeight: 0.7 }}
                                        onClick={() => {
                                            const n = Number(plant.daysBetweenWatering) - 1
                                            let newDate = new Date(plant.dateToWaterNext?.getTime() - MILLIS_IN_DAY)
                                            updateDaysBetweenWatering(userID, plant.id, n, newDate.getTime())
                                            plant.daysBetweenWatering = n
                                            plant.dateToWaterNext = newDate
                                            setDaysBetweenWatering(n)
                                            setWaterNext(getWaterNext(newDate))
                                        }}
                                    >
                                        <div className='-translate-y-[1px]'>
                                            -
                                        </div>
                                    </button>
                                    <span className=' text-primary text-opacity-80 text-lg'>
                                        {plant.daysBetweenWatering}
                                    </span>
                                    <button
                                        className="bg-green-700 bg-opacity-70 text-white text-opacity-70 hover:bg-lime-700  transition-colors font-bold text-xl rounded-full h-fit px-1 mx-2 "
                                        style={{ lineHeight: 0.9 }}
                                        onClick={() => {
                                            const n = Number(plant.daysBetweenWatering) + 1
                                            let newDate = new Date(plant.dateToWaterNext?.getTime() + MILLIS_IN_DAY)
                                            updateDaysBetweenWatering(userID, plant.id, n, newDate.getTime())
                                            plant.daysBetweenWatering = n
                                            setDaysBetweenWatering(n)
                                            plant.dateToWaterNext = newDate
                                            setWaterNext(getWaterNext(newDate))
                                        }}
                                    >
                                        <div className='-translate-y-[1px]'>
                                            +
                                        </div>
                                    </button>
                                </div>
                                &nbsp;
                                days
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default TrackingCardSmall