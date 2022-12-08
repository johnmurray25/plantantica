import auth from '../firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from 'react';
import DBUser from '../domain/DBUser';
import { getUserDBRecord } from '../service/UserService';

const useAuth = () => {
    const [user, loading] = useAuthState(auth)
    const [dBUser, setDBUser] = useState<DBUser>(null)

    useEffect(() => {
        if (user) {
            getUserDBRecord(user.uid)
                .then(setDBUser)
                .catch(console.error)
        }
    }, [user])

    return {
        user,
        loading,
        dBUser,
        setDBUser,
    }
}

export default useAuth