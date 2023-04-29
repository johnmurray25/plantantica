import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import { deleteDoc, doc } from 'firebase/firestore';
import Update from '../../../domain/Update';
import db from '../../../firebase/db';
// import { deleteUpdateForPlant } from '../../service/PlantService';
import ImageInTimeline from './ImageInTimeline';

const deleteUpdateForPlant = (uid: string, plantId: string, updateId: string) => {
    const docRef = doc(db, `users/${uid}/plantTrackingDetails/${plantId}/updates/${updateId}`);
    deleteDoc(docRef);
}

interface Props {
    update: Update;
    plantId: string;
    uid: string;
    species: string;
    onDelete: () => void;
}

const CustomTimelineItem = (props: Props) => {
    const { update, plantId, uid, species } = props;

    return update && (
        <div className='text-gray-900 relative w-full border border-t-0 border-x-0 border-gray-800 pb-3 mb-4 pr-4 pt-2'>
            <div className='flex justify-end pb-2'>
                <a
                    className=" border-[0.5px] border-black rounded text-sm p-1 px-2 cursor-pointer "
                    onClick={() => {
                        if (!confirm("Delete this update?")) {
                            return;
                        }
                        deleteUpdateForPlant(uid, plantId, update.id);
                        props.onDelete();
                    }}
                >
                    <IoTrash />
                </a>
            </div>
            <div className='text-center'>
                {update.imageUrl &&
                    <ImageInTimeline
                        height={250}
                        {...{ species }}
                        src={update.imageUrl}
                        width={250}
                    />
                }
            </div>
            <div className='text-right'>
                {update.dateCreated?.toUTCString().substring(0, 17)}
            </div>
            <div className='text-left'>
                <h1 className='text-center font-bold py-4 text-lg'>
                    {update.title}
                </h1>
                {update.description}
            </div>
        </div>
    )
}

export default CustomTimelineItem