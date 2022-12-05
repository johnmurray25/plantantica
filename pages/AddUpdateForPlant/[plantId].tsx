import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext';
import Plant from '../../domain/Plant';
import { getPlantById } from '../../service/PlantService';
import AddUpdateForPlant from '../AddUpdateForPlant';

const Home = () => {

    const { user } = useContext(UserContext)

    const router = useRouter();
    const plantId = router.query.plantId;

    const [plant, setPlant] = useState<Plant>(null);

    useEffect(() => {
        if (!user || !plantId) {
            return;
        }
        getPlantById(user.uid, plantId.toString())
            .then(setPlant)
    }, [user, plantId])

    return user && plantId && plant ?
        <AddUpdateForPlant plant={plant} plantId={plantId.toString()} />
        :
        <div>

        </div>
}

export default Home