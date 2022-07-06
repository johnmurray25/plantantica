import { getFirestore } from "firebase/firestore";
import firebase from './clientApp';

const app = firebase.app();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
