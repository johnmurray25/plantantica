import React, { useContext, useEffect } from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import Container from './Container'
import NavBar2 from './NavBar2'
import useAuth from '../../hooks/useAuth'
import MyPlantsCondensed from './MyPlantsCondensed'
import PlantContext from '../../context/PlantContext'

const HomePage = () => {

    const { width } = useWindowDimensions()

    const { user, dBUser } = useAuth()
    const { plants, setPlants } = useContext(PlantContext)

    useEffect(() => {

    }, [])

    return (
        <Container dimmed>
            <NavBar2 />
            <h1 className='text-center font-extralight text-[40px] pb-8'>
                Welcome, {dBUser ? dBUser.displayName.split(' ')[0] : user?.displayName.split(' ')[0]}
            </h1>
            <MyPlantsCondensed />
        </Container>
    )
}

export default HomePage