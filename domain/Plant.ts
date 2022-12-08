import Update from "./Update";

export default interface Plant {
    id: string;
    species: string;
    dateObtained: Date;
    daysBetweenWatering: number;
    dateLastWatered: Date;
    dateToWaterNext: Date;
    dateLastFed?: Date;
    dateToFeedNext?: Date;
    lightRequired: string | number;
    picture?: string;
    imageUrl?: string;
    dateCreated?: Date;
    careInstructions?: string;
    updates?: Update[];
}