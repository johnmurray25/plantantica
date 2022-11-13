import Image from 'next/image'
import React from 'react'
import customImageLoader from '../../util/customImageLoader'

interface Props {
    imageURL: string;
    species: string;
    width: number;
    height: number;
}

const ImageInTimeline: React.FC<Props> = (props) => {
    return (
        <Image
            src={props.imageURL}
            alt={`photo of ${props.species}`}
            loader={customImageLoader}
            loading='lazy'
            width={props.width}
            height={props.height}
            className='rounded-3xl'
        />
    )
}

export default ImageInTimeline