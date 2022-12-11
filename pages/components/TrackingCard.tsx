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
        const sharedStyle = "antialiased " + (width > SM_WIDTH ? 'rounded-md p-0 m-2 ' : 'rounded p-0 ')
        if (needsWater) {
            return sharedStyle + ' bg-dry text-stone-800 ';
        } else {
            return sharedStyle + ' bg-lime-900 border-[#29bc29] ';
        }
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
            <div className='relative pt-2'>
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
            <div className="w-full flex justify-between items-center">
                {/* Species */}
                <h1 className='text-left p-1 '>
                    <a className='text-3xl italic pl-2 pt-5 leading-7 ' >
                        {plant.species}
                    </a>
                </h1>
                {/* Edit/Delete buttons */}
                <div className="flex-col pr-2 pb-2 ">
                    {/* <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} /> */}
                    <button className={`flex items-center border mx-4 px-6 py-1 mb-2 mt-1 hover:bg-white hover:text-black hover:border-white cursor-pointer rounded-full p-2 
                                ${!needsWater ? ' border-[#ffe894]' : ' border-black'}`}
                        onClick={() => props.goToEditScreen(plant?.id)}
                    >
                        <IoPencil />
                    </button>
                    <button className={`flex items-center mx-4 px-6 py-1 my-1 hover:bg-red-500 hover:text-stone-100 hover:border-red-500 cursor-pointer border rounded-full p-2 
                                ${!needsWater ? 'border-red-400' : 'border-red-900 text-red-900'}`}
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
            <div className='flex justify-start text-sm pl-4'>
                {plant.dateObtained &&
                    <p>
                        had since {plant.dateObtained.toLocaleDateString()}
                    </p>
                }
            </div>
            <div className=" flex justify-end pr-4 py-1 text-lg">
                <div>
                    {/* {plant.lightRequired < 5 ?
                        <IoPartlySunnySharp className={getIconStyle()} />
                        :
                        <IoSunnySharp className={getIconStyle()} />
                    } */}
                    <div className='flex items-center text-lg'>
                        <>
                            water every
                        </>
                        <button className="border rounded-full h-fit px-1 mx-2 leading-none border-darkYellow"
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
                        <span className='font-bold'>
                            {daysBetweenWatering}
                        </span>
                        <button className="border rounded-full h-fit px-1 mx-2 leading-none border-darkYellow"
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
                        days
                    </div>
                </div>
            </div>
            <div className='px-4'>
                {/* Instructions & Updates buttons */}
                <div className='relative'>
                    <button
                        className={`absolute top-0 left-2 text-sm hover:bg-lime-700 rounded-full py-1 px-5  
                            ${!needsWater ? "border-white " : " hover:text-stone-200"}
                            ${plant && plant.careInstructions ? "opacity-100 cursor-pointer" : "hidden"}
                            `}
                        style={{ transition: 'background-color 0.4s ease' }}
                        onClick={toggleInstructions}
                    >
                        Instructions
                        &nbsp;
                        {showInstructions ? <span>&nbsp;&darr;</span> : <span>&rarr;</span>}
                    </button>
                    <div className="flex justify-end text-sm mt-4">
                        <button
                            className={`hover:bg-amber-600 hover:border-amber-600 hover:text-stone-200 cursor-pointer rounded-full py-2 px-5 mx-1 
                                    ${!needsWater ?
                                    'border border-[#ffe894] text-[#ffe894] ' :
                                    'border border-darkYellow '}`}
                            style={{ transition: 'background-color 0.4s ease' }}
                            onClick={handleShowUpdates}
                        >
                            Updates
                        </button>
                        <button
                            className={"hover:bg-amber-800 hover:border-amber-800 hover:text-stone-200 cursor-pointer rounded-full py-2 px-3 ml-2 " +
                                (!needsWater ? 'border border-[#ffe894] text-[#ffe894]' : ' border border-darkYellow  ')}
                            style={{ transition: 'background-color 0.4s ease' }}
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
                <div className='flex justify-between items-center relative '>
                    {/* Water dates */}
                    <div className='pt-4'>
                        last watered {plant.dateLastWatered.toLocaleDateString()}
                        <br></br>
                        <p className={needsWater ? 'font-extrabold' : ''}>
                            water next {dateToWaterNext.toLocaleDateString()}
                        </p>
                    </div>
                    {/* Water button: */}
                    <button
                        style={{ transition: 'background-color 0.4s ease' }}
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
                        className={`flex items-center hover:text-stone-100 hover:bg-blue-400  hover:border-blue-400
                            cursor-pointer text-sm px-8 py-2 border rounded-full h-fit
                            ${!needsWater ? 'border-blue-300' : 'border-blue-500'}`}
                    >
                        <p>
                            Water
                        </p>
                        &nbsp;
                        <IoWater className={`text-lg
                            ${!needsWater ? 'text-blue-200' : 'text-blue-600 animate-bounce text-xl'}`} />
                    </button>
                </div>
                <div className="flex justify-between items-center relative">
                    <div className={`pt-2 ${(!plant.dateLastFed || !plant.dateToFeedNext) && 'pb-8'}`}>
                        {plant.dateLastFed && `last fed ${plant.dateLastFed.toLocaleDateString()}`}
                        <br></br>
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
                        className={"flex items-center hover:text-stone-100 hover:bg-lime-600 hover:border-lime-600 cursor-pointer text-sm px-8 py-2 border rounded-full "
                            + (!needsWater ? " border-lime-600" : " border-lime-900")}
                        style={{ transition: 'background-color 0.4s ease' }}
                    >
                        Feed
                        &nbsp;
                        <IoLeaf className={`cursor-pointer text-lg
                            ${!needsWater ? 'text-lime-200' : 'text-lime-900'}`} />
                    </button>
                </div>
            </div>
        </motion.div>)
}

export default PlantCard