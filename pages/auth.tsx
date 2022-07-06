// Import FirebaseAuth and firebase.
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../firebase/clientApp';
import TreeLogo from './components/TreeLogo';

function SignInScreen(props) {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

    const redirectRef = props.href ? props.href : '';

    const uiConfig = {
        signInSuccessUrl: "/"+redirectRef,
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

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    const authorize = () => {
        const auth = firebase.auth();
        if (!auth.currentUser) {
            console.error('Failed to authorize user')
            return auth;
        }
        console.log(`Authorized user with email: ${auth.currentUser.email}`)
        return auth;
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    return (
        <div className={classes.container}>
            <TreeLogo />
            {isSignedIn ?
                <div>
                    <p>
                        Welcome {firebase.auth().currentUser.displayName}! You are now signed in.
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

const classes = {
    container: 'bg-olive text-yellow min-h-screen text-center pt-10 text-xl',
}

export default SignInScreen;