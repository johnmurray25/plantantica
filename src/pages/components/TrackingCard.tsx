import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoPartlySunnySharp } from '@react-icons/all-files/io5/IoPartlySunnySharp';
import { IoSunnySharp } from '@react-icons/all-files/io5/IoSunnySharp';
import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { IoLeaf } from '@react-icons/all-files/io5/IoLeaf';
import { getDownloadURL, ref } from 'firebase/storage';

import storage from '../../firebase/storage';
import Plant from '../../../domain/Plant';
import DropDownMenu from './DropDownMenu';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import customImageLoader from '../../util/customImageLoader';
import { User } from 'firebase/auth';

interface Props {
    plant: Plant;
    waterPlant: () => Promise<void>;
    removePlant;
    userID: string;
    feedPlant: () => Promise<void>;
}

const MILLIS_IN_DAY = 86400000;
// const wateringStates = ['good', 'check', 'bad']

const SM_WIDTH = 650; // most phones are less than this width
const MD_WIDTH = 1140;
const LG_WIDTH = 1530; // computers will be larger than this

const PlantCard: FC<Props> = (props) => {

    // dimensions
    const { width, height } = useWindowDimensions();

    // props
    const [userID] = useState(props.userID);
    const [plant, setPlant] = useState(props.plant);
    const [dateToWaterNext] = useState(plant ? plant.dateToWaterNext : new Date(new Date().getTime() + MILLIS_IN_DAY));

    // state
    const [wateringState, setWateringState] = useState('good');
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
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
    }, [userID, dateToWaterNext, plant, imageURL,]);

    const getBgStyle = () => {
        if (!plant) return 'hidden';
        let sharedStyle = width > SM_WIDTH ? 'rounded-md p-0 m-2 ' : 'rounded p-0 '
        if (wateringState == 'good')
            return sharedStyle + ' bg-[#145914] border-[#29bc29] ';
        if (wateringState == 'check')
            return sharedStyle + 'bg-[#BDC581] text-black ';
        if (wateringState == 'bad')
            return 'rounded-md bg-red-900';
    }
    const getWtrBtnStyle = () => {
        let classNames = "flex cursor-pointer text-sm px-4 py-2 leading-none border rounded hover:border-transparent " +
            "hover:text-green hover:bg-yellow mt-4 lg:mt-2 ";
        if (wateringState == 'good' || wateringState == 'bad')
            classNames += " border-yellow text-yellow ";
        else if (wateringState == 'check')
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
        if (wateringState == 'check')
            return 'text-black';
        return 'text-yellow';
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
        <div key={plant.id} className={getBgStyle()}>
            {plant.picture && imageURL && imageURL !== '' ?
                <div className='flex px-0 mx-0 pt-5 pb-0 w-full relative'>
                    <Image
                        src={imageURL}
                        alt={`photo of ${plant.species}`}
                        loader={customImageLoader}
                        loading='lazy'
                        width={imgWidth}
                        height={Math.min(imgHeight, imgWidth)}
                        className='rounded' />
                    <div className="absolute w-full bg-gray-900 text-white italic opacity-70 bottom-0 ">
                        <h1>
                            <a className='hover:underline text-2xl leading-loose pl-2 ' href={`http://wikipedia.org/wiki/${plant.species.replaceAll(' ', '_')}`} >
                                {plant.species}
                            </a>
                        </h1>
                    </div>
                    <div className="absolute w-full flex justify-end pt-2 pr-2 ">
                        <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} />
                    </div>
                </div>
                :
                <div className='relative'>
                    <div className="absolute w-full flex justify-end pt-2 pr-2 ">
                        <DropDownMenu plantId={plant.id} onClickRemove={() => props.removePlant(plant)} />
                    </div>
                    <h1>
                        <a className='hover:underline text-2xl leading-loose pl-2 ' href={`http://wikipedia.org/wiki/${plant.species.replaceAll(' ', '_')}`} >
                            {plant.species}
                        </a>
                    </h1>
                </div>
            }

            <div className="px-5 py-1 ">
                <div className='flex justify-between text-xs '>
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
                    <p>
                        water every {plant.daysBetweenWatering} days
                    </p>
                </div>
                <div className="flex justify-start relative">
                    <a onClick={() => {
                        if (!confirm('Mark as watered today?')) {
                            return;
                        }
                        props.waterPlant().then(() => setWateringState('good'));
                    }}
                        className={getWtrBtnStyle()}>
                        <IoWater className="cursor-pointer text-blue" />
                        &nbsp;&nbsp;
                        Water?
                        &nbsp;&nbsp;
                        <IoWater className="cursor-pointer text-blue" />
                    </a>
                    <div className='pt-4'>
                        last watered {plant.dateLastWatered.toLocaleDateString()}
                        <br></br>
                        <p className={wateringState != 'good' ? 'font-extrabold' : ''}>
                            water next {plant.dateToWaterNext.toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {plant && plant.dateLastFed && plant.dateToFeedNext &&
                    <div className="flex justify-start relative">
                        <a onClick={() => {
                            if (!confirm('Mark as fed today?')) {
                                return;
                            }
                            props.feedPlant()
                                .then(() => plant.dateLastFed = new Date())
                                .catch(console.error);
                        }}
                            className={getWtrBtnStyle()}>
                            <IoLeaf className="cursor-pointer " style={{ color: 'green' }} />
                            &nbsp;&nbsp;
                            Feed?
                            &nbsp;&nbsp;
                            <IoLeaf className="cursor-pointer " style={{ color: 'green' }} />
                        </a>
                        <div className='pt-2'>
                            {`last fed ${plant.dateLastFed.toLocaleDateString()}`}
                            <br></br>
                            {`feed next ${plant.dateToFeedNext.toLocaleDateString()}`}
                        </div>
                    </div>}
            </div>
        </div>)
}

export default PlantCard