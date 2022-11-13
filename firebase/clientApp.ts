import { initializeApp } from "firebase/app";

// Configure Firebase
const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseUrl: process.env.NEXT_PUBLIC_FIRESTORE_URL,
}

console.log('db url: ' + config.databaseUrl)
// Initialize app
const app = initializeApp(config);

console.debug('initialized firebase app')

// Reference this object, containing app-specific configuration, throughout the codebase
export default app;
