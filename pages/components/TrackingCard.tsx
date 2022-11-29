import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoPartlySunnySharp } from '@react-icons/all-files/io5/IoPartlySunnySharp';
import { IoSunnySharp } from '@react-icons/all-files/io5/IoSunnySharp';
import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { IoLeaf } from '@react-icons/all-files/io5/IoLeaf';
import { getDownloadURL, ref } from 'firebase/storage';

import storage from '../../firebase/storage';
import Plant from '../../domain/Plant';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import customImageLoader from '../../util/customImageLoader';
import { useRouter } from 'next/router';
import { IoPencil } from '@react-icons/all-files/io5/IoPencil';
import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import TimelineInCard from './TimelineInCard';
import Update from '../../domain/Update';
import { deletePlant, feedPlantInDB, waterPlantInDB } from '../../service/PlantService';

const MILLIS_IN_DAY = 86400000

const SM_WIDTH = 650
const MD_WIDTH = 1140
const LG_WIDTH = 1530

const waterPlant = async (plant: Plant, uid: string): Promise<Plant> => {
    // Calculate next watering date
    let today = new Date();
    let daysBetweenWatering = plant.daysBetweenWatering ? plant.daysBetweenWatering : 7;
    let nextWaterDateMs = today.getTime() + (daysBetweenWatering * 86400000);

    await waterPlantInDB(uid, plant.id, nextWaterDateMs);

    return {
        ...plant,
        dateLastWatered: today,
        dateToWaterNext: new Date(nextWaterDateMs)
    }
}

interface Props {
    plant: Plant;
    userID: string;
    updates: Update[];
}

