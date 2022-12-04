import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDocs, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import Plant from "../domain/Plant";
import Update from "../domain/Update";
import db from '../firebase/db';
import { deleteImage } from "./FileService";
import { docToPlant, docToUpdate } from './DBMappings';

function userDoc(user: User) {
    return doc(db, 'users', user.uid);
}

function userDocFromUid(uid: string) {
    return doc(db, 'users', uid)
}

export const mapDocsToPlants = async (docs: QueryDocumentSnapshot<DocumentData>[]): Promise<Plant[]> => {
    if (!docs || !docs.length) {
        return []
    }
    let uid = docs[0].ref.parent.parent.id;
    // console.log(`uid: ${uid}`);
    const plants = docs.map(docToPlant)
        .map(async (p: Plant) => {
            // Only assign feeding dates if not null
            if (p.dateLastFed) {
                p.dateLastFed = new Date(p.dateLastFed);
            }
            if (p.dateToFeedNext) {
                p.dateToFeedNext = new Date(p.dateToFeedNext);
            }
            p.updates = await getUpdatesForPlant(uid, p.id);
            return p;
        })
        
    return Promise.all(plants);
}

export const getPlants = async (uid: string): Promise<Plant[]> => {
    if (!uid) {
        return [];
    }
    // Load all plant tracking data for current user
    const collectionRef = collection(db, `users/${uid}/plantTrackingDetails`);
    return mapDocsToPlants((await getDocs(collectionRef)).docs);
    // return (await getDocs(collectionRef))
    //         .docs
    //         .map(docToPlant);
};

export const deletePlant = async (plant: Plant, uid: string) => {
    if (plant.picture) {
        deleteImage(plant.picture, uid)
            .catch(console.error);
    }
    await deleteDoc(doc(db, `users/${uid}/plantTrackingDetails/${plant.id}`));
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
            .then(() => console.log('migrated plant document'), console.error)
    })
}

export const getPlantById = async (uid: string, plantId: string): Promise<Plant> => {
    let plants = await getPlants(uid)

    let filtered = plants.filter(p => p.id === plantId)

    if (filtered.length > 0) {
        return filtered[0]
    } else {
        return null
    }
}

//-------------------------------- UPDATES ----------------------------------------------------//
export const getUpdatesForPlant = async (uid: string, plantId: string): Promise<Update[]> => {
    let snapshot = await getDocs(collection(db, `users/${uid}/plantTrackingDetails/${plantId}/updates`))
    return snapshot.docs
        // .map(docToUpdate)
        .map(doc => ({
            image: doc.get('image'),
            title: doc.get('title'),
            description: doc.get('description'),
            dateCreated: new Date(doc.get('dateCreated')),
            id: doc.id,
        }))
        .sort((a, b) => a.dateCreated.getTime() < b.dateCreated.getTime() ? 1 : -1)
}

export const saveUpdateForPlant = async (uid: string, plantId: string, update: Update, id?: string) => {
    console.log(`plantId: ${plantId}`)
    const colRef = collection(db, `users/${uid}/plantTrackingDetails/${plantId}/updates`);

    if (id) {
        setDoc(doc(colRef, id),
            {
                ...update,
                dateCreated: update && update.dateCreated ? update.dateCreated.getTime() : new Date().getTime(),
            },
            { merge: true }
        ).catch(console.error);
    } else {
        addDoc(colRef,
            {
                ...update,
                dateCreated: update && update.dateCreated ? update.dateCreated.getTime() : new Date().getTime(),
            }
        ).catch(console.error);
    }
}

export const waterPlantInDB = async (uid: string, plantId: string, newWateringDateMs: number) => {
    setDoc(
        doc(db, `users/${uid}/plantTrackingDetails/${plantId}`),
        { dateToWaterNext: newWateringDateMs, dateLastWatered: new Date().getTime() },
        { merge: true }
    );
}

export const feedPlantInDB = async (uid: string, plantId: string) => {
    setDoc(
        doc(
            collection(doc(db, 'users', uid), 'plantTrackingDetails'),
            plantId),
        { dateLastFed: new Date().getTime() },
        { merge: true }
    );
}