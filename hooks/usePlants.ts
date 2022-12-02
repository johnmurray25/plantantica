import { useCallback, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import Plant from '../domain/Plant';
import auth from '../firebase/auth';
import { getPlants } from '../service/PlantService';

const usePlants = () => {
    const [plants, setPlants] = useState<Plant[]>(null);
  const [isLoading, setIsLoading] = useState(true);
    const [user] = useAuthState(auth)

    const loadPlants = useCallback(async () => {
        if (!user) {
            return;
        }
        setIsLoading(true);
        // console.log("Loading plants...")
        try {
            const res = await getPlants(user.uid)
            setPlants(res)
        } catch (e) {
            console.error(e)
            // setStatus(ERR_STATUS)
        } finally {
            setIsLoading(false)
            // console.log("finished loading plants")
        }
    }, [user])

    useEffect(() => {
        if (plants === null && user) {
            loadPlants();
        }
    }, [loadPlants, plants, user])


    return { plants, isLoading }
}

export default usePlants