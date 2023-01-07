import React from 'react'

const Container = (props) => {
    return (
        <div className='bg-fixed max-w-screen h-auto bg-no-repeat bg-cover bg-top bg-flowers bg-[#A0A6A0]  '
        // style={{background: 'linear-gradient(90deg, rgba(149,159,152,1) 0%, rgba(144,150,140,1) 28%, rgba(165,169,142,1) 100%)'}}
        >
            <div className={`w-screen min-h-screen h-full bg-[#143326] ${props?.dimmed ? "bg-opacity-30" : "bg-opacity-20"}`}>
                {props.children}
            </div>
        </div>
    )
}

export default Container