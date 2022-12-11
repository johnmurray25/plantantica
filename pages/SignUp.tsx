import { createUserWithEmailAndPassword, deleteUser, User } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import auth from '../firebase/auth'
import { getUserByEmail, getUserByUsername, initializeUser } from '../service/UserService'
import TextField from './components/TextField'
import TreeLogo from './components/TreeLogo'

const signUp = async ({ email, username, password, passwordConfirm }): Promise<User> => {
    // check passwords are equal 
    if (password != passwordConfirm) {
        alert("Passwords do not match")
        return null
    }
    // make sure password is strong?

    // check if email is taken
    if ((await getUserByEmail(email))?.exists()) {
        alert("A user already exists with this email address")
        return null
    }

    // check if username is taken
    if ((await getUserByUsername(username))?.exists()) {
        alert("This username is already taken")
        return null
    }

    try {
        let newCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Successfully created account in firebase auth')
        if (await initializeUser(newCredential.user, username)) {
            // sendEmailVerification(newCredential.user)
                // .then(() => alert("We are sending you an email verification link. Please open it to complete the sign up process"))
            return newCredential.user
        } else {
            deleteUser(newCredential.user)
            alert("An error occurred. Please try again later")
            return null
        }
    } catch (e) {
        alert(`ERROR: ${e.code}`)
        console.error(e)
        return null
    }
}

const SignUp = () => {
    const router = useRouter()
    const [user, setUser] = useState<User>(null)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleSignUp = useCallback(() => {
        signUp({ email, username, password, passwordConfirm })
            .then(setUser)
    }, [email, password, passwordConfirm, username])

    const handleKeyPress = useCallback((e: { key: any; }) => {
        const key = e.key;
        if (key === 'Enter' && email?.length > 0 && username?.length > 0 && password?.length > 0) {
            handleSignUp()
        }
    }, [email.length, handleSignUp, password.length, username.length])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        if (user) {
            router.push('/profile')
        }
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress, router, user])

    return (
        <div className='antialiased text-stone-200 min-h-screen text-center pt-10 text-xl' id='firebaseui-auth-container' >
            <Link href='/' passHref>
                <div>
                    <TreeLogo height={140} width={375} />
                </div>
            </Link>
            <TextField
                onChange={setEmail}
                value={email}
                width={150}
                placeholder="Email"
                type="email"
            />
            <TextField
                onChange={setUsername}
                value={username}
                width={150}
                placeholder="Username"
            />
            <TextField
                onChange={setPassword}
                value={password}
                width={150}
                placeholder="Password"
                type='password'
            />
            <TextField
                onChange={setPasswordConfirm}
                value={passwordConfirm}
                width={150}
                placeholder="Confirm password"
                type='password'
            />
            <button className='bg-lime-700 text-zinc-100 px-4 py-2 w-32 
                                rounded text-center translate-x-16 hover:bg-lime-400 hover:text-brandGreen'
                onClick={() => {
                    signUp({ email, username, password, passwordConfirm })
                        .then(setUser)
                }}
            >
                Sign up
            </button>
        </div>
    )
}

export default SignUp