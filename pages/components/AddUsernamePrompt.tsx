import { useRouter } from 'next/router';
import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import { saveUsername } from '../../service/UserService'
import TextField from './TextField2'

const AddUsernamePrompt = () => {

    const { user, dBUser, setDBUser } = useAuth();
    const [inputUsername, setInputUsername] = useState('')

    const router = useRouter();

    const handleSaveUsername = async () => {
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
                router.reload()
            }, console.error)

    }

    return (
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
                    type='text'
                />
                <a
                    className='cursor-pointer bg-[#53984D] text-stone-200 rounded justify-center h-12 w-8 text-center content-center'
                    onClick={handleSaveUsername}
                >
                    &rarr;
                </a>
            </div>
        </div>
    )
}

export default AddUsernamePrompt