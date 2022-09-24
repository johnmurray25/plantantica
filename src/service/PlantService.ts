import { User } from "firebase/auth";
import { collection, deleteDoc, doc, DocumentData, getDocs, query, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import Plant from "../../domain/Plant";

import db from '../firebase/db';
import { deleteImage } from "./FileService";

function userDoc(user: User) {
    return doc(db, 'users', user.uid);
}

function userDocFromUid(uid: string) {
    return doc(db, 'users', uid)
}

function mapDocsToPlants(docs: QueryDocumentSnapshot<DocumentData>[]) {
    return docs.map((doc): Plant => {
        return {
            id: doc.id,
            species: doc.get('species'),
            dateObtained: new Date(doc.get('dateObtained')),
            daysBetweenWatering: doc.get('daysBetweenWatering'),
            dateLastWatered: new Date(doc.get('dateLastWatered')),
            dateToWaterNext: new Date(doc.get('dateToWaterNext')),
            dateLastFed: doc.get('dateLastFed'),
            dateToFeedNext: doc.get('dateToFeedNext'),
            lightRequired: doc.get('lightRequired'),
            dateCreated: new Date(doc.get('dateCreated')),
            picture: doc.get('picture'),
        }
    })
    .map((plant) => {
        // Only assign feeding dates if not null
        if (plant.dateLastFed) {
            plant.dateLastFed = new Date(plant.dateLastFed);
        }
        if (plant.dateToFeedNext) {
            plant.dateToFeedNext = new Date(plant.dateToFeedNext);
        }
        return plant;
    });
}
 
// function mapDocToPlant(doc: QueryDocumentSnapshot<DocumentData>) {
//     let plant = {
//         id: doc.id,
//         species: doc.get('species'),
//         dateObtained: new Date(doc.get('dateObtained')),
//         daysBetweenWatering: doc.get('daysBetweenWatering'),
//         dateLastWatered: new Date(doc.get('dateLastWatered')),
//         dateToWaterNext: new Date(doc.get('dateToWaterNext')),
//         dateLastFed: doc.get('dateLastFed'),
//         dateToFeedNext: doc.get('dateToFeedNext'),
//         lightRequired: doc.get('lightRequired'),
//         dateCreated: new Date(doc.get('dateCreated')),
//         picture: doc.get('picture'),
//     } 
//     if (plant.dateLastFed) {
//         plant.dateLastFed = new Date(plant.dateLastFed);
//     }
//     if (plant.dateToFeedNext) {
//         plant.dateToFeedNext = new Date(plant.dateToFeedNext);
//     }
//     return plant
// }

export const getPlants = async (uid: string): Promise<Plant[]> => {
    if (!uid) {
        return [];
    }
    // Load all plant tracking data for current user
    const collectionRef = collection(userDocFromUid(uid), 'plantTrackingDetails');
    const queryRef = query(collectionRef);
    const trackingDetails = await getDocs(queryRef);
    return mapDocsToPlants(trackingDetails.docs);
};

export const deletePlant = async (plant: Plant, user: User) => {
    if (plant.picture) {
        deleteImage(plant.picture, user)
            .catch(console.error);
    }
    await deleteDoc(doc(collection(userDoc(user), 'plantTrackingDetails'), plant.id));
    console.log('deleted plant');
}

export const migratePlantData = async (user: User) => {
    let userData = userDoc(user)
    if (!user.email) {
        console.error('no email saved for this user.')
        return;
    }
    let oldUserData = doc(db, 'users', user.email)
    let plantDataRef = collection(oldUserData, 'plantTrackingDetails')
    let plantData = await getDocs(plantDataRef)
    let destCol = collection(userData, 'plantTrackingDetails') // destination collection
    plantData.docs.forEach(plant => {
        // add each plant as a new document in updated db document
        let destinationDoc = doc(destCol, plant.id)
        setDoc(destinationDoc, plant.data())
            .then(() => console.log('saved plant document'), console.error)
    })
}