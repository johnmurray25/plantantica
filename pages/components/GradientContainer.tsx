import React from 'react'

const GradientContainer = (props) => {
    return (
        <div className='bg-fixed max-w-screen h-auto'
            style={{ background: 'linear-gradient(90deg, rgba(165,169,142,1) 0%, rgba(144,150,140,1) 28%, rgba(149,159,152,1) 100%)' }}
        >
            <div className={`w-screen min-h-screen h-full bg-[#143326] ${props?.dimmed ? "bg-opacity-30" : "bg-opacity-20"}`}>
                {props.children}
            </div>
        </div>
    )
}

export default GradientContainer