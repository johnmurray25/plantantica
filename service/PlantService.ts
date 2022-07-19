import { User } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import storage from '../firebase/storage';

export const getImageUrl = async (fileName: string, user: User): Promise<string> => {
    let imageUrl = getDownloadURL(ref(storage, `${user.email}/${fileName}`))
        .then(downloadUrl => { return downloadUrl })
        .catch(e => {
            console.debug(e);
            console.error('Failed to load image from storage bucket');
            return '';
        });
    return imageUrl;
}

export const uploadFile = async (file: File, user: User) => {
    let storageRef = ref(storage, `${user.email}/${file.name}`);
    let bytes = await file.arrayBuffer();
    let fileRef = await uploadBytes(storageRef, bytes);
    console.log(`uploaded image: ${fileRef.ref.fullPath}`)
    return fileRef.ref.name;
}
