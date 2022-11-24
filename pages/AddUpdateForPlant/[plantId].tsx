import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import Plant from '../../domain/Plant';
import auth from '../../firebase/auth';
import { getPlantById } from '../../service/PlantService';
import AddUpdateForPlant from '../AddUpdateForPlant';

const Home = () => {

    const [user] = useAuthState(auth);

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