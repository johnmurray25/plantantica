import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import db from '../firebase/db'
import storage from '../firebase/storage'
import useAuth from './useAuth'

const useProfilePicture = () => {

    const [profPicUrl, setProfPicUrl] = useState("")
    const [profPicLoading, setProfPicLoading] = useState(true)
    const [fileName, setFileName] = useState("")

    const { user, dBUser } = useAuth()

    useEffect(() => {
        if (user && dBUser && dBUser.profilePicture) {
            if (!dBUser.profPicUrl) {
                getDownloadURL(ref(storage, `${user.uid}/${dBUser.profilePicture}`))
                    .then((url) => {
                        setProfPicUrl(url)
                        setFileName(dBUser.profilePicture)
                        setDoc(doc(db, `users/${user.uid}`),
                            { profPicUrl: url },
                            { merge: true }
                        )
                    })
                    .finally(() => setProfPicLoading(false))
            } else {
                setFileName(dBUser.profilePicture)
                setProfPicUrl(dBUser.profPicUrl)
                setProfPicLoading(false)
            }
        } else {
            setProfPicLoading(false)
        }
    }, [dBUser, user])

    return {
        profPicUrl,
        setProfPicUrl,
        profPicLoading,
        fileName,
        setFileName
    }
}

export default useProfilePicture