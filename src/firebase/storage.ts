import { getStorage } from "firebase/storage";
import app from './clientApp';

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export default storage;