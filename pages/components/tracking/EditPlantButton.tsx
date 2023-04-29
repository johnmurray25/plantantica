import { IoPencilOutline } from '@react-icons/all-files/io5/IoPencilOutline';
import React from 'react'

const EditPlantButton = (props: {
    goToEditScreen;
    plant;
}) => {

    const {goToEditScreen, plant} = props;

    return (
        <button
            className="bg-gray-100 bg-opacity-20 border-[1px] border-gray-900 border-opacity-60 rounded p-1 px-3
                                    hover:bg-gray-200 hover:border-gray-200  hover:text-gray-700 transition-colors"
            onClick={() => goToEditScreen(plant?.id)}
        >
            Edit
            {/* <IoPencilOutline /> */}
        </button>
    )
}

export default EditPlantButton