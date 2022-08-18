import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { IoAddCircleOutline } from '@react-icons/all-files/io5/IoAddCircleOutline';
import ReactLoading from 'react-loading'

import auth from '../firebase/auth';
import db from '../firebase/db';
import NavBar from './components/NavBar';
import styles from '../styles/Home.module.css';
import NextHead from './components/NextHead';
import customImageLoader from '../util/customImageLoader';
import sampleProfilePicture from '../public/sample-plant.png'
import FileInput from './components/FileInput';
import { compressImage, deleteImage, getProfilePictureUrl, updateProfilePicture, uploadFile } from '../../service/FileService';
import useWindowDimensions from '../hooks/useWindowDimensions';

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
    const [profPicUrl, setProfPicUrl] = useState('')
    const [fileName, setFileName] = useState('')
    const [isProfPicLoading, setIsProfPicLoading] = useState(false);

    const { width, height } = useWindowDimensions()

    const signOut = () => {
        auth.signOut();
    }

    useEffect(() => {
        if (!user) {
            return
        }

        if (!profPicUrl) {
            setIsProfPicLoading(true);
            getProfilePictureUrl(user.email)
                .then(data => {
                    setFileName(data.fileName)
                    data.url.then(setProfPicUrl)
                })
                .catch(console.error)
                .finally(() => setIsProfPicLoading(false))
        }

        getNumPlants(user)
            .then(msg => setTrackingMsg(msg))
            .catch(console.error);
    }, [user, profPicUrl]);

    const deleteAccount = () => {
        if (confirm('Are you sure you want to delete your account?')
            && confirm('Are you really sure you want to delete your account?')) {
            user.delete();
        }
    }

    const onRemoveFile = () => {
        if (!confirm('Delete profile picture?')) return;
        // if image was previously saved, delete from storage
        if (fileName) {
            deleteImage(fileName, user)
                .then(() => {
                    setProfPicUrl('')
                    setFileName('')
                    setDoc(
                        doc(db, 'users', user.email),
                        { profilePicture: '' },
                        { merge: true }
                    ).then(() => console.log('Deleted profile picture'))
                })
                .catch(console.error);
        }
        // otherwise just remove from UI
        else {
            setProfPicUrl('')
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
                            {profPicUrl ?
                                // User has saved profile picture
                                isProfPicLoading ?
                                    <ReactLoading type='spinningBubbles' color="#fff" />
                                    :
                                    <div className='relative w-fit flex justify-center m-auto'>
                                        <Image
                                            src={profPicUrl}
                                            loader={customImageLoader}
                                            alt='Profile picture'
                                            width={width / 6} height={(width / 6) * 1.2}
                                        />
                                        <a className='absolute top-2 right-2 bg-yellow text-green cursor-pointer border border-red-700 rounded mb-24 p-1'
                                            onClick={onRemoveFile} >
                                            &#10060;
                                        </a>
                                    </div>
                                :
                                isProfPicLoading ?
                                    <div className='flex justify-center'>
                                        <ReactLoading type='spinningBubbles' color="#fff" />
                                    </div>
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
                                                onAttachFile={async (e) => {
                                                    let f: File = e.target.files[0]
                                                    let compressedImage = await compressImage(f);
                                                    setProfPicUrl(URL.createObjectURL(f))
                                                    let fileName = await uploadFile(compressedImage, user);
                                                    updateProfilePicture(fileName, user.email).catch(console.log)
                                                }}
                                                onRemoveFile={onRemoveFile}
                                                message='Add picture &#10133;'
                                            />
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