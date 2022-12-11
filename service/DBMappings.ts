import { QueryDocumentSnapshot } from "firebase/firestore";
import Plant from "../domain/Plant";
import PlantInDB from "../domain/PlantInDB";

export const docToPlant = (doc: QueryDocumentSnapshot): Plant => {
    let data = doc.data() as PlantInDB;
    return {
        id: doc.id,
        species: data.species,
        dateObtained: new Date(data.dateObtained),
        daysBetweenWatering: data.daysBetweenWatering,
        dateLastWatered: new Date(data.dateLastWatered),
        dateToWaterNext: new Date(data.dateToWaterNext),
        dateLastFed: data.dateLastFed ? new Date(data.dateLastFed) : null,
        dateToFeedNext: data.dateToFeedNext ? new Date(data.dateToFeedNext) : null,
        lightRequired: data.lightRequired,
        dateCreated: new Date(data.dateCreated),
        picture: data.picture,
        imageUrl: data.imageUrl,
        careInstructions: data.careInstructions,
    }
}

export const docToUpdate = (doc) => {
    const data = doc.data()
    return {
        image: data.image,
        title: data.title,
        description: data.description,
        dateCreated: new Date(data.dateCreated),
        id: doc.id,
    }
}

export const docToUser = (docSnap) => {
    if (!docSnap) {
        console.log("no doc")
        return;
    }
    const data = docSnap.data()
    if (!data) {
        return null
    }
    return {
        profilePicture: data.profilePicture,
        profPicUrl: data.profPicUrl,
        email: data.email ? data.email : docSnap.id,
        username: data.username,
        displayName: data.displayName,
        dailyEmails: data.dailyEmails,
        following: data.following,
    }
}