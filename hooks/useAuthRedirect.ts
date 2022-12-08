import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useAuth from './useAuth'

const useAuthRedirect = () => {
    const router = useRouter()
    const { user, loading } = useAuth()
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