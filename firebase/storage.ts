import { connectStorageEmulator, getStorage } from "firebase/storage";
import app from './clientApp';

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// if (process?.env?.NODE_ENV === 'development') { 
//     const before = new Date().getTime()
//     connectStorageEmulator(storage, '127.0.0.1', 9199);
//     const after = new Date().getTime()
//     console.log(`connected to storage emulator in ${after-before} ms`)
// }

export default storage;