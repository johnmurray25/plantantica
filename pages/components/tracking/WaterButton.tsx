import { IoWater } from '@react-icons/all-files/io5/IoWater';
import React from 'react'

const WaterButton = (props: {
    waterPlant;
}) => {

    const { waterPlant } = props;

    return (
        <button
            onClick={() => {
                if (!confirm('Mark as watered today?')) {
                    return;
                }
                waterPlant()
                // let wnext = 
                // setWaterNext(getWateringStatus(p?.dateToWaterNext))
            }}
            className='bg-gray-100 bg-opacity-30 border-[0.5px] border-gray-900 flex items-center justify-center
                            cursor-pointer px-3 h-8 rounded w-20 hover:bg-gray-100 hover:bg-opacity-70 transition-colors '
        >
            Water
            {/* <IoWater className="text-xl" /> */}
        </button>
    )
}

export default WaterButton