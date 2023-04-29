import React from 'react'
import Container from '../util/Container'
import NavBar2 from '../util/NavBar'
import useAuth from '../../../hooks/useAuth'
import MyPlantsCondensed from './MyPlantsCondensed'

const HomePage = () => {
    const { user, dBUser } = useAuth()

    return (
        <Container dimmed>
            <NavBar2 />
            {/* <h1 className={'inter text-center text-gray-100 text-opacity-80 italic font-light text-[40px] pb-4 mt-6'}>
                Welcome, {dBUser ? dBUser.displayName.split(' ')[0] : user?.displayName.split(' ')[0]}
            </h1> */}
            <MyPlantsCondensed />
            {/* <div id="social_condensed"
                className='text-center bg-[#8A9889] bg-opacity-60 backdrop-blur max-w-[600px] m-auto px-24 py-12 my-12 mb-80'
            >
                <h3>
                    You aren&apos;t following anyone yet...
                </h3>

                <Link href="/social" passHref>
                    <div className='pt-10 text-3xl inter italic'>
                        Explore &rarr;
                    </div>
                </Link>
            </div> */}
        </Container>
    )
}

export default HomePage