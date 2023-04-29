import React from 'react'
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import MobileBottomNavBar from "./MobileBottomNavBar";

const Container = (props) => {
    const { width } = useWindowDimensions()

    return (
        <div className={`bg-fixed max-w-screen h-full min-h-screen bg-no-repeat bg-cover pb-20
                //${width <= 650 ? "bg-flowersPortrait" : "bg-flowers"} `}
        >
            <MobileBottomNavBar /> 
            <div className={`fixed bottom-0 backdrop-blur w-screen h-screen overflow-scroll bg-lightbg //bg-[#a7b194] dark:bg-[#0A0E03] pb-20`}>
                {props.children}
            </div>
        </div>
    )
}

export default Container