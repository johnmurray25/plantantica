import { useCallback, useEffect, useState } from 'react'
import Plant from '../domain/Plant';
import { getPlants } from '../service/PlantService';
import useAuth from './useAuth';

const usePlants = () => {
    const [plants, setPlants] = useState<Plant[]>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth()

    const loadPlants = useCallback(async () => {
        if (!user || plants || !isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            console.log("Fetching plants")
            const res = await getPlants(user.uid)
            setPlants(res)
        } catch (e) {
            console.error(e)
            console.error("Failed to load plants")
        } finally {
            setIsLoading(false)
            // console.log("finished loading plants")
        }
    }, [isLoading, plants, user])

    useEffect(() => {
        loadPlants();
    }, [loadPlants])


    return { plants, setPlants, isLoading }
}

export default usePlants