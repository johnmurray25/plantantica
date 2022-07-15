import { getAuth } from 'firebase/auth';
import firebase from './clientApp';

// Initialize Auth object to be referenced within app
const auth = getAuth(firebase);

export default auth;