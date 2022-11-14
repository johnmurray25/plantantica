"use client"
import React, { useCallback, useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import { getDownloadURL, ref } from 'firebase/storage';
import storage from '../../firebase/storage';
import Update from '../../domain/Update';
import CustomTimelineItem from './CustomTimelineItem';

interface Props {
    updates: Update[];
    uid: string;
    species: string;
    plantId: string;
    width: number;
    height: number;
}

const TimelineInCard: React.FC<Props> = (props) => {

    const [updates] = useState(props.updates);
    const [height] = useState(props.height)
    const [width] = useState(props.width)
    const [plantId] = useState(props.plantId)
    const [species] = useState(props.species)
    const [uid] = useState(props.uid)

    console.log('updates')
    console.log(updates)

    const [updateItems, setUpdateItems] = useState<JSX.Element[]>([]);

    const timelineItemFromUpdate = useCallback(async (update: Update, updateItems: JSX.Element[]) => {
        const imageUrl = update && update.image ? await getDownloadURL(ref(storage, `${uid}/${update.image}`)) : "";
        return (
            <CustomTimelineItem
                key={update?.id}
                {...{ update, plantId, uid, width, height, species, imageUrl }}
                onDelete={() => {
                    setUpdateItems(updateItems ? updateItems.filter(u => u.key != update.id) : [])
                }}
            />
        )
    }, [height, plantId, species, uid, width])

    useEffect(() => {
        if (!updates || !updates.length || (updateItems && updateItems.length)) {
            return;
        }
        let promises = updates.map((u) => timelineItemFromUpdate(u, updateItems))
        Promise.all(promises)
            .then(setUpdateItems)
            .catch(console.error)
    }, [timelineItemFromUpdate, updateItems, updates])

    return (
        <Timeline position="right" sx={{ padding: "0px" }}>
            {updateItems}
        </Timeline>
    );
}

export default TimelineInCard;