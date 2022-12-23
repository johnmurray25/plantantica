import { useCallback, useEffect, useState } from 'react'
import Plant from '../domain/Plant';
import { deletePlantInDB, getPlants } from '../service/PlantService';
import useAuth from './useAuth';

const usePlants = () => {
    const [plants, setPlants] = useState<Plant[]>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth()

    const deletePlant = (plant: Plant) => {
        deletePlantInDB(plant, user.uid)
            .then(() => setPlants(plants.filter(p => p.id !== plant.id)))
            .catch(e => {
                console.error(e)
                alert('Failed to delete plant. Please try again later')
            })
    }

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


    return { plants, setPlants, isLoading, deletePlant }
}

export default usePlants