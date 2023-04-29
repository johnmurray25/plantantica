import React from 'react'
import Plant from '../../../domain/Plant';

const DaysBetweenWateringToggle = (props: {
    plant;
    updateDaysBetweenWatering;
    setDaysBetweenWatering;
    setWaterNext;
    getWaterNext;
    userID;
}) => {

    const { plant, updateDaysBetweenWatering, setDaysBetweenWatering, setWaterNext, getWaterNext, userID } = props;

    return (
        <div className="bg-gray-100bg-opacity-30 //shadow-sm rounded-full pt-1">
            <button
                className="bg-green-700 bg-opacity-70 text-white text-opacity-70 hover:bg-lime-700 transition-colors text-2xl font-bold rounded-full h-fit px-1 mx-2 "
                style={{ lineHeight: 0.7 }}
                onClick={() => {
                    const n = Number(plant?.daysBetweenWatering) - 1
                    let newDate = new Date(plant?.dateToWaterNext?.getTime() - 86400000)
                    updateDaysBetweenWatering(userID, plant?.id, n, newDate.getTime())
                    plant.daysBetweenWatering = n
                    plant.dateToWaterNext = newDate
                    setDaysBetweenWatering(n)
                    setWaterNext(getWaterNext(newDate))
                }}
            >
                <div className='-translate-y-[1px]'>
                    -
                </div>
            </button>
            <span className=' text-gray-100 text-opacity-80 text-lg'>
                {plant?.daysBetweenWatering}
            </span>
            <button
                className="bg-green-700 bg-opacity-70 text-white text-opacity-70 hover:bg-lime-700  transition-colors font-bold text-xl rounded-full h-fit px-1 mx-2 "
                style={{ lineHeight: 0.9 }}
                onClick={() => {
                    const n = Number(plant?.daysBetweenWatering) + 1
                    let newDate = new Date(plant?.dateToWaterNext?.getTime() + 86400000)
                    updateDaysBetweenWatering(userID, plant.id, n, newDate.getTime())
                    plant.daysBetweenWatering = n
                    setDaysBetweenWatering(n)
                    plant.dateToWaterNext = newDate
                    setWaterNext(getWaterNext(newDate))
                }}
            >
                <div className='-translate-y-[1px]'>
                    +
                </div>
            </button>
        </div>
    )
}

export default DaysBetweenWateringToggle