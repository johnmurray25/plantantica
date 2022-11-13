import { connectAuthEmulator, getAuth } from 'firebase/auth';
import app from './clientApp';

// Initialize Auth object to be referenced within app
const auth = getAuth(app);

// we don't need auth emulator (for now at least)
// if (process.env.NODE_ENV === 'development') {
//     connectAuthEmulator(auth, 'localhost:')
// }

export default auth;