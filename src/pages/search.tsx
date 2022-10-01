import Image from 'next/image'
import React, { useState } from 'react'

import ReactLoading from 'react-loading';

import { getImageUrl } from '../service/FileService'
import customImageLoader from '../util/customImageLoader'
import NavBar from './components/NavBar'
import NextHead from './components/NextHead'
import TextField from './components/TextField'
import useWindowDimensions from '../hooks/useWindowDimensions';
import { mapDocToUser, DBUser as User, getUserByUsername } from '../service/UserService';
import { useRouter } from 'next/router';

const Home: React.FC = () => {

    const [searchText, setSearchText] = useState('')
    const [searchMessage, setSearchMessage] = useState('')
    const [searchResult, setSearchResult] = useState<User>(null)
    const [profPicUrl, setProfPicUrl] = useState('')
    const [isProfPicLoading, setIsProfPicLoading] = useState(false)

    const router = useRouter()
    const { width, height } = useWindowDimensions()

    const searchUsers = async () => {
        if (!searchText) {
            return;
        }
        let docSnap = await getUserByUsername(searchText)
        if (docSnap.exists()) {
            console.log(`username ${searchText} found in system`)
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

            <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto'>

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
                        <div
                            className='flex justify-evenly items-center cursor-pointer'
                            onClick={() => {
                                if (searchResult.username) 
                                    router.push(`users/${searchResult.username}`)
                            }}
                        >
                            <p>
                                <a className='text-2xl'>
                                    {searchResult.displayName} <br />
                                </a>
                                <a className='text-xl'>
                                    @{searchResult.username} <br />
                                </a>
                            </p>
                            <div>
                                {profPicUrl &&
                                    // User has saved profile picture
                                    isProfPicLoading ?
                                    <ReactLoading type='spinningBubbles' color="#fff" />
                                    :
                                    <Image
                                        src={profPicUrl ? profPicUrl : 'https://icongr.am/clarity/avatar.svg?size=128&color=ffffff'}
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