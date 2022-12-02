import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase/auth'

const useAuthRedirect = () => {
    const router = useRouter()
    const [user, loading] = useAuthState(auth);
    const [signedIn, setSignedIn] = useState(false)

    useEffect(() => {
        if (!user && !loading) {
            setSignedIn(false)
            router.push("/auth")
        }
        if (user) {
            setSignedIn(true)
        }
    }, [loading, router, user])

    return { signedIn }
}

export default useAuthRedirect