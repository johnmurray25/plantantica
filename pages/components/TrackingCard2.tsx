import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown';
import { IoChevronUp } from '@react-icons/all-files/io5/IoChevronUp';
import { IoLeafOutline } from '@react-icons/all-files/io5/IoLeafOutline';
import { IoWaterOutline } from '@react-icons/all-files/io5/IoWaterOutline';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image'
import React, { useState } from 'react'
import Plant from '../../domain/Plant';
import { feedPlantInDB, updateDaysBetweenWatering } from '../../service/PlantService';

interface Props {
    plant: Plant;
    userID: string;
    needsWater?: boolean;
}

const MILLIS_IN_DAY = 86400000

const TrackingCard2 = (props: Props) => {
    const { userID, needsWater } = props
    const [plant, setPlant] = useState(props.plant)

    const [dateToWaterNext, setDateToWaterNext] = useState(plant?.dateToWaterNext || new Date(new Date().getTime() + MILLIS_IN_DAY));
    const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant?.daysBetweenWatering);
    const [expanded, setExpanded] = useState(false)

    return (
        <div >
            <div className="pr-2 mx-0 w-1/3 relative h-full">
                {plant.imageUrl &&
                    <Image
                        src={plant.imageUrl}
                        alt={`Photo of ${plant.species}`}
                        loading='lazy'
                        fill
                        sizes="200px"
                        className='object-cover'
                    />
                }
            </div>
            <div className="w-2/3 relative h-fit">
                <div className='flex justify-between w-full pr-2 pt-3 pb-2 bg-secondary bg-opacity-30'>
                    <h3 className='text-primary text-left text-opacity-80 text-2xl ml-4'>
                        {plant.species}
                    </h3>
                    {plant.dateObtained &&
                        <p className='text-primary text-right text-opacity-60 pt-2'>
                            had since {plant.dateObtained.toLocaleDateString()}
                        </p>
                    }
                </div>
                <div className='shadow-sm flex-col justify-evenly bg-tertiary bg-opacity-10'>
                    <div className={`w-full p-1 mt-2 text-primary  text-opacity-70 pl-3 flex justify-between items-center relative  `}>
                        {/* Water dates */}
                        <div className={`text-sm px-1 `}>
                            Last watered {plant.dateLastWatered.toLocaleDateString()}
                            {/* <div className='flex w-full justify-center border border-t-0 border-x-0 border-gray-800 border-opacity-50 my-0.5 -translate-x-2'></div> */}
                            <p className={`${needsWater ? "text-lg text-primary text-opacity-90" : "text-md"}`}>
                                Water next {dateToWaterNext.toLocaleDateString()}
                            </p>
                        </div>
                        {/* Water button: */}
                        <button
                            onClick={() => {
                                if (!confirm('Mark as watered today?')) {
                                    return;
                                }
                                // props.waterPlant(plant, userID)
                                //     .then(p => {
                                //         setPlant(p)
                                //         setDateToWaterNext(p?.dateToWaterNext)
                                //     })
                                //     .catch(e => { console.error(e); console.error("Failed to mark plant as watered") })
                            }}
                            className='flex items-center hover:bg-gray-100 hover:bg-opacity-40  hover:border-blue-300 text-blue-600  //hover:text-sky-200
                            cursor-pointer px-3 py-2 rounded-full h-fit //bg-tertiarybg-opacity-80 transition-colors'
                        >
                            {/* <p>
                        Water
                    </p> */}
                            <IoWaterOutline className={`text-2xl `} />
                        </button>
                    </div>
                </div>
                <motion.div>
                    <AnimatePresence >
                        {expanded ?
                            <motion.div
                                exit={{ opacity: 0 }}
                                transition={{ delay: 1 }}
                                initial={false}
                                //className='flex shadow min-h-64 bg-gray-100 bg-opacity-40 mb-2 mx-auto w-full'
                            >
                                {(plant?.dateToFeedNext || plant?.dateLastFed) &&
                                    <div className="w-full text-sm px-3 mt-2 pb-2 flex justify-between items-center relative bg-secondary bg-opacity-30  text-primary text-opacity-70">
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
                                cursor-pointer text-sm p-3 py-2 rounded-full h-fit //bg-tertiary //bg-opacity-80 transition-colors'
                                        >
                                            <IoLeafOutline className='cursor-pointer text-xl' />
                                        </button>
                                    </div>
                                }
                                <div className='px-4 py-4'>
                                    <div className=" flex justify-center pr-4 py-1 text-lg">
                                        <div>
                                            <div className='futura text-sm flex items-center text-primary text-opacity-60 '>
                                                <>
                                                    Water every&nbsp;
                                                </>
                                                <div className="bg-tertiary shadow-sm rounded-full pt-1">
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
                                                            setDateToWaterNext(newDate)
                                                        }}
                                                    >
                                                        <div className='-translate-y-[1px]'>
                                                            -
                                                        </div>
                                                    </button>
                                                    <span className=' text-primary text-opacity-90 text'>
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
                                                            setDateToWaterNext(newDate)
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
                                    <div className="text-primary flex justify-center pt-4">
                                        <button
                                            onClick={() => setExpanded(false)}
                                        >
                                            <IoChevronUp fill='currentColor' />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                            :
                            <div className="flex justify-center items-center text-primary text-xl py-2">
                                <button onClick={() => setExpanded(true)}>
                                    <IoChevronDown fill='currentColor' />
                                </button>
                            </div>
                        }
                    </AnimatePresence>
                </motion.div>
            </div>
        </div >
    )
}

export default TrackingCard2