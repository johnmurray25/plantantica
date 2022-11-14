import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoPartlySunnySharp } from '@react-icons/all-files/io5/IoPartlySunnySharp';
import { IoSunnySharp } from '@react-icons/all-files/io5/IoSunnySharp';
import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { IoLeaf } from '@react-icons/all-files/io5/IoLeaf';
import { getDownloadURL, ref } from 'firebase/storage';

import storage from '../../../firebase/storage';
import Plant from '../../../domain/Plant';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import customImageLoader from '../../../util/customImageLoader';
import { useRouter } from 'next/router';
import { IoPencil } from '@react-icons/all-files/io5/IoPencil';
import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import TimelineInCard from './TimelineInCard';
import Update from '../../../domain/Update'

interface Props {
    plant: Plant;
    waterPlant: () => Promise<void>;
    removePlant: (plant: Plant) => Promise<void>;
    userID: string;
    feedPlant: () => Promise<void>;
    updates: Update[];
}

const MILLIS_IN_DAY = 86400000;
// const wateringStates = ['good', 'check', 'bad']

const SM_WIDTH = 650; // most phones are less than this width
const MD_WIDTH = 1140;
const LG_WIDTH = 1530; // computers will be larger than this

const PlantCard: FC<Props> = (props) => {
    const router = useRouter();

    // dimensions
    const { width, height } = useWindowDimensions();

    // props
    const [userID] = useState(props.userID);
    const [plant] = useState(props.plant);
    const [dateToWaterNext] = useState(plant ? plant.dateToWaterNext : new Date(new Date().getTime() + MILLIS_IN_DAY));

    // state
    const [wateringState, setWateringState] = useState('good');
    const [imageURL, setImageURL] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    }

    useEffect(() => {
        // console.log(`TrackingCard: in useEffect ${plant&&plant.species}`)
        if (!plant) {
            return;
        }
        if (imageURL == '' && userID && plant.picture && plant.picture !== '') {
            // console.log('getting download url...')
            getDownloadURL(ref(storage, `${userID}/${plant.picture}`))
                .then(downloadUrl => setImageURL(downloadUrl))
                .catch(e => {
                    console.debug(e);
                    console.error('Failed to load image from storage bucket')
                });
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
    }, [dateToWaterNext, imageURL, plant, userID]);

    const getBgStyle = () => {
        if (!plant) return 'hidden';
        let sharedStyle = width > SM_WIDTH ? 'rounded-md p-0 m-2 ' : 'rounded p-0 '
        if (wateringState == 'good')
            return sharedStyle + ' bg-[#286314] border-[#29bc29] ';
        if (wateringState == 'check')
            return sharedStyle + 'bg-[#afaf63] text-black ';
        if (wateringState == 'bad')
            return 'rounded-md bg-[#afaf63] text-black';
    }
    const getWtrBtnStyle = () => {
        let classNames = "flex cursor-pointer text-sm px-4 py-2 leading-none border rounded hover:border-transparent " +
            "hover:text-green hover:bg-[#8de2ef] mt-4 lg:mt-2 ";
        if (wateringState == 'good')
            classNames += " border-yellow text-yellow ";
        else
            classNames += " border-black text-black ";
        // when running 'next build' etc.
        if (!width) return classNames;
        // 1 column
        else if (width <= SM_WIDTH) classNames += " absolute top-1 right-1 ";
        // 2-4 columns
        else classNames += " absolute top-1 right-1 h-8 ";
        return classNames;
    }
    const getIconStyle = () => {
        return wateringState != 'good' ? 'text-black' : 'text-yellow';
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

    return plant && (
        <div 
            key={plant.id} 
            className={getBgStyle()}
            style={{
                transition: 'background-color 1s ease',
            }}
        >
            <div className='relative pt-2'>
                <div className="w-full flex justify-between pt-2 pr-2">
                    {/* <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} /> */}
                    <div className={`flex items-center mx-4 mb-1 px-6 py-1 hover:bg-white hover:text-black hover:border-white cursor-pointer border rounded p-2 ${wateringState == 'good' ? 'border-white' : 'border-black'}`}
                        onClick={() => router.push(`/EditPlantTrackingDetails/${plant.id}`)}>
                        <IoPencil />
                    </div>
                    <div className={`flex items-center mx-4 mb-1 px-6 py-1 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer border rounded p-2 ${wateringState == 'good' ? 'border-white' : 'border-black'}`}
                        onClick={() => props.removePlant(plant)}>
                        <IoTrash />
                    </div>
                </div>
            </div>
            {plant.picture && imageURL && imageURL !== '' &&
                <div className='flex px-0 mx-0 pt-2 pb-2 w-full relative'>
                    <Image
                        src={imageURL}
                        alt={`photo of ${plant.species}`}
                        loader={customImageLoader}
                        loading='lazy'
                        // layout='fill' 
                        width={imgWidth}
                        height={Math.min(imgHeight, imgWidth)}
                        className='rounded' />
                </div>
            }
            <h1 className='text-left p-1'>
                <a className='hover:underline text-3xl italic pl-2 pt-5 leading-7' href={`http://wikipedia.org/wiki/${plant.species.replaceAll(' ', '_')}`} >
                    {plant.species}
                </a>
            </h1>
            <div className="px-5 py-1 text-lg">
                <div className='flex justify-between text-sm '>
                    {plant.dateObtained &&
                        <p>
                            had since {plant.dateObtained.toLocaleDateString()}
                        </p>
                    }
                    {plant.lightRequired < 5 ?
                        <IoPartlySunnySharp className={getIconStyle()} />
                        :
                        <IoSunnySharp className={getIconStyle()} />
                    }
                    <p className='text-lg'>
                        water every {plant.daysBetweenWatering} days
                    </p>
                </div>
                {/* Instructions & Updates buttons */}
                <div className='relative'>
                    <div
                        className={`w-fit top-2 left-2 text-sm hover:bg-[#ffff63] hover:border-[#ffff63] cursor-pointer border rounded py-1 px-5  
                            ${wateringState == "good" ? "border-white hover:text-black" : "border-black"}
                            ${plant && plant.careInstructions ? "opacity-100" : "opacity-0 h-0"}
                            `}
                        onClick={toggleInstructions}
                    >
                        Instructions
                        &nbsp;
                        {showInstructions ? <span>&nbsp;&darr;</span> : <span>&rarr;</span>}
                    </div>
                    <div className='absolute top-2 right-2 text-sm '>
                        <div className="flex ">
                            <div
                                className={`hover:bg-[#ffaf63] hover:text-black hover:border-[#ffaf63] cursor-pointer border rounded py-1 px-5 mx-1 
                                    ${wateringState == 'good' ? 'border-white' : 'border-black'}`}
                                onClick={() => setShowUpdates(!showUpdates)}
                            >
                                Updates
                            </div>
                            <div
                                className={`hover:bg-[#29bc29] hover:text-white hover:border-[#29bc29] cursor-pointer border rounded py-1 px-3 
                                    ${wateringState == 'good' ? 'border-white' : 'border-black'}`}
                                onClick={() => router.push(`/AddUpdateForPlant/${plant.id}`)}
                            >
                                +
                            </div>
                        </div>
                    </div>

                </div>
                <div className={`py-2 pr-40 ${showInstructions ? 'opacity-100' : 'opacity-0 h-0'} transition ease-linear duration-100`}>
                    {plant?.careInstructions}
                </div>
                <div className="py-2 flex justify-end">
                    {showUpdates && plant && 
                        <TimelineInCard plantId={plant.id} updates={plant.updates||[]}
                            species={plant.species} uid={userID} key={plant.id}
                            width={imgWidth / 3} height={imgHeight / 2.5} />
                    }
                </div>
                <div className='flex justify-start relative mt-3'>
                    <a onClick={() => {
                        if (!confirm('Mark as watered today?')) {
                            return;
                        }
                        props.waterPlant().then(() => setWateringState('good'));
                    }}
                        className={getWtrBtnStyle()}>
                        <IoWater className={`cursor-pointer ${wateringState == 'good' ? 'text-blue-400' : 'text-blue-600'}`} />
                        &nbsp;&nbsp;
                        Water?
                        &nbsp;&nbsp;
                        <IoWater className={`cursor-pointer ${wateringState == 'good' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </a>
                    <div >
                        last watered {plant.dateLastWatered.toLocaleDateString()}
                        <br></br>
                        <p className={wateringState != 'good' ? 'font-extrabold' : ''}>
                            water next {plant.dateToWaterNext.toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {plant &&
                    <div className="flex justify-start relative">
                        <a
                            onClick={() => {
                                if (!confirm('Mark as fed today?')) {
                                    return;
                                }
                                props.feedPlant()
                                    .then(() => plant.dateLastFed = new Date())
                                    .catch(console.error);
                            }}
                            className={getWtrBtnStyle() + " hover:bg-[#a2ef8d] hover:border-[#a2ef8d]"}
                        >
                            <IoLeaf className={`cursor-pointer ${wateringState == 'good' ? 'text-lime-500' : 'text-lime-800'}`} />
                            &nbsp;&nbsp;
                            Feed?
                            &nbsp;&nbsp;
                            <IoLeaf className={`cursor-pointer ${wateringState == 'good' ? 'text-lime-500' : 'text-lime-800'}`} />
                        </a>
                        <div className='pt-2'>
                            {plant.dateLastFed && `last fed ${plant.dateLastFed.toLocaleDateString()}`}
                            <br></br>
                            {plant.dateToFeedNext && `feed next ${plant.dateToFeedNext.toLocaleDateString()}`}
                        </div>
                    </div>
                }
            </div>
        </div>)
}

export default PlantCard