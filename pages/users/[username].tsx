import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import ReactLoading from 'react-loading'

import NavBar from '../components/NavBar';
import { getProfilePictureUrl } from '../../service/FileService';
import { useRouter } from 'next/router';
import { getUserDBRecord, getUserByUsername } from '../../service/UserService';
import Plant from '../../domain/Plant';
import DisplayCard from '../components/DisplayCard'
import gridStyles from '../../styles/smallGrid.module.css'
import DBUser from '../../domain/DBUser';
import { getPlants } from '../../service/PlantService';
import Container from '../components/BlurredFlowerContainer';

function Home() {

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

                        getPlants(doc.id)
                            .then(ptd => {
                                setUser({
                                    ...record,
                                    plantTrackingDetails: ptd
                                })
                                if (ptd?.length == 1) {
                                    setTrackingMsg(`Tracking 1 plant:`)
                                }
                                else {
                                    setTrackingMsg(`Tracking ${ptd?.length || 0} plants:`)
                                }
                                setPlants(ptd)
                                setPlantCards(ptd?.map(p =>
                                    <DisplayCard
                                        plant={p}
                                        userID={uid}
                                        key={p.id}
                                    />
                                ))
                            })

                        // load profile picture
                        if (record.profilePicture) {
                            // console.log(`prof pic: ${record.profilePicture}`)
                            setIsProfPicLoading(true);
                            getProfilePictureUrl(doc.id)
                                .then(data => setProfPicUrl(data.url))
                                .finally(() => setIsProfPicLoading(false))
                        }

                    })
            })
            .catch(console.error)

    }, [profPicUrl, username, uid]);

    return (
        <div className='min-h-screen h-full w-full bg-[#0E1402]'>
            {user &&
                <div className=''>
                    <NavBar />
                    <div className='relative sm:w-3/6 text-center pb-14 px-6  m-auto //max-w-[375px]'>

                        <div className="flex justify-start">
                            {profPicUrl ?
                                <div className='rounded-full h-32 w-32 border-2 border-gray-100 relative'>
                                    <Image
                                        src={profPicUrl}
                                        alt='Profile picture'
                                        fill
                                        className="object-cover object-center rounded-full"
                                    />
                                </div>
                                :
                                <div className='relative m-auto h-32 w-32 rounded-3xl bg-stone-100 '>

                                </div>
                            }
                            <div className='//-translate-y-3'>
                                <div className='text-gray-100 text-opacity-70 font-bold text-xl text-left'>
                                    <h2>
                                        {user.displayName}
                                    </h2>
                                </div>
                                {/* username */}
                                <p className='text-left p-3 rounded-lg m-2 ml-0 futura font-bold text-2xl text-gray-100'>
                                    @{user.username?.toLocaleUpperCase()}
                                </p>
                                <p className='text-right text-gray-100 text-opacity-70 mt-4'>
                                    Member since June 2021
                                </p>
                            </div>
                        </div>
                        <section id="plant_info"
                            className='mt-8 max-w-[375px] bg-[#D9D9D9]bg-opacity-10 m-auto'
                        >
                            <div className='flex justify-between text-gray-100 text-[20px] text-opacity-75 font-bold px-4'>
                                <h2 className='text-left'>
                                    Tracking {plants?.length} plants
                                </h2>
                                <button
                                    className='text-2xl'
                                    onClick={() => { router.push("/Tracking") }}
                                >
                                    &rarr;
                                </button>
                            </div>
                            <div id="plants_horizontal"
                                className='flex overflow-auto sm:w-[600px] z-40 '
                            >
                                {plants?.map(p => {
                                    return (
                                        <div key={p.id} className='w-[120px] h-fit relative flex-col m-2'>
                                            <Image
                                                src={p.imageUrl}
                                                alt={p.species}
                                                width={120}
                                                height={120}
                                                className="object-cover h-[120px] w-full"
                                            />
                                            <div className=' w-[120px] whitespace-normal text-xs text-gray-100 text-opacity-80 '>
                                                {p.species}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home;