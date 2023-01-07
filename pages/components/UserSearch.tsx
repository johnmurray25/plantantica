import { IoSearch } from '@react-icons/all-files/io5/IoSearch'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import DBUser from '../../domain/DBUser'
import useAuth from '../../hooks/useAuth'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { docToUser } from '../../service/DBMappings'
import { getUserByUsername } from '../../service/UserService'
import TextField from './TextField2'

const UserSearch = () => {

    const { user } = useAuth()
    const [searchText, setSearchText] = useState('')
    const [searchActive, setSearchActive] = useState(false)
    const [searchMessage, setSearchMessage] = useState('')
    const [searchResult, setSearchResult] = useState<DBUser>(null)
    const [profPicUrl, setProfPicUrl] = useState('')

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
                const result = docToUser(docSnap)
                setSearchResult(result)
                setSearchMessage('')
                if (result.profPicUrl) {
                    setProfPicUrl(result.profPicUrl)
                }
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

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [user, handleKeyPress, searchUsers])

    return (
        <>
            {/* Search bar */}
            <div id="search"
                    className='flex justify-center items-center text-[20px] m-2 bg-secondary pb-12 bg-opacity-70'
                >
                    <div className='text-left inter w-2/3 min-w-[200px] text-primary text-opacity-90 mt-8'>
                        <label>
                            Search by username/name/email
                        </label>
                        <TextField
                            value={searchText}
                            onChange={setSearchText}
                        />
                    </div>
                    <button id="search_btn"
                        className="px-6 py-3 mt-14 flex items-center text-primary text-md bg-secondary ml-4 rounded-lg "
                    >
                        <IoSearch />
                    </button>
                </div>

            {searchActive && searchResult &&
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
                                <Image
                                    src={profPicUrl ? profPicUrl : 'https://icongr.am/clarity/avatar.svg?size=128&color=ffffff'}
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
        </>
    )
}

export default UserSearch