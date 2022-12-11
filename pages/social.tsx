import React, { useEffect } from 'react'

import NavBar from './components/NavBar'
import UserSearch from './components/UserSearch';

const Home: React.FC = () => {

    useEffect(() => {
       
        // if (user && (!following || !following.length)) {
        //     getFollowingList(user.uid)
        //         .then(res => {
        //             setFollowing(res)
        //             console.log(res)
        //         })
        //         .catch(console.error);
        // }

    }, [])

    return (
        <div className='text-stone-200 bg-green min-w-full' /**Container */>
            <NavBar />

            <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto'>
                <UserSearch />
            </div>

        </div >
    )
}

export default Home