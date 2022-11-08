/* eslint-disable linebreak-style */
import {QueryDocumentSnapshot} from "firebase-functions/v1/firestore";
import Plant from "../src/domain/Plant";
import PlantInDB from "../src/domain/PlantInDB";

export const docToPlant = (doc: QueryDocumentSnapshot): Plant => {
  const data = doc.data() as PlantInDB;
  return {
    id: doc.id,
    species: data.species,
    dateObtained: new Date(data.dateObtained),
    daysBetweenWatering: data.daysBetweenWatering,
    dateLastWatered: new Date(data.dateLastWatered),
    dateToWaterNext: new Date(data.dateToWaterNext),
    dateLastFed: data.dateLastFed ? new Date(data.dateLastFed) : undefined,
    dateToFeedNext: data.dateToFeedNext ?
        new Date(data.dateToFeedNext) : undefined,
    lightRequired: data.lightRequired,
    dateCreated: data.dateCreated ? new Date(data.dateCreated) : undefined,
    picture: data.picture,
    careInstructions: data.careInstructions,
  };
};

export const docToUser = (docSnap: QueryDocumentSnapshot) => {
  const data = docSnap.data();
  return {
    profilePicture: data.profilePicture,
    email: data.email ? data.email : docSnap.id,
    username: data.username,
    displayName: data.displayName,
    dailyEmails: data.dailyEmails,
  };
};
