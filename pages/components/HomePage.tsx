import React, { useState } from 'react'
import Container from './BlurredFlowerContainer'
import NavBar2 from './NavBar'
import useAuth from '../../hooks/useAuth'
import MyPlantsCondensed from './MyPlantsCondensed'
import wiggles from "../../styles/wiggle.module.css"
import TextField from './TextField2'
import { IoSearch } from '@react-icons/all-files/io5/IoSearch'
import Link from 'next/link'

const HomePage = () => {
    const { user, dBUser } = useAuth()

    const [searchText, setSearchText] = useState("")

    return (
        <Container dimmed>
            <NavBar2 />
            <h1 className={'inter text-center text-gray-100 text-opacity-70 italic font-extralight text-[40px] pb-4 '}>
                Welcome, {dBUser ? dBUser.displayName.split(' ')[0] : user?.displayName.split(' ')[0]}
            </h1>
            <MyPlantsCondensed />
            <div id="social_condensed"
                className='text-center bg-[#8A9889] bg-opacity-60 backdrop-blur max-w-[960px] m-auto px-24 py-12 my-12 mb-80'
            >
                <h3>
                    You aren&apos;t following anyone yet...
                </h3>

                <Link href="/Social">
                    Explore &rarr;
                </Link>

                {/* <div id="search"
                    className='flex justify-center items-center text-[20px] m-2'
                >
                    <div className='text-left inter w-2/3 min-w-[200px] text-primary text-opacity-70 mt-8'>
                        <label>
                            Search by username/name/email
                        </label>
                        <TextField
                            value={searchText}
                            onChange={setSearchText}
                        />
                    </div>
                    <button id="search_btn"
                        className="px-6 py-3 mt-10 flex items-center text-primary text-md bg-secondary ml-4 rounded-lg "
                    >
                        <IoSearch />
                    </button>
                </div> */}
            </div>
        </Container>
    )
}

export default HomePage