import Image from 'next/image'
import React, { useState } from 'react'

import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import ReactLoading from 'react-loading';

import Plant from '../../domain/Plant'
import { getImageUrl } from '../service/FileService'
import db from '../firebase/db'
import customImageLoader from '../util/customImageLoader'
import NavBar from './components/NavBar'
import NextHead from './components/NextHead'
import TextField from './components/TextField'
import useWindowDimensions from '../hooks/useWindowDimensions';
import { getUserByUid, mapDocToUser, DBUser as User, getUserByUsername } from '../service/UserService';

const Home: React.FC = () => {

    const [searchText, setSearchText] = useState('')
    const [searchMessage, setSearchMessage] = useState('')
    const [searchResult, setSearchResult] = useState<User>(null)
    const [profPicUrl, setProfPicUrl] = useState('')
    const [isProfPicLoading, setIsProfPicLoading] = useState(false)

    const { width, height } = useWindowDimensions()

    const searchUsers = async () => {
        if (!searchText) {
            return;
        }
        let docSnap = await getUserByUsername(searchText)
        if (docSnap.exists()) {
            console.log(`email ${searchText} found in system`)
            let result = await mapDocToUser(docSnap);
            setSearchResult(result)
            setSearchMessage('')
            if (result.profilePicture) {
                setIsProfPicLoading(true)
                try {
                    let url = await getImageUrl(result.profilePicture, docSnap.id)
                    setProfPicUrl(url)
                }
                catch (e) {
                    console.error(e)
                }
                finally {
                    setIsProfPicLoading(false)
                }
            }
        }
        else {
            setSearchResult(null)
            setSearchMessage('No results found.')
        }
    } // End searchUsers

    return (
        <div className='text-yellow bg-green min-w-full' /**Container */>
            <NextHead /**Header */ />
            <NavBar />

            <div className='min-h-screen p-4 flex flex-col items-center m-auto'>

                <p className='pb-8 text-center'>
                    This page isn&apos;t ready yet... check back later :-{')'}
                </p>

                <div className='flex w-full justify-center'>
                    <TextField
                        name="search"
                        type="text"
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Search by username..."
                        width={80}
                    />
                    <a
                        className='cursor-pointer bg-[#53984D] text-yellow rounded justify-center h-12 w-8 text-center content-center'
                        onClick={searchUsers}
                    >
                        &rarr;
                    </a>
                </div>

                {searchMessage &&
                    <div className='flex justify-evenly items-center m-10'>
                        <p>
                            {searchMessage}
                        </p>
                    </div>
                }

                {searchResult &&
                    <div className='border border-yellow rounded w-full py-4 px-2'>
                        <div className='flex justify-evenly items-center '>
                            <p>
                                {searchResult.email}
                            </p>
                            <div>
                                {profPicUrl &&
                                    // User has saved profile picture
                                    isProfPicLoading ?
                                    <ReactLoading type='spinningBubbles' color="#fff" />
                                    :
                                    <Image
                                        src={profPicUrl}
                                        loader={customImageLoader}
                                        // alt='Profile picture'
                                        alt=''
                                        width={height ? height / 14 : 40}
                                        height={height ? height / 13 : 40}
                                        className='rounded-3xl'
                                    />
                                }
                            </div>
                        </div>
                        <p className='text-center'>
                            Tracking {searchResult.plantTrackingDetails ? searchResult.plantTrackingDetails.length : 0} plants
                        </p>
                    </div>
                }


            </div>

        </div >
    )
}

export default Home