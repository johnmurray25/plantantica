import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import db from '../../firebase/db';
import auth from '../../firebase/auth';
import AddPlantTrackingDetails from '../AddPlantTrackingDetails';
import Plant from '../domain/Plant';
import { collection, doc, DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';

const getPlantDetails = async (id: string | any, user: User) => {
    let docRef: DocumentReference<DocumentData> = null;
    console.log(`User: ${user.email}`);
    console.log(`Id: ${id}`);
    try {
        let collectionRef = collection(doc(db, 'users', user.email), 'plantTrackingDetails');
        if (!collectionRef) { console.error('NO COLLECTION FOUND')}
        docRef = doc(collectionRef, id);
    } catch (e) { console.error(e); }
    if (!docRef) {
        return;
    }
    try {
        let d = await getDoc(docRef);
        return {
            id: d.id,
            species: d.get('species'),
            dateObtained: new Date(d.get('dateObtained')),
            daysBetweenWatering: d.get('daysBetweenWatering'),
            dateLastWatered: new Date(d.get('dateLastWatered')),
            dateToWaterNext: new Date(d.get('dateToWaterNext')),
            dateLastFed: new Date(d.get('dateLastFed')),
            dateToFeedNext: new Date(d.get('dateToFeedNext')),
            lightRequired: d.get('lightRequired'),
            dateCreated: new Date(d.get('dateCreated'))
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}

const Home = () => {
    const [plant, setPlant]: [Plant, Dispatch<SetStateAction<Plant>>] = useState();
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    const plantId = router.query.id;

    useEffect(() => {
        if (!user) {
            return;
        }
        getPlantDetails(plantId, user)
            .then(p => setPlant(p))
            .catch(e => {
                console.error(e);
            });
    }, [user, plantId])

    return (
        <AddPlantTrackingDetails plant={plant} />
    )
}

export default Home;