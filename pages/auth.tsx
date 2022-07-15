// Import FirebaseAuth and firebase.
import React from 'react';
import auth from '../firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TreeLogo from './components/TreeLogo';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';

function SignInScreen(props) {
    // const [isSignedIn, setIsSignedIn] = useState(auth.currentUser ? true : false); 
    const [user] = useAuthState(auth);

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

    const authorize = () => {
        if (!user) {
            return auth;
        }
        console.log(`Authorized user with email: ${user.email}`)
        return auth;
    }

    const signOut = () => {
        auth.signOut();
    }

    return (
        <div className='bg-green text-yellow min-h-screen text-center pt-10 text-xl'>
            <TreeLogo />
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