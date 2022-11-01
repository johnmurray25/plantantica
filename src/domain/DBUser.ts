import Plant from "./Plant";

export default interface DBUser {
    plantTrackingDetails?: Plant[];
    profilePicture: string;
    email: string;
    username?: string;
    displayName?: string;
    dailyEmails?: boolean;
}