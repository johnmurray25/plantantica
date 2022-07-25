import React, { useEffect, useState } from 'react'
import auth from '../firebase/auth';
import db from '../firebase/db';
import { useAuthState } from 'react-firebase-hooks/auth'
import NavBar from './components/NavBar';
import styles from '../styles/Home.module.css';
import { collection, doc, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';
import NextHead from './components/NextHead';

const getNumPlants = async (user: User) => {
    if (!user) return;
    let collectionRef = collection(doc(db, 'users', user.email), 'plantTrackingDetails');
    try {
        let results = await getDocs(collectionRef);
        return `You are tracking ${results.docs.length} plants.`
    } catch (e) {
        console.error(e);
        return '';
    }
}

function Home() {

    const [user] = useAuthState(auth);
    const [trackingMsg, setTrackingMsg] = useState('');

    const signOut = () => {
        auth.signOut();
    }

    useEffect(() => {
        getNumPlants(user)
            .then(msg => setTrackingMsg(msg))
            .catch(e => console.error(e));
    }, [user]);

    const deleteAccount = () => {
        if (confirm('Are you sure you want to delete your account?')
            && confirm('Are you really sure you want to delete your account?')) {
            user.delete();
        }
    }

    return (
        <div className='bg-green text-yellow min-h-screen text-left'>
            <NextHead />
            {
                user ?
                    <div>
                        <NavBar hideUser />
                        <div className='w-3/6 m-auto text-center pt-10 pb-14'>
                            <h1 className={styles.title}>
                                {user.displayName}
                            </h1>
                            <h3 className='text-lg'>
                                {user.email}
                            </h3>
                            <h3 className='pt-5 '>
                                {trackingMsg}
                            </h3>
                            <div className="flex justify-between med:justify-evenly text-center py-10 w-full">
                                <a onClick={signOut} className='cursor-pointer hover:bg-yellow hover:text-green border border-yellow rounded py-4 px-7 mx-2'>
                                    Sign out
                                </a>
                                <a onClick={deleteAccount} className='cursor-pointer hover:bg-yellow hover:text-red-600 border border-yellow rounded py-4 px-7 mx-2'>
                                    Delete account
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