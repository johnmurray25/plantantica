import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';

import ReactLoading from 'react-loading'
import { IoPencilOutline } from '@react-icons/all-files/io5/IoPencilOutline';

import NavBar from './components/NavBar';
import toggleStyles from '../styles/toggle-switch.module.css';
import customImageLoader from '../util/customImageLoader';
import FileInput from './components/FileInput';
import { compressImage, deleteImage, updateProfilePicture, uploadFile } from '../service/FileService';
import { useRouter } from 'next/router';
import { saveDisplayName, saveUsername, unsubscribeFromDailyEmails, subscribeToDailyEmails, deleteUser } from '../service/UserService';
import TextField from './components/TextField';
import TextInput from './components/TextInput';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { doc, setDoc } from 'firebase/firestore';
import db from '../firebase/db';
import useAuth from '../hooks/useAuth';
import { User } from 'firebase/auth';
import useProfilePicture from '../hooks/useProfilePicture';
import { signOut } from '../firebase/auth';

const deleteAccount = (user: User) => {
    if (confirm('Are you sure you want to delete your account?')
        && confirm('Are you really sure you want to delete your account?')) {
        deleteUser(user);
        signOut();
    }
}

function Home() {

    useAuthRedirect()

    const { user, dBUser, setDBUser } = useAuth();
    const { profPicUrl, setProfPicUrl, profPicLoading, fileName, setFileName } = useProfilePicture()
    const [shouldAddUsername, setShouldAddUsername] = useState(false)
    const [inputUsername, setInputUsername] = useState('')
    const [inputDisplayName, setInputDisplayName] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [receiveDailyEmails, setReceiveDailyEmails] = useState(true);

    const router = useRouter()

    const handleSignOut = () => {
        if (confirm('Sign out?')) {
            signOut();
        }
    }

    const handleSaveUsername = useCallback(async (reload: boolean) => {
        saveUsername(inputUsername, user)
            .then((result) => {
                switch (result) {
                    case 'ok':
                        console.log('success!')
                        setDBUser({ ...dBUser, username: inputUsername })
                        break
                    case 'username':
                        alert('Username already exists. Please try something different')
                        return
                    case 'email':
                        console.log('invalid email')
                        break
                    case 'error':
                        console.log('an error occurred')
                        break
                    default:
                        console.log('default')
                }
                if (reload) {
                    router.reload()
                }
            }, console.error)

    }, [dBUser, inputUsername, router, setDBUser, user])


    useEffect(() => {
        if (dBUser) {
            if (!dBUser.username) {
                // Prompt user to add username
                setShouldAddUsername(true)
            }

            setReceiveDailyEmails(dBUser.dailyEmails ? true : false);
        }
    }, [dBUser, profPicUrl, user]);

    const onRemoveFile = () => {
        if (!confirm('Delete profile picture?')) {
            return;
        }
        // if image was previously saved, delete from storage
        if (fileName) {
            deleteImage(fileName, user.uid)
                .then(() => {
                    setProfPicUrl('')
                    setFileName('x')
                    setDoc(
                        doc(db, 'users', user.uid),
                        { profilePicture: '' },
                        { merge: true }
                    )
                })
                .catch(console.error);
        }
        // otherwise just remove from UI
        else {
            setProfPicUrl('')
        }
    }

    return (
        <div className='bg-green text-stone-200 min-h-screen text-left'>
            {
                shouldAddUsername && dBUser ?
                    <div className='text-center'>
                        <h2
                            className='italic '
                            style={{ fontSize: '3.75rem', }}
                        >
                            Welcome
                        </h2>
                        <p
                            className='text-2xl p-3'
                            style={{ lineHeight: 2 }}
                        >
                            Thank you for joining Plantantica.    <br />
                            Please add a username:
                        </p>
                        <div className='flex justify-center'>
                            <TextField
                                value={inputUsername}
                                onChange={setInputUsername}
                                placeholder='Add username...'
                                autoFocus={true}
                                name='inputUsername'
                                type='text'
                                width={48}
                            />
                            <a
                                className='cursor-pointer bg-[#53984D] text-stone-200 rounded justify-center h-12 w-8 text-center content-center'
                                onClick={() => handleSaveUsername(true)}
                            >
                                &rarr;
                            </a>
                        </div>
                    </div>
                    :
                    user &&
                    <div>
                        <NavBar hideUser />
                        <div className='pt-24 relative w-full med:w-3/6 m-auto text-center justify-center pb-14 px-6  '>
                            {editMode ?
                                <a
                                    className='m-auto mr-4 mb-5 med:mr-64 lg:mr-80 self-center flex items-center border border-stone-100 rounded w-fit p-3 hover:text-green hover:bg-stone-100'
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </a>
                                :
                                <a
                                    className='m-auto mr-4 mb-5 mt-8 med:mr-64 lg:mr-80 self-center flex items-center border border-stone-100s rounded w-fit p-3 hover:text-green hover:bg-stone-100'
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit &nbsp; <IoPencilOutline />
                                </a>
                            }
                            {!profPicLoading ?
                                // User has saved profile picture
                                profPicUrl ?
                                    <div className='relative w-fit flex justify-center m-auto'>
                                        <Image
                                            src={profPicUrl}
                                            loader={customImageLoader}
                                            alt='Profile picture'
                                            width={150}
                                            height={180}
                                        />
                                        {editMode &&
                                            <a className='absolute top-2 right-2 bg-stone-100 text-green cursor-pointer border border-red-700 rounded mb-24 p-1 text-xs'
                                                onClick={onRemoveFile} >
                                                &#10060;
                                            </a>
                                        }
                                    </div>
                                    :
                                    <div className='relative m-auto pt-6 h-32 w-32 rounded-3xl bg-stone-100 '>
                                        <div className='absolute flex items-center cursor-pointer mt-2 top-0 right-3 text-green text-xs'>
                                            <FileInput
                                                onAttachFile={async (e: { target: { files: File[]; }; }) => {
                                                    let f: File = e.target.files[0]
                                                    let compressedImage = await compressImage(f)
                                                    setProfPicUrl(URL.createObjectURL(f))
                                                    uploadFile(compressedImage, user)
                                                        .then(fileName => updateProfilePicture(fileName, user.uid))
                                                        .catch(console.log)
                                                }}
                                                onRemoveFile={onRemoveFile}
                                                message='Add picture &#10133;'
                                            />
                                        </div>
                                    </div>
                                :
                                <div className='flex justify-center'>
                                    <ReactLoading type='spinningBubbles' color="#fff" />
                                </div>
                            }
                            <div className='m-10 mb-3 text-lightYellow' >
                                {editMode ?
                                    <div className='m-auto flex justify-center'>
                                        <TextInput
                                            value={inputDisplayName}
                                            onChange={setInputDisplayName}
                                            onSubmit={() => {
                                                // Save display name to DB
                                                saveDisplayName(user.uid, inputDisplayName)
                                                    .then(() => {
                                                        setDBUser({ ...dBUser, displayName: inputDisplayName })
                                                        setEditMode(false)
                                                    })
                                            }}
                                            width={10}
                                            placeholder={dBUser?.displayName ? dBUser.displayName : user?.displayName}
                                            autoFocus={false}
                                            name='editDisplayName'
                                            type='text'
                                        />
                                    </div>
                                    :
                                    <h2 className='text-3xl' >
                                        {dBUser?.displayName ? dBUser.displayName : user?.displayName}
                                    </h2>
                                }
                            </div>
                            <div className=''>
                                <h3 className='pb-5 pt-0 flex justify-center w-full items-center text-xl '>
                                    <p className='text-[#29bc29] '>
                                        username:
                                    </p>
                                    {editMode ?
                                        <div className='text-sm p-3 flex items-center'>
                                            <TextInput
                                                value={inputUsername}
                                                onChange={setInputUsername}
                                                onSubmit={() => {
                                                    handleSaveUsername(false)
                                                        .then(() => {
                                                            setDBUser({ ...dBUser, username: inputUsername })
                                                            setEditMode(false)
                                                        })
                                                }}
                                                width={10}
                                                placeholder={`${dBUser?.username}`}
                                                autoFocus={false}
                                                name='editUsername'
                                                type='text'
                                            />
                                        </div>
                                        :
                                        <p className='font-bold p-3 pl-10 rounded-lg m-2 ml-0 text-stone-100'>
                                            {dBUser && `@${dBUser.username}`}
                                        </p>
                                    }
                                </h3>
                                <h3 className='text-lg flex justify-center w-full text-[#29bc29]'>
                                    <p className=' pr-8'>
                                        email:
                                    </p>
                                    <p className='italic pl-8 text-lightYellow'>
                                        {user.email}
                                    </p>
                                </h3>
                            </div>
                            <h3 className='pt-10 text-[#29bc29]'>
                                Tracking {dBUser?.plantTrackingDetails?.length || 0} plants
                            </h3>
                            <div className='mt-10 '>
                                Receive daily emails if my plants need water &nbsp;&nbsp;&nbsp;
                                <label className="relative inline-block w-14 h-8">
                                    <input type="checkbox"
                                        checked={receiveDailyEmails}
                                        onClick={() => {
                                            if (!(user && dBUser)) {
                                                return;
                                            }
                                            // unsubscribe
                                            if (receiveDailyEmails) {
                                                unsubscribeFromDailyEmails(user.uid)
                                                    .then(() => setReceiveDailyEmails(false))
                                                console.log('Unsubscribed from daily emails')
                                            }
                                            // subscribe
                                            else {
                                                subscribeToDailyEmails(user.uid)
                                                    .then(() => setReceiveDailyEmails(true))
                                                console.log('Subscribed to daily emails')
                                            }
                                        }}
                                    />
                                    <span className={`${toggleStyles.slider} ${toggleStyles.round}`}></span>
                                </label>
                            </div>
                            <div className="flex justify-evenly text-center pb-0 pt-10 w-full">
                                <a
                                    className='cursor-pointer hover:bg-stone-100 hover:text-green border border-[#29bc29] py-4 px-7 mx-2'
                                    style={{
                                        borderRadius: "0 222px",
                                    }}
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </a>
                                <a
                                    className='cursor-pointer hover:bg-red-600 hover:text-stone-100 border border-red-600 py-4 px-7 mx-2'
                                    style={{
                                        borderRadius: "222px 0",
                                    }}
                                    onClick={() => deleteAccount(user)}
                                >
                                    Delete account
                                </a>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Home;