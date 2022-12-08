import React, { useEffect, useState } from 'react';
import AddPlantTrackingDetails from '../AddPlantTrackingDetails';
import Plant from '../../domain/Plant';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import { getPlantById } from '../../service/PlantService';

const getPlantDetails = async (uid: string, plantId: string | any): Promise<Plant> => {
    try {
        return await getPlantById(uid, plantId);
    } catch (e) {
        alert(e.message)
        console.error(e)
        console.error("Failed to load plant details")
    }
}

const Home = () => {
    const [plant, setPlant] = useState<Plant>();
    const { user } = useAuth()
    const router = useRouter();
    const plantId = router.query.id;

    useEffect(() => {
        if (!user) {
            return;
        }
        getPlantDetails(user.uid, plantId).then(setPlant).catch(console.error);
    }, [user, plantId])

    return (
        <>
            {plant &&
                <AddPlantTrackingDetails {...{ plant }} />
            }
        </>
    )
}

export default Home;