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

const TrackingCard2 = (props: Props) => {
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
        <div className={hidden ? "hidden" : 'flex shadow min-h-64 bg-[#BBC6B0] //bg-gray-100bg-opacity-40 mb-2 mx-auto w-full'}>
            <div className="pr-2 mx-0 w-1/3 relative h-full transition-all">
                {plant.imageUrl &&
                    <ImageWithZoom
                        src={plant.imageUrl}
                        alt={`Photo of ${plant.species}`}
                        sizes="200px"
                        className='object-cover max-h-[300px]'
                    />
                }
            </div>
            <div className="w-2/3 relative h-fit ">
                <div className='flex text-primary text-opacity-80 justify-between w-full pr-2 pt-3 pb-2 bg-[#BBC6B0]'>
                    <h3 className='text-left text-xl ml-4 mr-2 italic'>
                        {plant.species}
                    </h3>
                    <div className='flex-col justify-end'>
                        {/* {!showEditDelete ? */}
                        {/* <button
                                className='absolute top-2 right-2 text-xl'
                                onClick={() => setShowEditDelete(true)}
                            >
                                <IoEllipsisHorizontalSharp />
                            </button>
                            : */}
                        <div className='flex justify-end'>
                            <button
                                className="border-[1.5px] border-primary border-opacity-60 text-primary text-opacity-70 rounded-xl p-1 text-lg
                                    hover:bg-gray-200 hover:border-gray-200  hover:text-gray-700 transition-colors"
                                onClick={() => props.goToEditScreen(plant?.id)}
                            >
                                <IoPencilOutline />
                            </button>
                            <button
                                className="border-[1.5px]  border-primary border-opacity-60 rounded-xl p-1 text-primary text-opacity-70 text-lg 
                                    hover:bg-red-400 hover:border-red-400 hover:border-opacity-80 hover:text-gray-100 transition-colors ml-6"
                                onClick={() => {
                                    if (!confirm(`Delete ${plant.species}?`)) {
                                        return;
                                    }
                                    deletePlant(plant)
                                    setHidden(true)
                                }}
                            >
                                <IoTrash />
                            </button>
                        </div>
                        {/* } */}
                        {plant.dateObtained &&
                            <p className='text-primary text-right text-sm text-opacity-70 pt-4'>
                                had since {plant.dateObtained.toLocaleDateString()}
                            </p>
                        }
                    </div>
                </div>
                <div className='flex-col justify-between '>
                    <div className={`w-full p-1 py-3  text-primary bg-gray-100 bg-opacity-30 shadow-sm text-opacity-70 pl-3 flex justify-between items-center relative `}>
                        {/* Water dates */}
                        <div className={`text-sm px-1 `}>
                            Last watered {plant.dateLastWatered.toLocaleDateString()}
                            {/* <div className='flex w-full justify-center border border-t-0 border-x-0 border-gray-800 border-opacity-50 my-0.5 -translate-x-2'></div> */}
                            <p className={`text-lg text-primary text-opacity-90 flex pt-1`}>
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
                            className='flex items-center hover:bg-gray-100 hover:bg-opacity-40  hover:border-blue-300 text-blue-600  //hover:text-sky-200
                            cursor-pointer px-3 py-2 rounded-full h-fit //bg-tertiarybg-opacity-80 transition-colors'
                        >
                            <IoWaterOutline className={`text-2xl `} />
                        </button>
                    </div>
                    <ResizablePanel >
                        {expanded ?
                            <>
                                {(plant?.dateToFeedNext || plant?.dateLastFed) &&
                                    <div className="w-full text-sm pl-3 pr-2 pt-2 pb-2 flex justify-between items-center relative  text-primary text-opacity-70">
                                        {/* Feeding dates */}
                                        <div className={`px-1 ${(!plant.dateLastFed || !plant.dateToFeedNext) && 'pb-8'}`}>
                                            {plant.dateLastFed && `Last fed ${plant.dateLastFed.toLocaleDateString()}`}
                                            {/* <div className='flex w-full justify-center border border-t-0 border-x-0 border-gray-800 my-0.5 -translate-x-4'></div> */}
                                            <p>
                                                {plant.dateToFeedNext && `Feed next ${plant.dateToFeedNext.toLocaleDateString()}`}
                                            </p>
                                        </div>
                                        {/* Feed button: */}
                                        <button
                                            onClick={() => {
                                                if (!confirm('Mark as fed today?')) {
                                                    return;
                                                }
                                                feedPlantInDB(userID, plant?.id)
                                                    .then(() => {
                                                        const updatedPlant = {
                                                            ...plant,
                                                            dateLastFed: new Date()
                                                        }
                                                        setPlant(updatedPlant)
                                                    }).catch(console.error);
                                            }}
                                            className='flex items-center hover:bg-gray-100 hover:bg-opacity-40 text-green-800 
                            cursor-pointer text-sm px-3 py-2 rounded-full h-fit //bg-tertiary //bg-opacity-80 transition-colors'
                                        >
                                            <IoLeafOutline className='cursor-pointer text-xl' />
                                        </button>
                                    </div>
                                }
                                <div className='px-4 '>
                                    <div className=" flex justify-center pr-4 py-1 text-lg">
                                        <div>
                                            <div className='futura text-sm flex items-center text-primary text-opacity-60'>
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
                                    {/* Instructions & Updates buttons */}
                                    <div className='relative'>
                                        {/* <button
                                            className={`absolute top-0 left-2 text-sm hover:bg-gray-900 rounded-full py-1 px-5  text-primary futura
                            ${!needsWater ? "border-white " : " hover:text-gray-200"}
                            ${plant && plant.careInstructions ? "opacity-100 cursor-pointer" : "hidden"}
                            `}
                                            style={{ transition: 'background-color 0.4s ease' }}
                                            onClick={() => setShowInstructions(!showInstructions)}
                                        >
                                            Instructions
                                            &nbsp;
                                            {showInstructions ? <span>&nbsp;&darr;</span> : <span>&rarr;</span>}
                                        </button> */}
                                        <div className="flex justify-end items-center text-sm mt-1">
                                            <button
                                                className="futura mr-2 py-0.5 px-4 mt-3 text-primary bg-gray-100 bg-opacity-30 shadow-sm rounded-full text-lg //font-bold
                                hover:bg-primary hover:bg-opacity-20 hover:text-green-100 transition-colors"
                                                onClick={() => setShowUpdates(!showUpdates)}
                                            >
                                                Updates
                                            </button>
                                            <button
                                                className="bg-green-700 hover:bg-lime-600 bg-opacity-80 text-gray-200 text-opacity-80 text-2xl shadow-sm rounded-full h-fit //py-0.5 px-2 
                                 //hover:bg-opacity-60 //hover:text-green-900  mt-3 transition-colors"
                                                onClick={() => props.goToAddUpdateScreen(plant?.id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {/* Instructions: */}
                                    {/* <div
                                        // layout
                                        // animate={{ height: (!showInstructions || !height ? "0" : height / 15) || "auto" }}
                                        className={`text-primary text-opacity-80 mb-2 py-2 pr-40 ${showInstructions ? 'opacity-100' : 'opacity-0 h-0'} transition-all ease-linear duration-100`}>
                                        {plant?.careInstructions}
                                    </div> */}
                                    {/* Updates: */}
                                    {showUpdates && plant &&
                                        <div className="w-full">
                                            <ResizablePanel>
                                                {isLoadingUpdates ?
                                                    <div className="flex justify-center w-full">
                                                        <ReactLoading type='bars' color="#FFF7ED" />
                                                    </div>
                                                    :
                                                    <TimelineInCard
                                                        plantId={plant.id}
                                                        {...{ updates }}
                                                        species={plant.species}
                                                        uid={userID}
                                                        key={plant.id + "_timeline"}
                                                        width={0.97 * (width || 400) / 2}
                                                        height={0.97 * (width || 400) / 2}
                                                    />
                                                }
                                            </ResizablePanel>
                                        </div>
                                    }
                                    <button
                                        className="w-full  flex justify-center items-center text-primary text-opacity-60 text-xl py-1 mt-2"
                                        onClick={() => setExpanded(false)}
                                    >
                                        <div className='bg-gray-100 bg-opacity-30 px-6 rounded-t-full border-t-[3px] border-secondary border-opacity-70'>
                                            <IoChevronUp fill='currentColor' />
                                        </div>
                                    </button>
                                </div>
                            </>
                            :
                            <button
                                className="w-full  flex justify-center items-center text-primary text-opacity-60 text-xl pb-1"
                                onClick={() => setExpanded(true)}
                            >
                                <div className='bg-gray-100 bg-opacity-30 px-6 rounded-b-full border-t-[3px] border-secondary border-opacity-70'>
                                    <IoChevronDown fill='currentColor' />
                                </div>
                            </button>
                        }
                    </ResizablePanel>
                </div >
            </div >
        </div >
    )
}

export default TrackingCard2