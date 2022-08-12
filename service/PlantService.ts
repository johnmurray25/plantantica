import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import Plant from "../domain/Plant";

import db from '../src/firebase/db';
import { deleteImage } from "./FileService";

export const getPlants = async (user: User): Promise<Plant[]> => {
    if (!user) return;
    // Load all plant tracking data for current user
    const collectionRef = collection(doc(db, 'users', user.email), 'plantTrackingDetails');
    const queryRef = query(collectionRef);
    const trackingDetails = await getDocs(queryRef);
    return trackingDetails.docs
        .map((doc): Plant => {
            return {
                id: doc.id,
                species: doc.get('species'),
                dateObtained: new Date(doc.get('dateObtained')),
                daysBetweenWatering: doc.get('daysBetweenWatering'),
                dateLastWatered: new Date(doc.get('dateLastWatered')),
                dateToWaterNext: new Date(doc.get('dateToWaterNext')),
                dateLastFed: new Date(doc.get('dateLastFed')),
                dateToFeedNext: new Date(doc.get('dateToFeedNext')),
                lightRequired: doc.get('lightRequired'),
                dateCreated: new Date(doc.get('dateCreated')),
                picture: doc.get('picture'),
            }
        });
};

export const deletePlant = async (plant: Plant, user: User) => {
    if (plant.picture) {
        deleteImage(plant.picture, user)
            .catch(console.error);
    }
    await deleteDoc(doc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plant.id));
    console.log('deleted plant');
}