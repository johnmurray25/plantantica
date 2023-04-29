import React, { useEffect } from 'react'
import Container from './components/util/Container';

import NavBar from './components/util/NavBar'
import UserSearch from './components/home/UserSearch';

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
        <Container>
            <NavBar />

            <div className='min-h-screen p-4 pt-48 flex flex-col items-center m-auto'>
                <UserSearch />
            </div>

        </Container >
    )
}

export default Home