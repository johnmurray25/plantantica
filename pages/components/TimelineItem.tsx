import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import { deleteDoc, doc } from 'firebase/firestore';
import Update from '../../domain/Update';
import db from '../../firebase/db';
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
    imageUrl: string;
    onDelete: () => void;
}

const CustomTimelineItem = (props: Props) => {
    const { update, plantId, uid, species, imageUrl } = props;

    return (
        <div className='w-full border border-t-0 border-x-0 border-stone-800 pb-3 mb-4'>
            <div className='flex justify-between pb-2'>
                <div>
                    {update?.dateCreated?.toUTCString().substring(0, 17)}
                </div>
                <a
                    className="text-red-800 hover:text-stone-100 border border-red-800 hover:bg-red-700 rounded-full text-sm p-1 px-2 cursor-pointer "
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
                {update && update.image && imageUrl &&
                    <ImageInTimeline
                        height={250}
                        {...{ species }}
                        src={imageUrl}
                        width={250}
                    />
                }
            </div>
            <div>
                <h1 className='font-bold pt-1 text-center'>
                    {update?.title}
                </h1>
                <br />
                {update?.description}
            </div>
        </div>
    )
}

export default CustomTimelineItem