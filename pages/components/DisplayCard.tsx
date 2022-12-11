import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoWater } from '@react-icons/all-files/io5/IoWater';
import { getDownloadURL, ref } from 'firebase/storage';

import storage from '../../firebase/storage';
import Plant from '../../domain/Plant';
import useWindowDimensions from '../../hooks/useWindowDimensions';

interface Props {
    plant: Plant;
    userID: string;
}

// const MILLIS_IN_DAY = 86400000;
// const wateringStates = ['good', 'check', 'bad']

const SM_WIDTH = 650; // most phones are less than this width
const MD_WIDTH = 1140;
const LG_WIDTH = 1530; // computers will be larger than this

const PlantCard: FC<Props> = (props) => {

    // dimensions
    const { width, height } = useWindowDimensions();

    // props
    const [plant, setPlant] = useState(props.plant);
    // const [dateToWaterNext] = useState(plant ? plant.dateToWaterNext : new Date(new Date().getTime() + MILLIS_IN_DAY));

    // state
    const [wateringState, setWateringState] = useState('good');
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        if (!plant) return;
        let uid = props.userID;
        if (imageURL == '' && uid && plant.picture && plant.picture !== '') {
            // console.log('getting download url...')
            getDownloadURL(ref(storage, `${uid}/${plant.picture}`))
                .then(downloadUrl => setImageURL(downloadUrl))
                .catch(console.error);
        }
    });

    const getBgStyle = () => {
        if (!plant) return 'hidden';
        return (width > SM_WIDTH ? 'rounded-md p-0 m-2 ' : 'rounded p-0 ') + ' w-full '
    }

    const getImageWidth = () => {
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
    }

    const getImageHeight = () => {
        if (!width) return 500;
        if (width <= SM_WIDTH) return width * 1.2;
        return height / 2;
    }

    return plant && (
        <div key={plant.id} className={getBgStyle() + " bg-[#286314] "}>
            {plant.picture && imageURL && imageURL !== '' ?
                <div className=' px-0 mx-0 pb-0 w-full relative'>
                    <Image
                        src={imageURL}
                        alt={`photo of ${plant.species}`}
                        loading='lazy'
                        width={getImageWidth()}
                        height={Math.min(getImageHeight(), getImageWidth())}
                        className='rounded' />
                    {/* <div className="absolute w-full bg-gray-900 text-stone-100 italic opacity-70 bottom-0 "> */}
                        <h1>
                            <a className='text-lg med:text-xl pl-2 ' >
                                {plant.species}
                            </a>
                        </h1>
                    {/* </div> */}
                </div>
                :
                <div className='relative'>
                    <h1>
                        <a className='text-2xl leading-loose pl-2 ' >
                            {plant.species}
                        </a>
                    </h1>
                </div>
            }

            <div className="px-1 py-1 ">
                <div className='flex justify-between text-xs '>
                    <div className='flex text-base'>
                        <IoWater className="cursor-pointer text-blue-400 pr-1" />
                        <p className='text-xs'>
                            every {plant.daysBetweenWatering} days
                        </p>
                    </div>
                    {plant.dateObtained &&
                        <p>
                            had since {plant.dateObtained.toLocaleDateString()}
                        </p>
                    }
                </div>
            </div>
        </div>)
}

export default PlantCard