const PlantCard: FC<Props> = (props) => {
    const router = useRouter();

    // dimensions
    const { width, height } = useWindowDimensions();

    // props
    const [userID] = useState(props.userID);
    const [plant, setPlant] = useState(props.plant);
    const [dateToWaterNext, setDateToWaterNext] = useState(plant ? plant.dateToWaterNext : new Date(new Date().getTime() + MILLIS_IN_DAY));

    // state
    const [wateringState, setWateringState] = useState('good');
    const [imageURL, setImageURL] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);
    const [hidden, setHidden] = useState(false)

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    }

    useEffect(() => {
        // console.log(`TrackingCard: in useEffect ${plant&&plant.species}`)
        if (!plant) {
            return;
        }
        if (imageURL == '' && userID && plant.picture && plant.picture !== '') {
            // setIsImageLoading(false)
            // console.log('getting download url...')
            getDownloadURL(ref(storage, `${userID}/${plant.picture}`))
                .then(downloadUrl => setImageURL(downloadUrl))
                .catch(e => {
                    console.debug(e);
                    console.error('Failed to load image from storage bucket')
                })
                .finally(() => setIsImageLoading(false))
        } else if (isImageLoading) {
            setIsImageLoading(false)
        }
        let today = new Date();
        // CHECK state
        if (today.toLocaleDateString() == dateToWaterNext.toLocaleDateString()) {
            setWateringState('check');
            return;
        }
        // GOOD state
        if (today.getTime() < dateToWaterNext.getTime()) {
            setWateringState('good');
            return;
        }
        // BAD state
        if ((today.getTime() - dateToWaterNext.getTime()) >= (2 * MILLIS_IN_DAY)) {
            setWateringState('bad');
            return;
        }
        // CHECK state
        setWateringState('check');
    }, [dateToWaterNext, imageURL, isImageLoading, plant, userID]);

    const getBgStyle = () => {
        if (!plant || hidden) {
            return 'hidden';
        }
        let sharedStyle = "antialiased " +
            (width > SM_WIDTH ? 'rounded-md p-0 m-2 ' : 'rounded p-0 ')
        if (wateringState == 'good') {
            return sharedStyle + ' bg-lime-900 border-[#29bc29] ';
        }
        else {
            return sharedStyle + ' bg-[#ccae62] text-black ';
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
        if (width <= SM_WIDTH) return width * 1.2;
        return height / 2;
    })();

    return plant && !isImageLoading && (
        <div
            // key={plant.id}
            className={getBgStyle()}
            style={{ transition: 'background-color 1s ease', }}
        >
            {/* Picture */}
            <div className='relative pt-2'>
                {plant.picture && imageURL && imageURL !== '' &&
                    <div className={` flex px-0 mx-0 py-1 w-full relative h-[${width}px]`}>
                        <Image
                            src={imageURL}
                            alt={`photo of ${plant.species}`}
                            loader={customImageLoader}
                            loading='lazy'
                            // layout='fill' 
                            width={imgWidth}
                            height={Math.min(imgHeight, imgWidth)}
                            className='rounded object-cover object-center' />
                    </div>
                }
            </div>
            <div className="w-full flex justify-between items-center">
                {/* Species */}
                <h1 className='text-left p-1 '>
                    <a className='hover:underline text-3xl italic pl-2 pt-5 leading-7' href={`http://wikipedia.org/wiki/${plant.species.replaceAll(' ', '_')}`} >
                        {plant.species}
                    </a>
                </h1>
                {/* Edit/Delete buttons */}
                <div className="flex-col pr-2 pb-2 ">
                    {/* <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} /> */}
                    <div className={`flex items-center border mx-4 px-6 py-1 mb-2 mt-1 hover:bg-white hover:text-black hover:border-white cursor-pointer rounded-full p-2 
                    ${wateringState == 'good' ?
                            'border-[#ffe894] //text-[#ffe894]' :
                            'border-black'}`}
                        onClick={() => router.push(`/EditPlantTrackingDetails/${plant.id}`)}>
                        <IoPencil />
                    </div>
                    <div className={`flex items-center mx-4 px-6 py-1 my-1 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer border rounded-full p-2 
                    ${wateringState == 'good' ?
                            'border-red-400' :
                            'border-red-900 text-red-900'}`}
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
                    </div>
                </div>
            </div>
            <div className="px-5 py-1 text-lg">
                <div className='flex justify-between text-sm '>
                    {plant.dateObtained &&
                        <p>
                            had since {plant.dateObtained.toLocaleDateString()}
                        </p>
                    }
                    {/* {plant.lightRequired < 5 ?
                        <IoPartlySunnySharp className={getIconStyle()} />
                        :
                        <IoSunnySharp className={getIconStyle()} />
                    } */}
                    <p className='text-lg'>
                        water every <span className='font-bold'>{plant.daysBetweenWatering}</span> days
                    </p>
                </div>
                {/* Instructions & Updates buttons */}
                <div className='relative'>
                    <div
                        className={`w-fit top-2 left-2 text-sm hover:bg-[#ffff63] hover:border-[#ffff63] cursor-pointer //border rounded-full py-1 px-5  
                            ${wateringState == "good" ? "border-white hover:text-black" : "border-black"}
                            ${plant && plant.careInstructions ? "opacity-100" : "opacity-0 h-0"}
                            `}
                        onClick={toggleInstructions}
                    >
                        Instructions
                        &nbsp;
                        {showInstructions ? <span>&nbsp;&darr;</span> : <span>&rarr;</span>}
                    </div>
                    <div className="flex justify-end text-sm">
                        <div
                            className={`hover:bg-[#ffaf63] hover:text-black hover:border-[#ffaf63] cursor-pointer rounded-full py-2 px-5 mx-1 
                                    ${wateringState == 'good' ?
                                    'border border-[#ffe894] text-[#ffe894] ' :
                                    'border border-darkYellow '}`}
                            onClick={() => setShowUpdates(!showUpdates)}
                        >
                            Updates
                        </div>
                        <div
                            className={"hover:bg-[#29bc29] hover:text-white hover:border-[#29bc29] cursor-pointer rounded-full py-2 px-3 ml-2 " +
                                (wateringState == 'good' ? 'border border-[#ffe894] text-[#ffe894]' : ' border border-darkYellow  ')}
                            onClick={() => router.push(`/AddUpdateForPlant/${plant.id}`)}
                        >
                            +
                        </div>
                    </div>

                </div>
                {/* Instructions: */}
                <div className={`py-2 pr-40 ${showInstructions ? 'opacity-100' : 'opacity-0 h-0'} transition ease-linear duration-100`}>
                    {plant?.careInstructions}
                </div>
                {/* Updates: */}
                {showUpdates && plant &&
                    <div className="py-2 flex justify-end">
                        {plant.updates?.length > 0 ?
                            <TimelineInCard plantId={plant.id} updates={plant.updates || []}
                                species={plant.species} uid={userID} key={plant.id + "_timeline"}
                                width={imgWidth / 3} height={imgHeight / 2.5}
                            />
                            :
                            <p className='text-lg bg-red'>
                                No updates for this plant.
                            </p>
                        }
                    </div>
                }
                <div className='flex justify-between items-center relative '>
                    {/* Water dates */}
                    <div className='pt-4'>
                        last watered {plant.dateLastWatered.toLocaleDateString()}
                        <br></br>
                        <p className={wateringState != 'good' ? 'font-extrabold' : ''}>
                            water next {plant.dateToWaterNext.toLocaleDateString()}
                        </p>
                    </div>
                    {/* Water button: */}
                    <button
                        onClick={() => {
                            if (!confirm('Mark as watered today?')) {
                                return;
                            }
                            waterPlant(plant, userID)
                                .then(p => {
                                    setWateringState('good')
                                    setPlant(p)
                                    setDateToWaterNext(p?.dateToWaterNext)
                                })
                                .catch(e => { console.error(e); console.error("Failed to mark plant as watered") })
                        }}
                        className={`flex items-center hover:text-white hover:bg-blue-400 
                            cursor-pointer text-sm px-8 py-2  lg:mt-2 border rounded-full h-fit
                            ${wateringState == 'good' ? 'border-blue-300' : 'border-blue-500'}`}
                    >
                        Water
                        &nbsp;
                        <IoWater className={`text-lg
                            ${wateringState == 'good' ? 'text-blue-200' : 'text-blue-600 animate-bounce text-xl'}`} />
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
                            feedPlantInDB(userID, plant.id)
                                .then(() => {
                                    const updatedPlant = { ...plant, dateLastFed: new Date() }
                                    setPlant(updatedPlant)
                                }).catch(console.error);
                        }}
                        className={"flex items-center hover:text-white //bg-lime-500 hover:bg-lime-600 cursor-pointer text-sm px-8 py-2 border rounded-full "
                                    + (wateringState == 'good' ? " border-lime-600" : " border-lime-900")}
                    >
                        Feed
                        &nbsp;
                        <IoLeaf className={`cursor-pointer text-lg
                            ${wateringState == 'good' ? 'text-lime-200' : 'text-lime-900'}`} />
                    </button>
                </div>
            </div>
        </div>)
}

export default PlantCard