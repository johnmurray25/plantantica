import React from 'react'

const FeedButton = (props: {
    feedPlant;
}) => {

    const { feedPlant } = props;

    return (
        <button
            onClick={() => {
                if (!confirm('Mark as fed today?')) {
                    return;
                }
                feedPlant()
            }}
            className='bg-gray-100 bg-opacity-30 border-[0.5px] border-gray-900 flex items-center hover:bg-gray-100 hover:bg-opacity-70 transition-colors 
                            cursor-pointer rounded h-8 justify-center w-20'
        >
            Fertilize
            {/* <IoLeafOutline className='cursor-pointer text-xl' /> */}
        </button>
    )
}

export default FeedButton