import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import ReactLoading from 'react-loading';

import { getUserByEmail, getUserDBRecord, mapDocToUser, saveUsername, User } from '../../service/UserService'
import auth from '../../firebase/auth'
import NavBar from '../components/NavBar'
import NextHead from '../components/NextHead'
import TextField from '../components/TextField';
import Image from 'next/image';
import customImageLoader from '../../util/customImageLoader';

const Home = () => {
    const router = useRouter()
    const [user, authLoading] = useAuthState(auth)
    const email = router.query.email
    const [isLoading, setIsLoading] = useState(false)
    const [shouldAddUsername, setShouldAddUsername] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [userToEdit, setUserToEdit] = useState<User>(null)
    const [inputUsername, setInputUsername] = useState('')
    const [saveMessage, setSaveMessage] = useState('')

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!user) {
            setErrorMessage('No user is logged in.')
            return;
        }

        // Validate auth state against url param
        if (user.email !== email) {
            setErrorMessage("You cannot edit another user\'s account")
            return;
        }

        setIsLoading(true)
        getUserDBRecord(email)
            .then(record => {
                if (!record) {
                    setErrorMessage(`Could not find user with email ${email}`)
                    return
                }

                setUserToEdit(record)

                if (!record.username) {
                    // Prompt user to add username
                    setShouldAddUsername(true)
                }
            }, console.error)
            .finally(() => setIsLoading(false))

    }, [user, email, authLoading])

    const handleSaveUsername = async () => {
        let username = inputUsername
        let emailAddress = typeof email == 'string' ? email : email[0]
        console.log(`email :: ${emailAddress}`)
        saveUsername(username, emailAddress)
            .then((result) => {
                console.log(`result :: ${result}`)
                switch (result) {
                    case 'ok':
                        console.log('success!')
                        break
                    case 'username':
                        console.log('username already exists')
                        break
                    case 'email':
                        console.log('invalid email')
                        break
                    case 'error':
                        console.log('an error occurred')
                        break
                    default:
                        console.log('default')
                }
                router.reload()
            }, console.error)

    }

    return (
        <div className="bg-green text-yellow"
            style={{ minWidth: '100vw', minHeight: '100vh' }}
        >
            <NextHead />
            <NavBar />

            {
                authLoading || isLoading ?
                    <div className="flex justify-center">
                        <ReactLoading type='spinningBubbles' color="#fff" />
                    </div>
                    :
                    errorMessage ?
                        <div className="flex justify-center">
                            {errorMessage}
                        </div>
                        :
                        shouldAddUsername && userToEdit ?
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
                                        className='cursor-pointer bg-[#53984D] text-yellow rounded justify-center h-12 w-8 text-center content-center'
                                        onClick={handleSaveUsername}
                                    >
                                        &rarr;
                                    </a>
                                </div>
                                {saveMessage &&
                                    <div>
                                        {saveMessage}
                                    </div>
                                }
                            </div>
                            :
                            userToEdit &&
                            <div className='text-center w-80 m-auto border border-yellow rounded p-10'>
                                <div className='relative w-fit flex justify-center m-auto'>
                                        {/* <Image
                                            src={profPicUrl}
                                            loader={customImageLoader}
                                            alt='Profile picture'
                                            width={150}
                                            height={180}
                                        />
                                        <a className='absolute top-2 right-2 bg-yellow text-green cursor-pointer border border-red-700 rounded mb-24 p-1 text-xs'
                                            onClick={onRemoveFile} >
                                            &#10060;
                                        </a> */}
                                    </div>
                                <p>
                                    Username: {userToEdit.username} <br/><br/>
                                    Display name: {userToEdit.displayName ? userToEdit.displayName : user.displayName} <br/><br/>
                                    Email: {user.email}
                                </p>
                            </div>
            }
        </div>
    )
}

export default Home