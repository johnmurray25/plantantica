import { getAuth } from 'firebase/auth';
import app from './clientApp';

// Initialize Auth object to be referenced within app
const auth = getAuth(app);

export default auth;