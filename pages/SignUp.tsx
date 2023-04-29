import { browserLocalPersistence, createUserWithEmailAndPassword, deleteUser, User } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import auth from '../firebase/auth'
import useAuth from '../hooks/useAuth'
import { getUserByUsername, initializeUser } from '../service/UserService'
import SignInWithGoogleButton from './components/forms/SignInWithGoogleButton'
import TextField from './components/forms/TextField2'
import TreeLogo from './components/util/TreeLogo'

const SignUp = () => {
    const router = useRouter()
    const { user } = useAuth()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [emailError, setEmailError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const handleSignUp = useCallback(async () => {
        // check passwords are equal 
        if (password != passwordConfirm) {
            alert("Passwords do not match")
            return null
        }
        // make sure password is strong?

        // check if email is taken
        // if ((await getUserByEmail(email))?.exists()) {
        //     alert("A user already exists with this email address")
        //     setEmailError("A user already exists with this email address")
        //     return null
        // }

        // check if username is taken
        if ((await getUserByUsername(username))?.exists()) {
            setUsernameError("Username already taken")
            return null
        }

        console.log("validated fields")
        // signUp({ email, username, password})
        //     .then(setUser)
        try {
            let newCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log('Successfully created account in firebase auth')
            if (await initializeUser(newCredential.user, username)) {
                // sendEmailVerification(newCredential.user)
                // .then(() => alert("We are sending you an email verification link. Please open it to complete the sign up process"))
                // setUser(newCredential.user)
            } else {
                deleteUser(newCredential.user)
                alert("An error occurred. Please try again later")
                return null
            }
        } catch (e) {
            // alert(`ERROR: ${e.code}`)
            console.error(e)
            if (e.code.toLowerCase().includes("email")) {
                setEmailError("A user already exists with this email address")
            }
            return null
        }
    }, [email, password, passwordConfirm, username])

    const handleKeyPress = useCallback((e: { key: any; }) => {
        const key = e.key;
        if (key === 'Enter' && email?.length > 0 && username?.length > 0 && password?.length > 0) {
            handleSignUp()
        }
    }, [email.length, handleSignUp, password.length, username.length])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    useEffect(() => {
        if (user) {
            console.log("user: " + user.uid)
            router.push('/profile');
        }
        auth.setPersistence(browserLocalPersistence)
    }, [router, user])

    return (
        <div className='antialiased text-gray-100 min-h-screen text-center pt-2 text-xl' id='firebaseui-auth-container' >
            <Link href='/' passHref>
                <h1 className='font-bold text-3xl'>
                    PLANTANTICA
                </h1>
                <div className='flex justify-center text-primary dark:text-highlight'>
                    <TreeLogo height={140} width={150} />
                </div>
            </Link>
            <form className='w-11/12 max-w-[350px] m-auto text-left'>
                <div className="font-bold text-center mb-2">SIGN UP:</div>
                <div className='flex justify-center'>
                    <SignInWithGoogleButton />
                </div>
                <div className='my-4 text-center font-bold text-sm'>
                    OR:
                </div>
                <label>Email</label>
                <TextField
                    onChange={setEmail}
                    value={email}
                    type="email"
                    error={emailError}
                />
                <p className='text-sm text-red-800 font-bold mb-4'>
                    {emailError}
                </p>
                <label>Username</label>
                <TextField
                    onChange={setUsername}
                    value={username}
                    error={usernameError}
                />
                <p className='text-sm text-red-800 font-bold mb-4'>
                    {usernameError}
                </p>
                <label>Password</label>
                <TextField
                    onChange={setPassword}
                    value={password}
                    type='password'
                />
                <label>Confirm password</label>
                <TextField
                    onChange={setPasswordConfirm}
                    value={passwordConfirm}
                    type='password'
                />
            </form>
            <div className='flex justify-between items-center text-left w-3/5 m-auto -translate-x-12'>
                <div className='text-sm'>
                    Already have an account? &nbsp;
                    <Link href="/auth" className='text-primary dark:text-highlight focus:underline hover:underline'>
                        Sign in
                    </Link>
                </div>
                <button className='bg-lime-700 text-zinc-100 px-6 py-2 my-8 w-fit
                                rounded whitespace-nowrap translate-x-16 hover:bg-lime-400 hover:text-brandGreen'
                    onClick={handleSignUp}
                >
                    Sign up &rarr;
                </button>
            </div>
        </div>
    )
}

export default SignUp