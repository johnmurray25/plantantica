import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';

import ReactLoading from 'react-loading'

import NavBar from '../components/NavBar';
import customImageLoader from '../../util/customImageLoader';
import { getProfilePictureUrl } from '../../service/FileService';
import { useRouter } from 'next/router';
import { getUserDBRecord, getUserByUsername } from '../../service/UserService';
import Plant from '../../domain/Plant';
import DisplayCard from '../components/DisplayCard'
import gridStyles from '../../styles/smallGrid.module.css'
import DBUser from '../../domain/DBUser';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase/auth';

function Home() {

    const [currentUser, loading] = useAuthState(auth) // Current logged in user
    const [user, setUser] = useState<DBUser>(null) // Data in DB [username]
    const [uid, setUid] = useState('')
    const [trackingMsg, setTrackingMsg] = useState('');
    const [profPicUrl, setProfPicUrl] = useState('https://icongr.am/clarity/avatar.svg?size=128&color=ffffff')
    const [isProfPicLoading, setIsProfPicLoading] = useState(false);
    const [plants, setPlants] = useState<Plant[]>([])
    const [plantCards, setPlantCards] = useState<JSX.Element[]>([])

    // const { width, height } = useWindowDimensions()
    const router = useRouter()

    const { username } = router.query;

    useEffect(() => {

        // get user by username
        let usrNm = !username ? ''
            : typeof username == 'string'
                ? username
                : username[0]
        getUserByUsername(usrNm)
            .then(doc => {
                if (!doc) return

                // load user data
                setUid(doc.id)
                getUserDBRecord(doc.id)
                    .then(record => {
                        if (!record) {
                            console.error(`Could not find record for username ${username}`)
                            return
                        }

                        setUser(record)
                        let ptd = record.plantTrackingDetails
                        if (ptd) {
                            if (ptd.length == 1)
                                setTrackingMsg(`Tracking ${record.plantTrackingDetails ? record.plantTrackingDetails.length : 0} plant:`)
                            else
                                setTrackingMsg(`Tracking ${record.plantTrackingDetails ? record.plantTrackingDetails.length : 0} plants:`)
                        } else {
                            setTrackingMsg('Tracking 0 plants')
                        }

                        // load profile picture
                        if (record.profilePicture) {
                            // console.log(`prof pic: ${record.profilePicture}`)
                            setIsProfPicLoading(true);
                            getProfilePictureUrl(doc.id)
                                .then(data => setProfPicUrl(data.url))
                                .finally(() => setIsProfPicLoading(false))
                        }

                        // load plants
                        if (record.plantTrackingDetails
                            && record.plantTrackingDetails.length > 0) {
                            setPlants(record.plantTrackingDetails)
                            console.log(record.plantTrackingDetails)
                            setPlantCards(record.plantTrackingDetails.map(p =>
                                <DisplayCard
                                    plant={p}
                                    userID={uid}
                                    key={p.id}
                                />
                            ))
                        }
                    })
            })
            .catch(console.error)

    }, [profPicUrl, username, uid]);

    return (
        <div className='bg-green text-yellow min-h-screen text-left'>
            <NavBar />
            {
                user &&
                <div>
                    <div className='relative w-full med:w-3/6 m-auto text-center justify-center pt-28 px-6 med:border border-yellow rounded '>
                        {profPicUrl && profPicUrl != '' &&
                            isProfPicLoading ?
                            <div className='relative w-fit flex justify-center m-auto border rounded-xl p-3'>
                                <ReactLoading type='spinningBubbles' color="#fff" />
                            </div>
                            :
                            <div className='relative w-fit flex justify-center m-auto bg-[#473432] rounded-xl p-3'>
                                <Image
                                    src={profPicUrl}
                                    loader={customImageLoader}
                                    alt='Profile picture'
                                    width={100}
                                    height={120}
                                />
                            </div>
                        }
                        <div className='mx-10 mb-3 flex justify-evenly items-center' >
                            {/* display name */}
                            <h2 className='text-2xl' >
                                {user ? user.displayName : ''}
                            </h2>
                            {/* username */}
                            <h3 className='p-5 pt-0 flex justify-evenly items-center text-xl'>
                                <p className='font-bold p-3 pr-10 pl-2 rounded-lg m-2 ml-0'>
                                    {user ? `@${user.username}` : ''}
                                </p>
                            </h3>
                        </div>

                        {/* <h3 className='text-lg flex justify-evenly'>
                            <p className='italic'>
                                {user ? user.email : ''}
                            </p>
                        </h3> */}
                        <h3 className='pt-0 font-mono text-left pb-2'>
                            {/* number of plants tracked */}
                            {trackingMsg}
                        </h3>
                    </div>
                    {plants && plants.length > 0 &&
                        <div
                            className={gridStyles.container}
                        >
                            {plantCards}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Home;