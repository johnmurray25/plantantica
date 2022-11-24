import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuthState } from 'react-firebase-hooks/auth';
import { browserLocalPersistence } from 'firebase/auth';
import ReactLoading from "react-loading";

import auth from '../firebase/auth';
import useWindowDimensions from '../hooks/useWindowDimensions';
import SignInWithGoogleButton from './components/SignInWithGoogleButton';
import TreeLogo from './components/TreeLogo';

// const fbAuthProvider = new FacebookAuthProvider();

// const signInWithFacebook = (width: number) => {
//     width <= 650 ? signInWithRedirect(auth, fbAuthProvider) : signInWithPopup(auth, fbAuthProvider);
// }

const signOut = () => {
    auth.signOut();
}

function SignInScreen() {
    const [user, loading, error] = useAuthState(auth);
    const { width } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        auth.setPersistence(browserLocalPersistence)
            .then(() => setIsLoading(false))
            .catch(console.error);
    }, [user])

    
    return (
        <div className='text-yellow min-h-screen text-center pt-10 text-xl' id='firebaseui-auth-container' >
            {isLoading || loading ?
                <div className='flex justify-center items-center pt-40'>
                    <ReactLoading type='bars' color="#fff" />
                </div>
                :
                (<div>
                    <Link href='/' passHref>
                        <div>
                            <TreeLogo height={140} width={375} />
                        </div>
                    </Link>

                    {user ?
                        <div>
                            <p>
                                Welcome {user.displayName}! You are now signed in.
                            </p>
                            <a onClick={signOut}>
                                Sign out
                            </a>
                        </div>
                        :
                        <div className='flex flex-col items-center justify-center'>
                            <p>Please sign in:</p>
                            <SignInWithGoogleButton />
                            {/* <button className='flex flex-row justify-evenly items-center bg-[#3B5998] text-white font-sans font-semibold px-2 py-3 m-2 text-sm  w-52 rounded-sm' >
                                <Image alt="Google logo" loader={customImageLoader} src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" width={17} height={17} />
                                Sign in with Facebook
                            </button> */}
                        </div>
                    }
                </div>)
            }
        </div >
    );
}

export default SignInScreen;