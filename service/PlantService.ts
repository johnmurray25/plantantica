import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Plant from "../domain/Plant";

import db from '../firebase/db';
import storage from '../firebase/storage';

export const getImageUrl = async (fileName: string, user: User): Promise<string> => {
    let imageUrl = getDownloadURL(ref(storage, `${user.email}/${fileName}`))
        .then(downloadUrl => { return downloadUrl })
        .catch(e => {
            console.debug(e);
            console.error('Failed to load image from storage bucket');
            return '';
        });
    return imageUrl;
}

export const uploadFile = async (file: File, user: User) => {
    let storageRef = ref(storage, `${user.email}/${file.name}`);
    let bytes = await file.arrayBuffer();
    let fileRef = await uploadBytes(storageRef, bytes);
    console.log(`uploaded image: ${fileRef.ref.fullPath}`)
    return fileRef.ref.name;
}

export const getPlants = async (user: User) => {
    try {
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
    } catch (error) {
        console.error(error);
        console.error("Failed to fetch plant tracking details");
        throw error;
    }
};

export const deletePlant = async (plant: Plant, user: User) => {
    confirm(`Delete ${plant.species}?`);
    await deleteDoc(doc(collection(doc(db, 'users', user.email), 'plantTrackingDetails'), plant.id));
    console.log('deleted plant');
}