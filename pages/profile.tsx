import React, { useCallback, useContext, useEffect, useState } from 'react'
import Image from 'next/image';

import { IoEllipsisHorizontal } from '@react-icons/all-files/io5/IoEllipsisHorizontal';
import { IoArrowUndo } from '@react-icons/all-files/io5/IoArrowUndo';

import NavBar from './components/NavBar';
import toggleStyles from '../styles/toggle-switch.module.css';
import FileInput from './components/FileInput';
import { compressImage, deleteImage, updateProfilePicture, uploadFile } from '../service/FileService';
import { useRouter } from 'next/router';
import { saveDisplayName, saveUsername, unsubscribeFromDailyEmails, subscribeToDailyEmails, deleteUser } from '../service/UserService';
import TextInput from './components/TextInput';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { doc, setDoc } from 'firebase/firestore';
import db from '../firebase/db';
import useAuth from '../hooks/useAuth';
import { User } from 'firebase/auth';
import { signOut } from '../firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';
import storage from '../firebase/storage';
import Container from './components/BlurredFlowerContainer';
import AddUsernamePrompt from './components/AddUsernamePrompt';
import PlantContext from '../context/PlantContext';
import ddStyles from "../styles/dropdown.module.css";


function Home() {

    useAuthRedirect()

    const { user, dBUser, setDBUser } = useAuth();
    const { plants, setPlants } = useContext(PlantContext)
    const [profPicUrl, setProfPicUrl] = useState("")
    const [shouldAddUsername, setShouldAddUsername] = useState(false)
    const [inputUsername, setInputUsername] = useState('')
    const [inputDisplayName, setInputDisplayName] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [receiveDailyEmails, setReceiveDailyEmails] = useState(true);
    const [showMenu, setShowMenu] = useState(false)

    const router = useRouter()

    const deleteAccount = (user: User) => {
        if (confirm('Are you sure you want to delete your account?')
            && confirm('Are you really sure you want to delete your account?')) {
            deleteUser(user)
                .then(() => setPlants([]))
            signOut();
        }
    }

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
        <Container>
            <div className='min-h-screen h-full w-full '>
                {shouldAddUsername && dBUser ?
                    <AddUsernamePrompt />
                    :
                    user &&
                    <div className=''>
                        <NavBar hideSidebar />
                        <div className='relative sm:w-3/6 text-center pb-14 px-6  m-auto //max-w-[375px]'>
                            {editMode ?
                                <div className='flex justify-end w-full'>
                                    <button
                                        className='bg-[#D1DAC9] bg-opacity-10 hover:bg-opacity-100 py-1 px-6 text-xl rounded-full  text-primary  '
                                        style={{ transition: "background-color 0.3s ease-out" }}
                                        onClick={() => setEditMode(false)}
                                    >
                                        <IoArrowUndo className='text-xl' />
                                    </button>
                                </div>
                                :
                                <div className='flex justify-end pr-4 '>
                                    <div className={ddStyles.dropdown + " border border-primary px-4 py-2 mb-4 "}>
                                        <IoEllipsisHorizontal className='text-primary'/>
                                        <div className={ddStyles.dropdownContent + " bg-[#aaad8c] -translate-x-3/4 rounded-lg bg-opacity-80 backdrop-blur-lg"}>
                                            <button id="edit_button"
                                                className='hover:bg-gray-100 hover:bg-opacity-20 w-full px-2'
                                                onClick={() => { setEditMode(true) }}
                                            >
                                                Edit profile
                                            </button>
                                            <button id="signout_button"
                                                className='hover:bg-gray-100 hover:bg-opacity-20 w-full px-2'
                                                onClick={handleSignOut}
                                            >
                                                Sign out
                                            </button>
                                            <button id="delete_account_button"
                                                className='hover:bg-gray-100 hover:bg-opacity-20 w-full px-2'
                                                onClick={() => { deleteAccount(user) }}
                                            >
                                                Delete account
                                            </button>
                                            <div className='w-full border border-primary border-opacity-20'></div>
                                            <div className='text-center leading-tight p-2'>
                                                Receive daily emails if my plants are thirsty:
                                                <div className="flex text-left justify-end pt-3">
                                                    <label className='absolute w-14 h-8 '>
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
                                                <div className='pt-2 font-bold text-left text-gray-100 text-opacity-80'>
                                                    {receiveDailyEmails ? "Yes" : "No"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div id="menu_container"
                                className={`absolute top-0 right-10 rounded-tr rounded-lg  bg-[#D1DAC9] bg-opacity-70 hover:bg-opacity-100 w-24 h-64 backdrop-blur-sm
                                ${showMenu ? "opacity-100 z-50" : "opacity-0 -z-50"} transition-opacity`}
                            >

                            </div>
                            <div className="flex justify-start">
                                {profPicUrl ?
                                    <div className='rounded-full h-32 w-32 border-2 border-gray-100 relative'>
                                        <Image
                                            src={profPicUrl}
                                            alt='Profile picture'
                                            fill
                                            className="object-cover object-center rounded-full"
                                        />
                                        {editMode &&
                                            <a className='absolute -top-1 -right-1 bg-gray-300 text-red-600 font-bold text-lg cursor-pointer rounded mb-24 p-1'
                                                onClick={onRemoveFile} >
                                                X
                                            </a>
                                        }
                                    </div>
                                    :
                                    <div className='relative m-auto h-32 w-32 rounded-3xl bg-stone-100 '>
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
                                <div className='//-translate-y-3'>
                                    <div className='text-primary text-opacity-80 font-bold text-xl text-left'>
                                        {editMode ?
                                            <div className='w-full pl-6'>
                                                <label className='text-sm uppercase pl-3'>
                                                    Your name
                                                </label>
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
                                                    placeholder={dBUser?.displayName ? dBUser.displayName : user?.displayName || ""}
                                                    autoFocus={false}
                                                    name='editDisplayName'
                                                    type='text'
                                                />
                                            </div>
                                            :
                                            <h2>
                                                {dBUser?.displayName ? dBUser.displayName : user?.displayName}
                                            </h2>
                                        }
                                    </div>
                                    {/* username */}
                                    {editMode ?
                                        <div className='text-sm p-3 text-left font-bold'>
                                            <label className='text-sm uppercase pl-3'>
                                                Username
                                            </label>
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
                                                placeholder={`${dBUser?.username || ""}`}
                                                autoFocus={false}
                                                name='editUsername'
                                                type='text'
                                            />
                                        </div>
                                        :
                                        <p className='text-left p-3 rounded-lg m-2 ml-0 font-bold text-2xl text-gray-100'>
                                            {dBUser && `@${dBUser.username?.toLocaleUpperCase()}`}
                                        </p>
                                    }
                                    {/* <p className='italic  text-primary text-opacity-80'>
                                    {user.email}
                                </p> */}
                                    <p className='text-right text-primary text-opacity-80 mt-4'>
                                        Member since June 2021
                                    </p>
                                </div>
                            </div>
                            <section id="plant_info"
                                className='mt-8 max-w-[375px] bg-[#D9D9D9]bg-opacity-10 m-auto'
                            >
                                <div className='flex justify-between text-gray-100 text-[20px] text-opacity-75 font-bold px-4'>
                                    <h2 className='text-left'>
                                        Tracking {plants?.length} plants
                                    </h2>
                                    <button
                                        className='text-2xl'
                                        onClick={() => { router.push("/Tracking") }}
                                    >
                                        &rarr;
                                    </button>
                                </div>
                                <div id="plants_horizontal"
                                    className='flex overflow-auto sm:w-[600px] z-40 '
                                >
                                    {plants?.map(p => {
                                        return (
                                            <div key={p.id} className='w-[120px] h-fit relative flex-col m-2'>
                                                <Image
                                                    src={p.imageUrl}
                                                    alt={p.species}
                                                    width={120}
                                                    height={120}
                                                    className="object-cover h-[120px] w-full"
                                                />
                                                <div className=' w-[120px] whitespace-normal text-xs text-gray-100 text-opacity-80 '>
                                                    {p.species}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        </div>
                    </div>
                }
            </div>
        </Container>
    )
}

export default Home;