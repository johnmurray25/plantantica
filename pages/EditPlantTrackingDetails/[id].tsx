import React, { useContext, useEffect, useState } from 'react';
import db from '../../firebase/db';
import AddPlantTrackingDetails from '../AddPlantTrackingDetails';
import Plant from '../../domain/Plant';
import { collection, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import UserContext from '../../context/UserContext';

const getPlantDetails = async (id: string | any, user: User) => {
    let docRef: DocumentReference<DocumentData> = null;
    try {
        let collectionRef = collection(doc(db, 'users', user.uid), 'plantTrackingDetails');
        if (!collectionRef) { console.error('NO COLLECTION FOUND') }
        docRef = doc(collectionRef, id);
    } catch (e) { console.error(e); }
    if (!docRef) {
        return;
    }
    let d: DocumentSnapshot = null;
    try {
        d = await getDoc(docRef);
    } catch (e) {
        console.error(e);
        throw e;
    }
    if (!d) {
        return null;
    }
    const result: Plant = {
        id: d.id,
        species: d.get('species'),
        dateObtained: new Date(d.get('dateObtained')),
        daysBetweenWatering: d.get('daysBetweenWatering'),
        dateLastWatered: new Date(d.get('dateLastWatered')),
        dateToWaterNext: new Date(d.get('dateToWaterNext')),
        lightRequired: d.get('lightRequired'),
        dateCreated: new Date(d.get('dateCreated')),
        picture: d.get('picture'),
        careInstructions: d.get('careInstructions')
    };
    const dlf = d.get('dateLastFed');
    if (dlf) {
        result.dateLastFed = new Date(dlf)
    }
    const dtfn = d.get('dateToFeedNext');
    if (dtfn) {
        result.dateToFeedNext = new Date(dtfn)
    }
    return result;
}

const Home = () => {
    const [plant, setPlant] = useState<Plant>();
    const { user } = useContext(UserContext)
    const router = useRouter();
    const plantId = router.query.id;

    useEffect(() => {
        if (!user) {
            return;
        }
        getPlantDetails(plantId, user).then(setPlant).catch(console.error);
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