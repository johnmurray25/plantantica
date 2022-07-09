import React from 'react'
import firebase from '../firebase/clientApp';
import auth from '../firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import NavBar from './components/NavBar';

function Home() {

    const [user, loading, error] = useAuthState(auth);

    const signOut = () => {
        auth.signOut();
    }

    return (
        <div className='bg-green text-yellow min-h-screen text-center m-auto'>
            {
                user ?
                <div>
                    <NavBar hideUser />
                    <h1>
                        {user ? user.displayName : ''}
                    </h1>
                    <a onClick={signOut} className='cursor-pointer'>
                        Sign out
                    </a>
                </div>
                :
                <div>
                    <NavBar />
                </div>
            }
        </div>
    )
}

export default Home;