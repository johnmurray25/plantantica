import React, { useCallback, useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { deleteUpdateForPlant, Update } from '../../service/PlantService';
import ImageInTimeline from './ImageInTimeline';
import { getDownloadURL, ref } from 'firebase/storage';
import storage from '../../firebase/storage';

interface Props {
    updates: Update[];
    uid: string;
    species: string;
    width: number;
    height: number;
    plantId: string;
}

const TimelineInCard: React.FC<Props> = (props) => {

    const [updateItems, setUpdateItems] = React.useState<JSX.Element[]>(null);

    const timelineItemFromUpdate = useCallback(async (update: Update) => {
        console.log(`uid: ${props.uid}\nupdate.image: ${update.image}`)
        const imageUrl = update && update.image ? await getDownloadURL(ref(storage, `${props.uid}/${update.image}`)) : "";
        return (
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body1"
                >
                    {update && update.dateCreated && update.dateCreated.toLocaleDateString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                        {update && update.image &&
                            <ImageInTimeline
                                imageURL={imageUrl}
                                width={props.width}
                                height={Math.min(props.height, props.width)}
                                species={props.species}
                            />
                        }
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        {update.title}
                    </Typography>
                    <Typography>{update.description}</Typography>
                    <Typography className="text-right -translate-y-10 translate-x-3 flex justify-end ">
                        <div
                            className="text-red-900 p-2 cursor-pointer w-fit"
                            onClick={() => {
                                if (!confirm("Delete this update?")) {
                                    return;
                                }
                                deleteUpdateForPlant(props.uid, props.plantId, update.id);
                            }}
                        >
                            X
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        )
    }, [props.height, props.plantId, props.species, props.uid, props.width])

    useEffect(() => {
        if (!props.updates || !props.updates.length) {
            return;
        }
        let promises = props.updates
            .map((u) => {
                return timelineItemFromUpdate(u)
            });
        Promise.all(promises)
            .then(setUpdateItems)
            .catch(console.error);
    }, [props.updates, timelineItemFromUpdate])

    return (
        <Timeline position="alternate">
            {updateItems && updateItems}
        </Timeline>
    );
}

export default TimelineInCard;