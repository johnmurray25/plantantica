import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import Plant from '../../domain/Plant';
import useAuth from '../../hooks/useAuth';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import TrackingCard2 from './TrackingCard2';

interface Props {
    plants: Plant[];
}

const today = new Date();

const MyPlants = (props: Props) => {
    const [plants] = useState(props.plants || [])
    const { user } = useAuth()
    const { width } = useWindowDimensions()

    const [plantsToWater, setPlantsToWater] =
        useState<Plant[]>(plants.filter(p => today.getTime() >= p.dateToWaterNext?.getTime() || today.toLocaleDateString() == p.dateToWaterNext?.toLocaleDateString()))

    return (
        <div className='w-full items-center border-t bg-secondaryDark bg-opacity-40 border-gray-400 border-opacity-50 pt-4'>
            <h2 className='text-left font-bold text-sm text-primary text-opacity-70 pl-12'>
                THESE PLANTS MIGHT NEED WATER:
            </h2>
            <motion.div className={`${width >= 420 ? "grid grid-cols-2 gap-y-1 gap-x-4" : "grid grid-cols-1"}  max-w-[1200px] m-auto pt-6 `}>
                <AnimatePresence>
                    {plantsToWater.map(p => {
                        return (
                            <TrackingCard2 key={p.id} plant={p} userID={user.uid} needsWater />
                        )
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default MyPlants