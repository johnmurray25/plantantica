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

    const deleteAccount = () => {
        if (confirm('Are you sure you want to delete your account?')
            && confirm('Are you really sure you want to delete your account?')) {
            user.delete();
        }
    }

    return (
        <div className='bg-green text-yellow min-h-screen text-center m-auto justify-center items-center'>
            {
                user ?
                    <div>
                        <NavBar hideUser />
                        <div className='block w-3/6 items-center justify-center m-auto'>
                            <h1>
                                {user.displayName}
                            </h1>
                            <h3>
                                Email: {user.email}
                            </h3>
                            <div className="flex items-center justify-between px-64">
                                <a onClick={signOut} className='cursor-pointer hover:underline'>
                                    Sign out
                                </a>
                                <a onClick={deleteAccount} className='cursor-pointer hover:underline'>
                                    Delete account?
                                </a>
                            </div>
                        </div>
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