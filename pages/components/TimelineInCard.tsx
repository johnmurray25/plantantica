import { useCallback, useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import ReactLoading from "react-loading"

import storage from '../../firebase/storage';
import Update from '../../domain/Update';
import TimelineItem from './TimelineItem';

interface Props {
    updates: Update[];
    uid: string;
    species: string;
    plantId: string;
    width: number;
    height: number;
}

const TimelineInCard = (props: Props) => {

    const [updates] = useState(props.updates);
    const [height] = useState(props.height)
    const [width] = useState(props.width)
    const [plantId] = useState(props.plantId)
    const [species] = useState(props.species)
    const [uid] = useState(props.uid)

    const [updateItems, setUpdateItems] = useState<JSX.Element[]>([]);

    const timelineItemFromUpdate = useCallback((update: Update) => {
        return (
            <TimelineItem
                key={Math.random()}
                {...{ update, plantId, uid, width, height, species }}
                onDelete={() => {
                    setUpdateItems(updateItems ? updateItems.filter(u => u.key != update.id) : [])
                }}
            />
        )
    }, [height, plantId, species, uid, updateItems, width])

    useEffect(() => {
        if (!updates || !updates.length || (updateItems && updateItems.length)) {
            return;
        }
        setUpdateItems(updates.map((u) => timelineItemFromUpdate(u)))
    }, [timelineItemFromUpdate, updateItems, updates])

    return (
        <div id="timeline" className='w-full'>
            {updateItems?.length > 0 ?
                updateItems
                :
                <p className='text-lg bg-red'>
                    No updates for this plant.
                </p>
            }
        </div>
    );
}

export default TimelineInCard;