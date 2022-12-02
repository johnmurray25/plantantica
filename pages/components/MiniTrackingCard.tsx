import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';

import { getDownloadURL, ref } from 'firebase/storage';

import storage from '../../firebase/storage';
import Plant from '../../domain/Plant';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import customImageLoader from '../../util/customImageLoader';
import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { waterPlantInDB } from '../../service/PlantService';

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

const MILLIS_IN_DAY = 86400000

interface Props {
    plant: Plant;
    userID: string;
}

const PlantCard: FC<Props> = (props) => {
    const { width, height } = useWindowDimensions();

    const userID = props.userID;
    const [plant, setPlant] = useState(props.plant)

    const [imageURL, setImageURL] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [needsWater, setNeedsWater] = useState(false);

    useEffect(() => {
        if (!plant) {
            return;
        }
        if (imageURL == '' && userID && plant.picture && plant.picture !== '') {
            getDownloadURL(ref(storage, `${userID}/${plant.picture}`))
                .then(setImageURL)
                .catch(e => { console.debug(e); console.error('Failed to load image from storage bucket') })
                .finally(() => setIsImageLoading(false))
        } else if (isImageLoading) {
            setIsImageLoading(false)
        }
        // Does plant need water?
        if ((new Date().getTime() - plant.dateToWaterNext?.getTime()) >= 0) {
            setNeedsWater(true);
        }
    }, [imageURL, isImageLoading, plant, userID]);


    return plant && !isImageLoading && (
        <div className={`border rounded border-stone-600 w-full antialiased
            ${needsWater ? "bg-dry text-stone-800"
            : "bg-lime-900 text-zinc-200"}`}
            style={{ transition: 'background-color 1s ease', }}
        >
            {/* Picture */}
            {plant.picture && imageURL && imageURL !== '' &&
                <div className="px-0 mx-0 py-1 flex justify-center">
                    <Image
                        src={imageURL}
                        alt={`photo of ${plant.species}`}
                        loader={customImageLoader}
                        loading='lazy'
                        // layout='fill' 
                        width={width}
                        height={height / 3}
                        className='object-cover object-center'
                    />
                </div>
            }
            <div className="flex justify-between px-1">
                <h1 className='italic pl-2 font-bold'>
                    {plant.species}
                </h1>
                <button
                    onClick={() => {
                        if (!confirm('Mark as watered today?')) {
                            return;
                        }
                        waterPlant(plant, userID)
                            .then(p => {
                                setNeedsWater(false)
                                setPlant(p)
                            })
                            .catch(e => { console.error(e); console.error("Failed to mark plant as watered") })
                    }}
                >
                    {needsWater &&
                        <IoWater className='text-lg text-blue-500 animate-bounce' />
                    }
                </button>
            </div>
        </div >)
}

export default PlantCard