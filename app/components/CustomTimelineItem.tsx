import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react'
import Update from '../../domain/Update';
import { deleteUpdateForPlant } from '../../service/PlantService';
import ImageInTimeline from './ImageInTimeline';

interface Props {
    update: Update;
    plantId: string;
    uid: string;
    width: number;
    height: number;
    species: string;
    imageUrl: string;
    onDelete: () => void;
}

const CustomTimelineItem: React.FC<Props> = (props) => {
    const update = props.update;
    const plantId = props.plantId;
    const uid = props.uid;
    const width = props.width;
    const height = props.height;
    const species = props.species;
    const imageUrl = props.imageUrl;

    const [zoomImage, setZoomImage] = useState(false);
    const toggleZoomImage = () => { setZoomImage(!zoomImage) }

    return (
        <>
            <TimelineItem key={update ? update.id : Math.random()}>
                <TimelineOppositeContent
                    sx={{ m: 'auto 0', px: "0px", }}
                    align="right"
                // variant="body1"
                >
                    {update && update.dateCreated && update.dateCreated.toUTCString().substring(0, 17)}
                    <a
                        className="flex w-fit justify-end items-center text-red-900 border border-red-900 rounded text-sm p-1 cursor-pointer "
                        onClick={() => {
                            if (!confirm("Delete this update?")) {
                                return;
                            }
                            deleteUpdateForPlant(uid, plantId, update.id);
                            props.onDelete();
                        }}
                    >
                        x
                    </a>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot sx={{
                        width, height,
                        backgroundColor: "inherit", boxShadow: "none",
                    }}>
                        {update && update.image && imageUrl &&
                            <div
                                className='flex justify-center items-center m-auto cursor-pointer '
                                onClick={toggleZoomImage}
                            >
                                <ImageInTimeline
                                    imageURL={imageUrl}
                                    width={width}
                                    height={height}
                                    species={species}
                                />
                                <div className={`absolute ${!zoomImage && 'hidden'} m-auto p-2
                                    flex justify-center items-center bg-gray-900`}
                                    style={{ width: '100vw', height: '100vh', zIndex: 1000 }}
                                >
                                    <Image
                                        src={imageUrl}
                                        loading='lazy'
                                        layout='fill'
                                        unoptimized
                                        alt={`photo of ${species}`}
                                    />
                                </div>
                            </div>
                        }
                    </TimelineDot>
                    <TimelineConnector color='black' />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: "0px", width: "100%", }}>
                    <Typography variant="h6" component="span" sx={{ px: "0px" }}>
                        {update && update.title}
                    </Typography>
                    <Typography>
                        {update && update.description}
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        </>
    )
}

export default CustomTimelineItem