import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoSunny } from '@react-icons/all-files/io5/IoSunny';
import { IoPartlySunny } from '@react-icons/all-files/io5/IoPartlySunny';
import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { getDownloadURL, ref } from 'firebase/storage';

import storage from '../../firebase/storage';
import Plant from '../../domain/Plant';
import DropDownMenu from './DropDownMenu';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import borderStyles from '../../styles/border.module.css';

interface Props {
    plant: Plant;
    waterPlant;
    removePlant;
    userEmail: string;
}

const MILLIS_IN_DAY = 86400000;
// const wateringStates = ['good', 'check', 'bad']

const PlantCard: FC<Props> = (props) => {

    // dimensions
    const { width, height } = useWindowDimensions();

    // props
    const [userEmail] = useState(props.userEmail);
    const [plant] = useState(props.plant);
    const [dateToWaterNext] = useState(plant ? plant.dateToWaterNext : new Date(new Date().getTime() + MILLIS_IN_DAY));
    const waterPlant = props.waterPlant;

    // state
    const [wateringState, setWateringState] = useState('good');
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        if (!plant) {
            return;
        }
        if (imageURL == '' && userEmail && plant.picture && plant.picture !== '') {
            getDownloadURL(ref(storage, `${userEmail}/${plant.picture}`))
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
        if ((today.getTime() - dateToWaterNext.getTime()) > (3 * MILLIS_IN_DAY)) {
            setWateringState('bad');
            return;
        }
        // CHECK state
        setWateringState('check');
    }, [userEmail, dateToWaterNext, plant, imageURL,]);

    const getBgStyle = () => {
        let sharedStyle = 'border rounded-md p-5 m-2 '
        if (wateringState == 'good')
            return sharedStyle + 'border-yellow';
        if (wateringState == 'check')
            return sharedStyle + 'bg-[#BDC581] text-black border-none';
        if (wateringState == 'bad')
            return 'border border-yellow rounded-md p-5 m-2 bg-red-900';
    }
    const getWtrBtnStyle = () => {
        let sharedStyle = "flex cursor-pointer text-sm px-4 py-2 leading-none border rounded hover:border-transparent hover:text-green hover:bg-yellow mt-4 lg:mt-2 "
        if (wateringState == 'good' || wateringState == 'bad')
            return sharedStyle + "border-yellow text-yellow ";
        if (wateringState == 'check')
            return sharedStyle + "border-black text-black";
    }
    const getIconStyle = () => {
        if (wateringState == 'check')
            return 'text-black';
        return 'text-yellow';
    }

    return plant ? (
        <div key={plant.id} className={getBgStyle()}>
            <div className='flex justify-end'>
                <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} />
            </div>
            {plant.picture && imageURL && imageURL !== '' &&
                <div className='flex justify-start p-1 w-fit rounded'>
                    <div className={borderStyles.magical}>
                        <Image src={imageURL} alt='photo of plant' width={width * 0.7} height={width * 0.8} />
                    </div>
                </div>
            }
            <h1>
                <a className='hover:underline' href={`http://wikipedia.org/wiki/${plant.species.replaceAll(' ', '_')}`}
                    style={{ fontSize: "1.4rem", }}>
                    {plant.species}
                </a>
            </h1>
            {plant.dateObtained &&
                <p style={{ fontSize: "0.7rem", textAlign: "left" }}>
                    had since&nbsp;
                    {plant.dateObtained.toLocaleDateString()}
                </p>
            }
            <div className="flex justify-end">
                <a onClick={() => waterPlant(plant)} className={getWtrBtnStyle()}>
                    <IoWater className="cursor-pointer text-blue" />
                    &nbsp;&nbsp;
                    Water?
                    &nbsp;&nbsp;
                    <IoWater className="cursor-pointer text-blue" />
                </a>
            </div>
            <div className='pt-4'>
                {/* days between watering: {plant.daysBetweenWatering}
            <br></br> */}
                last watered on {plant.dateLastWatered.toLocaleDateString()}
                <br></br>
                water next on {plant.dateToWaterNext.toLocaleDateString()}
                <br></br>
                last fed on {plant.dateLastFed.toLocaleDateString()}
                <br></br>
                feed next on {plant.dateToFeedNext.toLocaleDateString()}
                <br></br>
                <div className='flex justify-evenly'>
                    {plant.lightRequired < 5 ?
                        <IoPartlySunny className={getIconStyle()} />
                        :
                        <IoSunny className={getIconStyle()} />
                    }
                    &nbsp;&nbsp;
                    {plant.lightRequired == 2 && 'Bright indirect light'}
                    {plant.lightRequired == 10 && 'Bright light'}
                    &nbsp;&nbsp;
                    {plant.lightRequired < 5 ?
                        <IoPartlySunny className={getIconStyle()} />
                        :
                        <IoSunny className={getIconStyle()} />
                    }
                </div>
                <br></br>
            </div>
        </div>
    ) :
        <div>

        </div>
}

export default PlantCard