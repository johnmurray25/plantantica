import { getFirestore } from "firebase/firestore";
import firebase from './clientApp';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebase);

export default db;
