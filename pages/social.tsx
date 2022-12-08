import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

import ReactLoading from 'react-loading';

import { getImageUrl } from '../service/FileService'
import customImageLoader from '../util/customImageLoader'
import NavBar from './components/NavBar'
import TextField from './components/TextField'
import useWindowDimensions from '../hooks/useWindowDimensions';
import { mapDocToUser, getUserByUsername } from '../service/UserService';
import { useRouter } from 'next/router';
import DBUser from '../domain/DBUser';
import useAuth from '../hooks/useAuth';

const Home: React.FC = () => {

    const { user } = useAuth()
    const [searchText, setSearchText] = useState('')
    const [searchActive, setSearchActive] = useState(false)
    const [searchMessage, setSearchMessage] = useState('')
    const [searchResult, setSearchResult] = useState<DBUser>(null)
    const [profPicUrl, setProfPicUrl] = useState('')
    const [isProfPicLoading, setIsProfPicLoading] = useState(false)
    const [following, setFollowing] = useState<DBUser[]>([])

    const router = useRouter()
    const { height } = useWindowDimensions()

    const searchUsers = useCallback(() => {
        if (!searchText) {
            return;
        }
        setSearchActive(true)
        getUserByUsername(searchText)
            .then(docSnap => {
                if (!docSnap || !docSnap.exists()) {
                    setSearchResult(null)
                    setSearchMessage('No results found.')
                }
                mapDocToUser(docSnap)
                    .then(result => {
                        setSearchResult(result)
                        setSearchMessage('')
                        if (result.profilePicture) {
                            setIsProfPicLoading(true)
                            getImageUrl(result.profilePicture, docSnap.id)
                                .then(setProfPicUrl)
                                .catch(console.error)
                                .finally(() => setIsProfPicLoading(false));
                        }
                    })
                    .catch(console.error);
            }).catch(e => {
                console.error(e)
                setSearchActive(false)
            })
    }, [searchText]) // End searchUsers

    const handleKeyPress = useCallback((e: { key: any; }) => {
        const key = e.key;
        if (key === 'Enter') {
            searchUsers()
        }
    }, [searchUsers]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)

        // if (user && (!following || !following.length)) {
        //     getFollowingList(user.uid)
        //         .then(res => {
        //             setFollowing(res)
        //             console.log(res)
        //         })
        //         .catch(console.error);
        // }

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [user, following, handleKeyPress, searchUsers])

    return (
        <div className='text-stone-200 bg-green min-w-full' /**Container */>
            <NavBar />

            <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto'>

                {/* Search bar */}
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
                        className='cursor-pointer bg-[#53984D] text-stone-200 rounded justify-center h-12 w-8 text-center content-center'
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

                {searchActive ?
                    searchResult &&
                    <div className='rounded w-fit py-4 px-8 med:px-20 bg-[#473432]'>
                        <div
                            className='flex justify-between items-center cursor-pointer'
                            onClick={() => {
                                if (searchResult.username)
                                    router.push(`users/${searchResult.username}`)
                            }}
                        >
                            <p className='px-4'>
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
                    :
                    user &&
                    <div>
                        {/* <h1>Who you&apos;re following</h1> */}
                        {following
                            .map(u =>
                                <div key={u.username}>
                                    {u.username}
                                </div>
                            )
                        }
                    </div>
                }


            </div>

        </div >
    )
}

export default Home