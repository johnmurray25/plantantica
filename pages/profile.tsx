import React from 'react'
import auth from '../firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import NavBar from './components/NavBar';

function Home() {

    const [user] = useAuthState(auth);

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
        <div className='bg-green text-yellow min-h-screen text-left'>
            {
                user ?
                    <div>
                        <NavBar hideUser />
                        <div className='w-3/6 m-auto'>
                            <h1>
                                {user.displayName}
                            </h1>
                            <h3>
                                Email: {user.email}
                            </h3>
                            <div className="flex flex-wrap px-64 text-center">
                                <a onClick={signOut} className='cursor-pointer hover:underline py-4'>
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