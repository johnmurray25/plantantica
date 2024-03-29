import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import Plant from "../domain/Plant";
import Update from "../domain/Update";
import db from '../firebase/db';
import { deleteImage, getImageUrl } from "./FileService";
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
            const res = p;
            // Only assign feeding dates if not null
            if (p.dateLastFed) {
                res.dateLastFed = new Date(p.dateLastFed);
            }
            if (p.dateToFeedNext) {
                res.dateToFeedNext = new Date(p.dateToFeedNext);
            }
            if (!p.imageUrl && p.picture) {
                console.log("Getting imageUrl")
                try {
                    const downloadUrl = await getImageUrl(p.picture, uid);
                    res.imageUrl = downloadUrl
                    setDoc(doc(db, `users/${uid}/plantTrackingDetails/${p.id}`),
                        {
                            imageUrl: downloadUrl
                        },
                        {
                            merge: true,
                        }
                    ).then(() => console.log("Saved imageUrl to DB"))
                } catch (e) {
                    console.error(e)
                }
            } 
            // res.updates = await getUpdatesForPlant(uid, p.id);
            return res;
        })

    return Promise.all(plants);
}

export const getPlants = async (uid: string): Promise<Plant[]> => {
    if (!uid) {
        return [];
    }
    // Load all plant tracking data for current user
    const collectionRef = collection(db, `users/${uid}/plantTrackingDetails`);

    const docs = (await getDocs(collectionRef)).docs
    const plants = await mapDocsToPlants(docs)
    return Promise.all(plants)
};

export const deletePlantInDB= async (plant: Plant, uid: string) => {
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
    const plantDoc = doc(db, `users/${uid}/plantTrackingDetails/${plantId}`);
    return docToPlant(await getDoc(plantDoc));
}

export const updateDaysBetweenWatering = async (uid: string, plantId: string, n: number, waterNextMs: number) => {
    const plantDoc = doc(db, `users/${uid}/plantTrackingDetails/${plantId}`);
    try {
        setDoc(plantDoc,
            {
                daysBetweenWatering: n,
                dateToWaterNext: waterNextMs,
            }
            , { merge: true })
    } catch (e) {
        console.error(`Failed to update daysBetweenWatering: ${e.message}`);
    }
}

//-------------------------------- UPDATES ----------------------------------------------------//
export const getUpdatesForPlant = async (uid: string, plantId: string): Promise<Update[]> => {
    let snapshot = await getDocs(collection(db, `users/${uid}/plantTrackingDetails/${plantId}/updates`))
    if (!snapshot.size) {
        return []
    }
    console.log(`Reading ${snapshot.size} updates for plant ${plantId}`)
    const promises = snapshot.docs
        .map(docToUpdate)
        .map(async (update): Promise<Update> => {
            if (update?.image) {
                return {
                    ...update,
                    imageUrl: await getImageUrl(update.image, uid)
                }
            }
        })
    const updates = await Promise.all(promises)
    return updates.sort((a, b) => a.dateCreated.getTime() < b.dateCreated.getTime() ? 1 : -1)
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

export const deleteUpdatePictureInDB = (uid: string, plantId: string, updateId: string) => {
    setDoc(
        doc(db, `users/${uid}/plantTrackingDetails/${plantId}/updates/${updateId}`),
        { picture: '' },
        { merge: true }
    )
}