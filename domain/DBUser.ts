import Plant from "./Plant";

export default interface DBUser {
    plantTrackingDetails?: Plant[];
    profilePicture?: string;
    profPicUrl?: string;
    email: string;
    username?: string;
    displayName?: string;
    dailyEmails?: boolean;
    following?: string[];
    dateCreated?: number;
}