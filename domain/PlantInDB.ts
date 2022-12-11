import Update from "./Update";

export default interface PlantInDB {
    id: string;
    species: string;
    dateObtained: number;
    daysBetweenWatering: number;
    dateLastWatered: number;
    dateToWaterNext: number;
    dateLastFed?: number;
    dateToFeedNext?: number;
    lightRequired: string | number;
    picture?: string;
    imageUrl?: string;
    dateCreated?: number;
    careInstructions?: string;
    updates?: Update[];
}