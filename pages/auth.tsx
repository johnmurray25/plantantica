// Import FirebaseAuth and firebase.
import React from 'react';
import auth from '../firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TreeLogo from './components/TreeLogo';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import Link from 'next/link';
import { browserLocalPersistence } from 'firebase/auth';

function SignInScreen(props) {
    // const [isSignedIn, setIsSignedIn] = useState(auth.currentUser ? true : false); 
    const [user] = useAuthState(auth);

    const redirectRef = props.href ? props.href : '';

    const uiConfig = {
        signInSuccessUrl: "/index",
        // Popup signin flow rather than redirect flow.
        //signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            //firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // // Avoid redirects after sign-in.
            // signInSuccessWithAuthResult: () => false,
        },
    };

    const authorize = async () => {
        await auth.setPersistence(browserLocalPersistence);
        return auth;
    }

    const signOut = () => {
        auth.signOut();
    }

    return (
        <div className='bg-green text-yellow min-h-screen text-center pt-10 text-xl'>
            <Link href='/' passHref>
                <div>
                    <TreeLogo />
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
                <div >
                    <p>Please sign in:</p>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={authorize()} />
                </div>
            }
        </div>
    );
}

export default SignInScreen;