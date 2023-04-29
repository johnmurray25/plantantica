import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';

import auth from '../firebase/auth';
import SignInWithGoogleButton from './components/forms/SignInWithGoogleButton';
import TreeLogo from './components/util/TreeLogo';
import TextField from './components/forms/TextField2';
import { getUserByUsername } from '../service/UserService';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

// const fbAuthProvider = new FacebookAuthProvider();

// const signInWithFacebook = (width: number) => {
//     width <= 650 ? signInWithRedirect(auth, fbAuthProvider) : signInWithPopup(auth, fbAuthProvider);
// }

const signIn = async (identifier: string, password: string) => {
    let email = identifier;
    if (!identifier.includes("@")) {
        // Sign in with username
        email = (await getUserByUsername(identifier.toLocaleLowerCase()))?.data().email;
        if (!email?.length) {
            alert("Could not find account for username " + identifier)
            return
        }
        console.log(`found email ${email} for username ${identifier}`)
    }
    const credential = signInWithEmailAndPassword(auth, email, password)
        .catch((e) => {
            console.error(e)
            alert(`Error: ${e.code}`)
        })
}

const SignInScreen = () => {
    const router = useRouter()
    const { user } = useAuth()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('');

    const handleKeyPress = useCallback((e: { key: any; }) => {
        const key = e.key;
        if (key === 'Enter' && identifier.length > 0 && password.length > 0) {
            signIn(identifier, password);
        }
    }, [identifier, password])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
        auth.setPersistence(browserLocalPersistence)
    }, [router, user])

    return (
        <div className='antialiased text-gray-100 min-h-screen text-center pt-6 text-xl' id='firebaseui-auth-container' >
            <div className='w-screen flex justify-center pb-0'>
                <Link href='/' passHref>
                    <h1 className='font-bold text-3xl'>
                        PLANTANTICA
                    </h1>
                    <div className='cursor-pointer flex justify-center text-primary dark:text-highlight'>
                        <TreeLogo height={140} width={200} />
                    </div>
                </Link>
            </div>
            <div className='block text-center w-11/12 max-w-[350px] m-auto '>
                <div className="font-bold mx-auto mb-2">SIGN IN</div>
                <div className="m-auto">
                    <SignInWithGoogleButton />
                </div>
                <p className='m-auto font-bold text-sm text-gray-100 mb-6 mt-6'>
                    OR:
                </p>
                <div className='text-left'>
                    <label>Username or Email</label>
                    <TextField
                        onChange={setIdentifier}
                        value={identifier}
                    />
                    <label>Password</label>
                    <TextField
                        onChange={setPassword}
                        value={password}
                        type='password'
                    />
                </div>
                <div className="flex justify-evenly items-center mt-2 mx-auto">
                    <Link href='/ResetPassword'
                        className='text-sm text-primary text-opacity-80 cursor-pointer hover:text-opacity-100'
                    >
                        Forgot password?
                    </Link>
                    <button className='bg-lime-700 bg-opacity-70 text-gray-100 text-opacity-90 px-4 py-2 w-fit rounded transition-colors
                                        text-center hover:bg-lime-400 hover:text-brandGreen'
                        onClick={() => signIn(identifier, password)}
                    >
                        Sign in &rarr;
                    </button>
                </div>
                <p className='text-sm text-center pb-6 mt-8'>
                    Don&apos; have an account yet? &nbsp;
                    <Link href="/SignUp" passHref>
                        <span className='text-lime-300 cursor-pointer hover:underline'>
                            Sign up
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignInScreen;