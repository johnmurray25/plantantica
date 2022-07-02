// Import FirebaseAuth and firebase.
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../firebase/clientApp';

const uiConfig = {
    signInSuccessUrl: "/",
    // Popup signin flow rather than redirect flow.
    //signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
    },
};

function SignInScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    if (!isSignedIn) {
        return (
            <div className={classes.container}>
                <h1>My App</h1>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
        );
    }
    return (
        <div className={classes.container}>
            <Link href="/" passHref>
                <h1>Plantantica</h1>
            </Link>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
    );
}

const classes = {
    container: 'bg-green text-yellow min-h-screen',
}

export default SignInScreen;