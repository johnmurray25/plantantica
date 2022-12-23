import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoPencilOutline } from '@react-icons/all-files/io5/IoPencilOutline';
import { IoArrowUndo } from '@react-icons/all-files/io5/IoArrowUndo';

import NavBar from './components/NavBar';
import toggleStyles from '../styles/toggle-switch.module.css';
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
import { signOut } from '../firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';
import storage from '../firebase/storage';

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
    const [profPicUrl, setProfPicUrl] = useState("")
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

            if (dBUser.profPicUrl) {
                setProfPicUrl(dBUser.profPicUrl)
            }

            setReceiveDailyEmails(dBUser.dailyEmails ? true : false);
        }
    }, [dBUser, user]);

    const onRemoveFile = () => {
        if (!confirm('Delete profile picture?')) {
            return;
        }
        // if image was previously saved, delete from storage
        if (dBUser.profilePicture) {
            deleteImage(dBUser.profilePicture, user.uid)
                .then(() => {
                    setDoc(
                        doc(db, 'users', user.uid),
                        { profilePicture: '', profPicUrl: '' },
                        { merge: true }
                    ).then(() => setProfPicUrl(''))
                })
                .catch(console.error);
        }
        // otherwise just remove from UI
        else {
            setProfPicUrl('')
        }
    }

    return (
        <div className=' text-stone-200 min-h-screen text-left'>
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
                        <div className='pt-24 relative med:w-3/6 m-auto text-center justify-center pb-14 px-6  '>
                            {editMode ?
                                <button
                                    className='rounded-full border-darkYellow m-auto mr-4 mb-5 med:mr-64 lg:mr-80 self-center flex items-center border w-fit p-3  hover:bg-darkYellow active:bg-darkYellow'
                                    style={{ transition: "background-color 0.3s ease-out" }}
                                    onClick={() => setEditMode(false)}
                                >
                                    <IoArrowUndo className='text-xl' />
                                </button>
                                :
                                <button
                                    className='rounded-full border-primary hover:text-zinc-200 m-auto mr-4 mb-5 mt-8  text-primary med:mr-64 lg:mr-80 self-center flex items-center border border-stone-100s w-fit p-2 hover:bg-darkYellow active:bg-darkYellow'
                                    style={{ transition: "background-color 0.3s ease-out" }}
                                    onClick={() => setEditMode(true)}
                                >
                                    <IoPencilOutline className='text-3xl' />
                                </button>
                            }
                            {profPicUrl ?
                                <div className='relative w-fit flex justify-center m-auto'>
                                    <Image
                                        src={profPicUrl}
                                        alt='Profile picture'
                                        width={200}
                                        height={220}
                                        className="object-cover object-center"
                                    />
                                    {editMode &&
                                        <a className='absolute top-2 right-2 bg-stone-100 text-brandGreen cursor-pointer border border-red-700 rounded mb-24 p-1 text-xs'
                                            onClick={onRemoveFile} >
                                            &#10060;
                                        </a>
                                    }
                                </div>
                                :
                                <div className='relative m-auto pt-6 h-32 w-32 rounded-3xl bg-stone-100 '>
                                    <div className='absolute flex items-center cursor-pointer mt-2 top-0 right-3 text-brandGreen text-xs'>
                                        <FileInput
                                            onAttachFile={async (e: { target: { files: File[]; }; }) => {
                                                let f: File = e.target.files[0]
                                                let compressedImage = await compressImage(f)
                                                setProfPicUrl(URL.createObjectURL(f))
                                                const fileName = await uploadFile(compressedImage, user)
                                                const url = await getDownloadURL(ref(storage, `${user.uid}/${fileName}`))
                                                updateProfilePicture(fileName, url, user.uid)
                                            }}
                                            onRemoveFile={onRemoveFile}
                                            message='Add picture &#10133;'
                                        />
                                    </div>
                                </div>
                            }
                            <div className='m-10 mb-3 text-primary' >
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
                                    <h2 className='text-2xl ' >
                                        {dBUser?.displayName ? dBUser.displayName : user?.displayName}
                                    </h2>
                                }
                            </div>
                            <div className=''>
                                <h3 className=' mb-8 pt-0 flex justify-center items-center text-xl translate-y-4 '>
                                    <p className='text-primary text-opacity-80 text-xs font-bold'>
                                        USERNAME:
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
                                        <p className=' p-3 pl-10 rounded-lg m-2 ml-0 text-stone-100 '>
                                            {dBUser && `@${dBUser.username?.toLocaleUpperCase()}`}
                                        </p>
                                    }
                                </h3>
                                <h3 className='text-lg flex items-center justify-center w-full text-[#29bc29]'>
                                    {/* <p className='text-primary text-opacity-80 text-xs font-bold pr-8'>
                                        EMAIL:
                                    </p> */}
                                    <p className='italic pl-8 text-primary text-opacity-50'>
                                        {user.email}
                                    </p>
                                </h3>
                            </div>
                            {/* <h3 className='pt-10 text-[#29bc29]'>
                                Tracking {dBUser?.plantTrackingDetails?.length || 0} plants
                            </h3> */}
                            <div className='mt-14 leading-8 text-gray-100 text-opacity-90'>
                                Receive daily emails if my plants need water:
                                <div className='pt-1 flex justify-center '>
                                    <div className="relative mx-4 w-fit">
                                        <label className='absolute w-14 h-8 //-translate-y-28'>
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
                                    <div className='translate-x-16 transition-opacity'>
                                        {receiveDailyEmails ? "YES" : "NO"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-evenly text-center pb-0 pt-10 w-full">
                                <button
                                    className='text-primary hover:text-gray-100 text-opacity-80 font-light border-primary hover:bg-primary active:bg-[#29bc29]
                                     py-4 px-7 mx-2  border  '
                                    style={{
                                        borderRadius: "0 222px",
                                        transition: "background-color 0.5s ease"
                                    }}
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </button>
                                <button
                                    className='text-red-800 text-opacity-80 font-light hover:bg-red-800 active:bg-red-800 hover:text-gray-100 border border-red-800 py-4 px-7 mx-2'
                                    style={{
                                        borderRadius: "222px 0",
                                        transition: "background-color 0.5s ease"
                                    }}
                                    onClick={() => deleteAccount(user)}
                                >
                                    Delete account
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Home;