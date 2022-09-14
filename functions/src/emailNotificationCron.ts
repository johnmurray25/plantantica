import { pubsub } from "firebase-functions/v1"

export const sendEmailNotifications = pubsub.schedule('30 8 * * *')