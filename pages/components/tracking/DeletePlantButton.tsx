import { IoTrash } from '@react-icons/all-files/io5/IoTrash';
import React from 'react'

const DeletePlantButton = (props: {
    deletePlant;
    setHidden;
    plant;
}) => {

    const { deletePlant, setHidden, plant } = props;

    return (
        <button
            className="bg-gray-100 bg-opacity-20 border-[1px]  border-gray-900 border-opacity-60 rounded p-1 px-3
                                    ml-4 hover:bg-gray-100 hover:bg-opacity-70 transition-colors"
            onClick={() => {
                if (!confirm(`Delete ${plant.species}?`)) {
                    return;
                }
                deletePlant(plant)
                setHidden(true)
            }}
        >
            {/* Delete */}
            <IoTrash />
        </button>
    )
}

export default DeletePlantButton