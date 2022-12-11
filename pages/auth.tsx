import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';

import auth from '../firebase/auth';
import SignInWithGoogleButton from './components/SignInWithGoogleButton';
import TreeLogo from './components/TreeLogo';
import TextField from './components/TextField';
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
        if (user) {
            router.push('/profile');
        }
        document.addEventListener('keydown', handleKeyPress)
        auth.setPersistence(browserLocalPersistence)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress, router, user])

    return (
        <div className='antialiased text-stone-200 min-h-screen text-center pt-10 text-xl' id='firebaseui-auth-container' >
                <div className='w-screen flex justify-center pb-6'>
                    <Link href='/' passHref>
                        <span className='cursor-pointer '>
                            <TreeLogo height={140} width={375} />
                        </span>
                    </Link>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <p className='pb-4'>
                        Please sign in:
                    </p>
                    <TextField
                        onChange={setIdentifier}
                        value={identifier}
                        width={150}
                        placeholder="Username or email"
                    />
                    <TextField
                        onChange={setPassword}
                        value={password}
                        width={150}
                        placeholder="Password"
                        type='password'
                    />
                    <div className="flex items-center">
                        <Link href='/ResetPassword'
                            className='text-sm text-stone-300 -translate-x-2 cursor-pointer hover:text-lime-300'
                        >
                            Forgot password?
                        </Link>
                        <button className='bg-lime-700 text-zinc-100 px-4 py-2 w-28 rounded
                                            text-center translate-x-2 hover:bg-lime-400 hover:text-brandGreen'
                            onClick={() => signIn(identifier, password)}
                        >
                            &rarr;
                        </button>
                    </div>
                    <p className='text-sm text-right pb-6 pt-2'>
                        Don&apos; have an account yet? &nbsp;
                        <Link href="/SignUp" passHref>
                            <span className='text-lime-400 cursor-pointer hover:underline'>
                                Sign up
                            </span>
                        </Link>
                    </p>
                    <div className='border border-b-stone-600 border-t-0 border-x-0 w-1/3'>
                    </div>
                    <div className="pt-6 pb-2">
                        Or (recommended):
                    </div>
                    <SignInWithGoogleButton />
                </div>
        </div>
    );
}

export default SignInScreen;