import React from 'react'
import ReactLoading from "react-loading"

import Container from './BlurredFlowerContainer'
import NavBar from './NavBar'

const LoadingScreen = () => {
    return (
        <Container dimmed>
            <NavBar />
            <div className='flex justify-center'>
                {/* <ReactLoading type="bars" /> */}
            </div>
        </Container>
    )
}

export default LoadingScreen