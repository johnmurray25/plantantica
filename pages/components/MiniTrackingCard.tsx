import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { motion } from 'framer-motion';

import Plant from '../../domain/Plant';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { IoWater } from '@react-icons/all-files/io5/IoWater';

interface Props {
    plant: Plant;
    userID: string;
    waterPlant: (plant: Plant, uid: string) => Promise<Plant>;
}

const PlantCard = (props: Props) => {
    const { width, height } = useWindowDimensions();

    const userID = props.userID;
    const [plant, setPlant] = useState(props.plant)

    const [needsWater, setNeedsWater] = useState(false);

    useEffect(() => {
        if (!plant) {
            return;
        }
        // Does plant need water?
        const today = new Date()
        const dateToWaterNext = plant.dateToWaterNext || new Date(new Date().getTime() + 86400000)
        if (today.getTime() >= dateToWaterNext?.getTime() || today.toLocaleDateString() == dateToWaterNext?.toLocaleDateString()) {
            setNeedsWater(true)
        }
    }, [plant, userID]);


    return plant && (
        <motion.div
            layout
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={`border rounded border-stone-600 w-full antialiased h-full
                ${needsWater ? " bg-dry text-stone-800"
                    : " bg-lime-900 text-zinc-200"}`}
            style={{ transition: 'background-color 1s ease', }}
        >
            {/* Picture */}
            {plant.imageUrl &&
                <div className="relative px-0 mx-0 py-1 w-full ">
                    <Image
                        src={plant.imageUrl}
                        alt={`Photo of ${plant.species}`}
                        loading='lazy'
                        width={width || 250}
                        height={height ? height / 3 : 250}
                        sizes='50vw, 33vw'
                        className='object-cover object-center h-1/5'
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
                        props.waterPlant(plant, userID)
                            .then(p => {
                                setNeedsWater(false)
                                setPlant(p)
                            })
                            .catch(e => { console.error(e); console.error("Failed to mark plant as watered") })
                    }}
                >
                    <IoWater className={`text-lg text-blue-500 ${needsWater && 'animate-bounce'}`} />
                </button>
            </div>
        </motion.div >)
}

export default PlantCard