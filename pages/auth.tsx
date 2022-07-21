import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuthState } from 'react-firebase-hooks/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { browserLocalPersistence, EmailAuthProvider, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import ReactLoading from "react-loading";

import auth from '../firebase/auth';
import TreeLogo from './components/TreeLogo';
import useWindowDimensions from '../hooks/useWindowDimensions';

function SignInScreen() {
    const [user, loading, error] = useAuthState(auth);
    const { width } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        auth.setPersistence(browserLocalPersistence)
            .then(() => setIsLoading(false));
    }, [loading, user])

    const uiConfig = {
        signInSuccessUrl: "/",
        signInFlow: width <= 650 ? 'redirect' : 'popup',
        signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            FacebookAuthProvider.PROVIDER_ID,
        ],
    };

    const signOut = () => {
        auth.signOut();
    }

    return (
        <div className='bg-green text-yellow min-h-screen text-center pt-10 text-xl' id='firebaseui-auth-container' >
            {isLoading || loading ?
                <div className='flex justify-center items-center pt-40'>
                    <ReactLoading type='bars' color="#fff" />
                </div>
                :
                (<div>
                    <Link href='/' passHref>
                        <div>
                            <TreeLogo />
                        </div>
                    </Link>

                    {user && uiConfig ?
                        <div>
                            <p>
                                Welcome {user.displayName}! You are now signed in.
                            </p>
                            <a onClick={signOut}>
                                Sign out
                            </a>
                        </div>
                        :
                        <div>
                            <p>Please sign in:</p>
                            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                        </div>
                    }
                </div>)
            }
        </div >
    );
}

export default SignInScreen;