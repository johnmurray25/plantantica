import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import app from './clientApp';

// Initialize Cloud Firestore and get a reference to the service
console.log("initializing db")
const before = new Date().getTime();
const db = getFirestore(app);
const after = new Date().getTime();
console.log(`initialized db in ${after-before} ms`);

// if (process?.env?.NODE_ENV === 'development') { 
//     const before = new Date().getTime()
//     connectFirestoreEmulator(db, '127.0.0.1', 8080)
//     const after = new Date().getTime()
//     console.log(`connected to firestore emulator in ${after-before} ms`)
// }

export default db;
