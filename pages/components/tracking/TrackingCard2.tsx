import React, { useCallback, useContext, useEffect, useState } from 'react'
import { formatDistance, compareAsc } from 'date-fns'

import Plant from '../../../domain/Plant';
import { feedPlantInDB, getUpdatesForPlant, updateDaysBetweenWatering } from '../../../service/PlantService';
import ReactLoading from 'react-loading'
import Update from '../../../domain/Update';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import PlantContext from '../../../context/PlantContext';
import ImageWithZoom from '../util/ImageWithZoom';
import EditPlantButton from './EditPlantButton';
import DeletePlantButton from './DeletePlantButton';
import WaterButton from './WaterButton';
import FeedButton from './FeedButton';
import ResizablePanel from '../util/ResizablePanel';
import TimelineInCard from './TimelineInCard';
import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown';
import { IoChevronUp } from '@react-icons/all-files/io5/IoChevronUp';

interface Props {
    plant: Plant;
    userID: string;
    needsWater?: boolean;
    goToEditScreen: (plantId: string) => void;
    goToAddUpdateScreen: (plantId: string) => void;
    waterPlant: (plant: Plant) => void;
}

const MILLIS_IN_DAY = 86400000

const getWateringStatus = (date: Date): string => {
    if (!date) {
        return "No watering data yet"
    }

    const today = new Date()
    const distance = formatDistance(date, today, { addSuffix: true })

    if (!distance.includes("day")) {
        const diff = today.toLocaleDateString().localeCompare(date.toLocaleDateString());
        if (diff === 0) {
            return "Water today"
        } else {
            let comparison = compareAsc(today, date);
            if (comparison < 0) {
                return "Tomorrow"
            } else {
                return "Water today";
            }
        }
    }

    if (!distance.startsWith("in")) {
        if (distance.includes("day")) {
            const days = distance.split(" ")[0];
            if (days.localeCompare("1") === 0) {
                return days + " day overdue";
            } else {
                return days + " days overdue";
            }
        }
    } else {
        if (distance.localeCompare("in 1 day") === 0) {
            return "Tomorrow";
        }
        if (distance.localeCompare("1 day ago") === 0) {
            return "1 day overdue"
        }
        return `${distance}`;
    }

}

const TrackingCard2 = (props: Props) => {
    const { userID, needsWater } = props
    const [plant, setPlant] = useState(props.plant)
    const { deletePlant } = useContext(PlantContext)
    const [updates, setUpdates] = useState<Update[]>([])
    const [showUpdates, setShowUpdates] = useState(false)
    // const [showInstructions, setShowInstructions] = useState(false)
    const [isLoadingUpdates, setIsLoadingUpdates] = useState(true)
    const [wateringStatus, setWateringStatus] = useState(getWateringStatus(plant?.dateToWaterNext))
    const { width, height } = useWindowDimensions()
    // console.log(plant.species)
    // console.log(plant.dateToWaterNext?.toLocaleDateString())
    // console.log(waterNext)
    const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant?.daysBetweenWatering);
    const [expanded, setExpanded] = useState(false)
    // const [showEditDelete, setShowEditDelete] = useState(false)
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
        <div className={hidden ? "hidden" : 'flex shadow min-h-64  bg-gray-100 bg-opacity-30 //borderborder-gray-900 dark:bg-[#787B61] dark:bg-opacity-100 backdrop-blur mb-2 mx-auto w-full'}
        >
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
            <div className="w-2/3 relative h-fit inter"
            // style={{ background: 'linear-gradient(90deg, rgba(165,169,142,1) 0%, rgba(144,150,140,1) 28%, rgba(149,159,152,1) 100%)' }}
            >
                <div className='text-gray-900 tracking-wider leading-tight text-center text-[20px] mx-2 italic pt-3 pb-1'>
                    {plant.species}
                </div>
                <div className='flex justify-between mx-6 pt-2 text-gray-900 text-[12px]'>
                    <EditPlantButton goToEditScreen={props.goToEditScreen} plant={plant} />
                    <DeletePlantButton deletePlant={deletePlant} setHidden={setHidden} plant={plant} />
                </div>
                <div className='flex justify-end w-full pr-4 py-2'>
                    {plant.dateObtained &&
                        <p className='text-xs whitespace-pre-wrap text-gray-900 text-opacity-80 py-1'>
                            had since {plant.dateObtained.toLocaleDateString()}
                        </p>
                    }
                </div>
                <div className='flex-col justify-between'>
                    <div className={` w-full p-1 py-1  text-black text-opacity-70 pl-3 flex justify-start items-center relative `}>
                        {/* Water dates */}
                        <WaterButton waterPlant={() => props.waterPlant(plant)} />
                        <div className="text-sm pl-3">
                            Last watered {plant.dateLastWatered.toLocaleDateString()
                                .substring(0, plant.dateLastWatered.toLocaleDateString().length - 5)
                            }
                            <p className="text-lg pt-1">
                                {wateringStatus}
                            </p>
                        </div>
                    </div>
                    <div className="w-full  pl-3 p-1 py-2 mt-3 flex justify-start items-center relative  text-black text-opacity-70">
                        <FeedButton feedPlant={() => {
                            feedPlantInDB(userID, plant?.id)
                                .then(() => {
                                    const updatedPlant = {
                                        ...plant,
                                        dateLastFed: new Date()
                                    }
                                    setPlant(updatedPlant)
                                }).catch(console.error);
                        }} />
                        {/* Feeding dates */}
                        <div className="pl-3 text-sm">
                            {plant.dateLastFed && `Last fed ${plant.dateLastFed.toLocaleDateString()}`}
                            {/* <div className='flex w-full justify-center border border-t-0 border-x-0 border-gray-800 my-0.5 -translate-x-4'></div> */}
                            {/* <p>
                                {plant.dateToFeedNext && `Feed next ${plant.dateToFeedNext.toLocaleDateString()}`}
                            </p> */}
                        </div>
                    </div>
                    <div className="flex justify-end items-center text-sm mt-1 mb-2 mr-4">
                        <button
                            className="mr-2 border-[0.5px] text-[18px] border-black py-0.5 px-4 mt-1 text-black text-opacity-60 bg-gray-100 bg-opacity-30 rounded
                                hover:bg-gray-100 hover:bg-opacity-70 transition-colors h-5 flex justify-center items-center"
                            onClick={() => setShowUpdates(!showUpdates)}
                        >
                            {/* Updates */}
                            {showUpdates ?
                                <IoChevronUp />
                                :
                                <IoChevronDown />
                            }
                        </button>
                        <button
                            className="text-black border-[0.5px] border-black text-opacity-80 text-[18px] rounded bg-gray-100 bg-opacity-30 px-2  py-0.5
                              mt-1 hover:bg-gray-100 hover:bg-opacity-70 transition-colors h-5 flex items-center justify-center"
                            onClick={() => props.goToAddUpdateScreen(plant?.id)}
                        >
                            +
                        </button>
                    </div>
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
                    {/* <ResizablePanel >
                        {expanded ?
                            <ExpandedSection />
                            :
                            <button
                                className="w-full  flex justify-center items-center text-primary text-opacity-60 text-xl pb-1"
                                onClick={() => setExpanded(true)}
                            >
                                <div className='//bg-gray-100 bg-opacity-30 px-6 rounded-b-full //border-t-[3px] border-secondary border-opacity-70'>
                                    <IoChevronDown className='text-dark text-opacity-60' />
                                </div>
                            </button>
                        }
                    </ResizablePanel> */}
                </div >
            </div >
        </div >
    )
}

export default TrackingCard2