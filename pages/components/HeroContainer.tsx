import React from 'react'

const HeroContainer = ({ children }) => {
    return (
        <div className='w-screen min-h-screen bg-no-repeat bg-contain bg-flowers bg-[#A0A6A0] //bg-opacity-50 object-top'>
            <div className='w-screen min-h-screen h-fit bg-[#143326] bg-opacity-20'>
                {children}
            </div>
        </div>
    )
}

export default HeroContainer