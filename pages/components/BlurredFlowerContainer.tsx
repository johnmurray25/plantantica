import React from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'

const Container = (props) => {
    const { width } = useWindowDimensions()

    return (
        <div className={`bg-fixed max-w-screen h-full min-h-screen bg-no-repeat bg-cover pb-20
                ${width <= 650 ? "bg-flowersPortrait" : "bg-flowers"} `}
        >
            <div className={`backdrop-blur w-screen min-h-screen h-full bg-primary bg-opacity-40 //bg-[#143326]bg-opacity-20} pb-20`}>
                {props.children}
            </div>
        </div>
    )
}

export default Container