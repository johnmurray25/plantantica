import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import app from './clientApp';

// Initialize Auth object to be referenced within app
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export default auth;