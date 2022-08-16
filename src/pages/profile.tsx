import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { collection, doc, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { IoAddCircleOutline } from '@react-icons/all-files/io5/IoAddCircleOutline';

import auth from '../firebase/auth';
import db from '../firebase/db';
import NavBar from './components/NavBar';
import styles from '../styles/Home.module.css';
import NextHead from './components/NextHead';
import customImageLoader from '../util/customImageLoader';
import sampleProfilePicture from '../public/sample-plant.png'
import rain from '../public/rain.png'
import FileInput from './components/FileInput';

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
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('')

    const signOut = () => {
        auth.signOut();
    }

    useEffect(() => {
        getNumPlants(user)
            .then(msg => setTrackingMsg(msg))
            .catch(e => console.error(e));
        //TODO get profile picture from DB/storage
    }, [user]);

    const deleteAccount = () => {
        if (confirm('Are you sure you want to delete your account?')
            && confirm('Are you really sure you want to delete your account?')) {
            user.delete();
        }
    }

    const onRemoveFile = () => {
        if (!confirm('Remove the image?')) return;
        // if image was previously saved, delete from storage
        if (plant && plant.picture) {
          deleteImage(plant.picture, user)
            .then(() => {
              plant.picture = '';
              setSelectedFile(null)
              setImageUrl('')
              setDoc(
                doc(
                  collection(doc(db, 'users', user.email), 'plantTrackingDetails'),
                  plant.id),
                { picture: '' },
                { merge: true }
              )
                .then(() => console.log('removed image ref from db'))
            })
            .catch(console.error);
        }
        // otherwise just remove from UI
        else {
          setSelectedFile(null)
          setImageUrl('')
        }
      }

    return (
        <div className='bg-green text-yellow min-h-screen text-left'>
            <NextHead />
            {
                user ?
                    <div>
                        <NavBar hideUser />
                        <div className='w-3/6 m-auto text-center justify-center pt-10 pb-14'>
                            {profilePicture ?
                                <Image
                                    src={profilePicture}
                                    loader={customImageLoader}
                                    alt='photo of plant'
                                    width='150' height='190'
                                />
                                :
                                <div className='relative m-auto pt-6 h-32 w-32 rounded-3xl bg-yellow '>
                                    <Image
                                        src={sampleProfilePicture}
                                        alt='Sample profile picture'
                                        loader={customImageLoader}
                                        className='absolute z-30 bottom-0 left-0'
                                    />
                                    <div className='absolute flex items-center cursor-pointer mt-2 top-0 right-3 text-green text-xs'>
                                        <FileInput 
                                            onAttachFile={(e) => {
                                                let f = e.target.files[0]
                                                setProfilePicture(URL.createObjectURL(f))
                                                on
                                            }}
                                        />
                                        Add picture &#10133;
                                    </div>
                                </div>
                            }
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