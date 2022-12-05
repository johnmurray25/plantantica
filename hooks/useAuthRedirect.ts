import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'

const useAuthRedirect = () => {
    const router = useRouter()
    const { user, loading } = useContext(UserContext)
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