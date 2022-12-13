import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';
import dynamic from 'next/dynamic'

import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { IoLeaf } from '@react-icons/all-files/io5/IoLeaf';
import ReactLoading from 'react-loading'

import Plant from '../../domain/Plant';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { IoPencil } from '@react-icons/all-files/io5/IoPencil';
import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import Update from '../../domain/Update';
import { deletePlant, feedPlantInDB, getUpdatesForPlant, updateDaysBetweenWatering } from '../../service/PlantService';
import ResizablePanel from './ResizablePanel';
import { motion } from 'framer-motion';
const TimelineInCard = dynamic(() => import('./TimelineInCard'), { ssr: false })


const MILLIS_IN_DAY = 86400000

const SM_WIDTH = 650
const MD_WIDTH = 1140
const LG_WIDTH = 1530

interface Props {
    plant: Plant;
    userID: string;
    updates: Update[];
    goToEditScreen: (plantId: string) => void;
    goToAddUpdateScreen: (plantId: string) => void;
    waterPlant: (plant: Plant, uid: string) => Promise<Plant>;
}

const PlantCard = (props: Props) => {
    // dimensions
    const { width, height } = useWindowDimensions();

    // props
    const [userID] = useState(props.userID);
    const [plant, setPlant] = useState(props.plant);
    const [dateToWaterNext, setDateToWaterNext] = useState(props.plant?.dateToWaterNext || new Date(new Date().getTime() + MILLIS_IN_DAY));
    const [daysBetweenWatering, setDaysBetweenWatering] = useState(props.plant?.daysBetweenWatering);

    const [updates, setUpdates] = useState<Update[]>([])
    const [isLoadingUpdates, setIsLoadingUpdates] = useState(true)

    // state
    const [needsWater, setNeedsWater] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);
    const [hidden, setHidden] = useState(false);

    const toggleInstructions = () => { setShowInstructions(!showInstructions) }

    useEffect(() => {
        if (!plant) {
            return;
        }
        // Does plant need water?
        let today = new Date();
        if (today.getTime() >= dateToWaterNext.getTime() || today.toLocaleDateString() == dateToWaterNext.toLocaleDateString()) {
            setNeedsWater(true)
        }
    }, [dateToWaterNext, plant]);

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

    const getBgStyle = () => {
        if (!plant || hidden) {
            return 'hidden';
        }
        const sharedStyle = width > SM_WIDTH ? 'rounded-md p-0 m-2 ' : 'rounded p-0 '
        return sharedStyle + "bg-green-900 bg-opacity-20 h-fit pb-3 mb-2"
        // if (needsWater) {
        //     return sharedStyle + ' //bg-dry text-gray-800 ';
        // } else {
        //     return sharedStyle + ' //bg-lime-900 border-[#29bc29] ';
        // }
    }

    const imgWidth: number = (() => {
        // when running 'next build' etc.
        if (!width) return 480;
        // single column
        else if (width <= SM_WIDTH) return width;
        // two columns
        else if (width <= MD_WIDTH) return 0.97 * width / 2;
        // three columns
        else if (width <= LG_WIDTH) return 0.97 * width / 3;
        // four columns (full size)
        return 0.97 * width / 4;
    })();

    const imgHeight: number = (() => {
        if (!width) return 500;
        if (width <= SM_WIDTH) return width;
        return height / 2;
    })();

    const handleShowUpdates = async () => {
        setShowUpdates(!showUpdates)
    }

    return plant && (
        <motion.div exit={{ opacity: 0 }} transition={{ delay: 1 }} className={getBgStyle()} style={{ transition: 'background-color 1s ease', }}>
            {/* Picture */}
            <div className='relative pt-2 bg-green-800 bg-opacity-30'>
                {plant.imageUrl &&
                    <div className="flex px-0 mx-0 py-1 w-full relative h-[400px]">
                        <Image
                            src={plant.imageUrl}
                            alt={`Photo of ${plant.species}`}
                            loading='lazy'
                            fill
                            sizes="(max-width: 650px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className='object-cover object-center '
                        />
                    </div>
                }
            </div>
            <div className="w-full flex justify-between items-center rounded-bl-full bg-green-800 bg-opacity-30 mb-2">
                {/* Species */}
                <h1 className='select-none text-center w-full text-gray- italic text-3xl pl-6 text-opacity-80'>
                    {plant.species}
                </h1>
                {/* Edit/Delete buttons */}
                <div className="flex-col pr-2 py-2 ">
                    {/* <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} /> */}
                    <button
                        className="border-2 border-gray-400 text-gray-200 rounded-xl p-1 text-lg mb-1
                                    hover:bg-gray-200 hover:border-gray-200  hover:text-gray-700 transition-colors"
                        onClick={() => props.goToEditScreen(plant?.id)}
                    >
                        <IoPencil />
                    </button>
                    <button
                        className="border-2 border-red-400 rounded-xl p-1 text-red-400 text-lg mt-1
                                    hover:bg-red-400 hover:text-gray-100 transition-colors"
                        onClick={() => {
                            if (!confirm(`Delete ${plant.species}?`)) {
                                return;
                            }
                            deletePlant(plant, userID)
                                .then(() => setHidden(true))
                                .catch(e => {
                                    console.error(e)
                                    alert('Failed to delete plant. Please try again later')
                                })
                        }}
                    >
                        <IoTrash />
                    </button>
                </div>
            </div>
            <div className='flex justify-end text-md px-4 mb-1 text-gray-300 '>
                {plant.dateObtained &&
                    <p>
                        had since {plant.dateObtained.toLocaleDateString()}
                    </p>
                }
            </div>
            <div className=" flex justify-center pr-4 py-1 text-lg">
                <div>
                    <div className='flex items-center text-lg text-gray-300 '>
                        <>
                            water every&nbsp;
                        </>
                        <div className="bg-green-800 bg-opacity-30 rounded-full">
                            <button
                                className="bg-green-700 bg-opacity-60 hover:bg-lime-600 transition-colors text-gray-900 text-2xl font-bold rounded-full h-fit px-1 mx-2 "
                                style={{ lineHeight: 0.7 }}
                                onClick={() => {
                                    const n = daysBetweenWatering - 1
                                    let newDate = new Date(dateToWaterNext.getTime() - MILLIS_IN_DAY)
                                    updateDaysBetweenWatering(userID, plant.id, n, newDate.getTime())
                                    setDaysBetweenWatering(n)
                                    setDateToWaterNext(newDate)
                                }}
                            >
                                -
                            </button>
                            <span className='font-bold text-gray-100'>
                                {daysBetweenWatering}
                            </span>
                            <button
                                className="bg-green-700 bg-opacity-60 hover:bg-lime-600 transition-colors text-gray-900 font-bold text-xl rounded-full h-fit px-1 mx-2 "
                                style={{ lineHeight: 0.9 }}
                                onClick={() => {
                                    const n = daysBetweenWatering + 1
                                    let newDate = new Date(dateToWaterNext.getTime() + MILLIS_IN_DAY)
                                    updateDaysBetweenWatering(userID, plant.id, n, newDate.getTime())
                                    setDaysBetweenWatering(n)
                                    setDateToWaterNext(newDate)
                                }}
                            >
                                +
                            </button>
                        </div>
                        &nbsp;
                        days
                    </div>
                </div>
            </div>
            <div className='px-4'>
                {/* Instructions & Updates buttons */}
                <div className='relative'>
                    <button
                        className={`absolute top-0 left-2 text-sm hover:bg-gray-900 rounded-full py-1 px-5  
                            ${!needsWater ? "border-white " : " hover:text-gray-200"}
                            ${plant && plant.careInstructions ? "opacity-100 cursor-pointer" : "hidden"}
                            `}
                        style={{ transition: 'background-color 0.4s ease' }}
                        onClick={toggleInstructions}
                    >
                        Instructions
                        &nbsp;
                        {showInstructions ? <span>&nbsp;&darr;</span> : <span>&rarr;</span>}
                    </button>
                    <div className="flex justify-end items-center text-sm mt-4">
                        <button
                            className="mr-2 py-2 px-4 bg-green-800 bg-opacity-30 text-gray-300 rounded-full font-bold
                                hover:bg-lime-700 hover:text-green-100 transition-colors"
                            onClick={handleShowUpdates}
                        >
                            Updates
                        </button>
                        <button
                            className="bg-green-700 bg-opacity-70 text-gray-200 text-2xl rounded-full h-fit py-0.5 px-2 
                                hover:bg-lime-500 hover:text-green-900 transition-colors"
                            onClick={() => props.goToAddUpdateScreen(plant?.id)}
                        >
                            +
                        </button>
                    </div>

                </div>
                {/* Instructions: */}
                <div className={`py-2 pr-40 ${showInstructions ? 'opacity-100' : 'opacity-0 h-0'} transition ease-linear duration-100`}>
                    {plant?.careInstructions}
                </div>
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
                                    width={imgWidth / 3}
                                    height={imgHeight / 3}
                                />
                            }
                        </ResizablePanel>
                    </div>
                }
            </div>
            <div className={`${needsWater ? "bg-dry bg-opacity-60 text-gray-800 " : "bg-green-700 bg-opacity-30"} rounded-tl-3xl rounded-br-full py-2 px-4 flex justify-between items-center relative  text-gray-300`}>
                {/* Water dates */}
                <div className='px-1'>
                    last watered {plant.dateLastWatered.toLocaleDateString()}
                    <div className='flex w-4/5 justify-center border border-t-0 border-x-0 border-gray-800 my-0.5'></div>
                    <p className={needsWater ? ' font-bold text-xl ' : ''}>
                        water next {dateToWaterNext.toLocaleDateString()}
                    </p>
                </div>
                {/* Water button: */}
                <button
                    onClick={() => {
                        if (!confirm('Mark as watered today?')) {
                            return;
                        }
                        props.waterPlant(plant, userID)
                            .then(p => {
                                setNeedsWater(false)
                                setPlant(p)
                                setDateToWaterNext(p?.dateToWaterNext)
                            })
                            .catch(e => { console.error(e); console.error("Failed to mark plant as watered") })
                    }}
                    className='flex items-center hover:bg-blue-700  hover:border-blue-300 text-sky-400 hover:text-sky-200
                            cursor-pointer px-3 py-2 rounded-full h-fit mr-4 bg-[#1B2C29] transition-colors'
                >
                    {/* <p>
                        Water
                    </p> */}
                    &nbsp;
                    <IoWater className={`${needsWater && ' animate-bounce '} text-2xl `} />
                </button>
            </div>
            <div className="bg-green-700 bg-opacity-30 rounded-tl-3xl rounded-br-full py-2 px-4 mt-2 flex justify-between items-center relative  text-gray-300">
                {/* Feeding dates */}
                <div className={`pt-2 pl-2 ${(!plant.dateLastFed || !plant.dateToFeedNext) && 'pb-8'}`}>
                    {plant.dateLastFed && `last fed ${plant.dateLastFed.toLocaleDateString()}`}
                    <div className='flex w-4/5 justify-center border border-t-0 border-x-0 border-gray-800 my-0.5'></div>
                    {plant.dateToFeedNext && `feed next ${plant.dateToFeedNext.toLocaleDateString()}`}
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
                    className='flex items-center hover:bg-green-600 text-green-400 hover:text-green-100
                            cursor-pointer text-sm px-3 py-2 rounded-full h-fit mr-4 bg-[#1B2C29] transition-colors'
                >
                    <IoLeaf className='cursor-pointer text-2xl' />
                </button>
            </div>
        </motion.div >)
}

export default PlantCard