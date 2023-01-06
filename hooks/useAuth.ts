import auth from '../firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from 'react';
import DBUser from '../domain/DBUser';
import { getUserDBRecord, initializeUser } from '../service/UserService';
import { getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const googleAuthProvider = new GoogleAuthProvider();

const useAuth = () => {
    const [user, loading] = useAuthState(auth)
    const [dBUser, setDBUser] = useState<DBUser>(null)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        if (user) {
            getUserDBRecord(user.uid)
                .then(setDBUser)
                .catch(console.error)
                .finally(() => { setInitialized(true) })
        } else if (!loading) {
            setInitialized(true)
        }
    }, [loading, user])

    const signInWithGoogle = async () => {
        // Log in/Sign up with Firebase Auth 
        try {
            signInWithRedirect(auth, googleAuthProvider).then(() => console.log("signed in with google"))
            const result = await getRedirectResult(auth);
            if (result) {
                // This is the signed-in user
                const user = result.user;
                getUserDBRecord(user.uid)
                    .then(async (u) => {
                        if (!u || !u.email) {
                            await initializeUser(user)  
                            getUserDBRecord(user.uid)
                                .then(setDBUser)
                        } else {
                            setDBUser(u)
                        }
                    })
                    .catch(console.error)
                    .finally(() => { setInitialized(true) })
            }
        } catch (e) {
            console.error(e)
            alert(e.message)
        }
    }

    return {
        user,
        loading,
        dBUser,
        setDBUser,
        initialized,
        signInWithGoogle,
    }
}

export default useAuth