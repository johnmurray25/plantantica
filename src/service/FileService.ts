import imageCompression from "browser-image-compression";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

import db from "../firebase/db";
import storage from "../firebase/storage";

let handleEr = (e) => {
    console.debug(e);
    console.error('Failed to load image from storage bucket');
    return '';
}

export const getImageUrl = async (fileName: string, uid: string): Promise<string> => {
    let imageUrl = getDownloadURL(ref(storage, `${uid}/${fileName}`))
        .then(downloadUrl => { return downloadUrl }, handleEr)
        .catch(handleEr);
    return imageUrl;
}

export const compressImage = async (imageFile: File) => {
    console.log(`original file size: ${imageFile.size / 1024 / 1024} MB`);

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    }

    try {
        const compressedFile = await imageCompression(imageFile, options);
        console.log(`compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
        return compressedFile;
    }
    catch (error) {
        console.log(error);
    }
}

export const createFileFromUrl = async (url: string, fileName: string, defaultType = 'image/jpeg') => {
    let response = await fetch(url);
    let data = await response.blob();
    return new File([data], fileName, {
        type: data.type || defaultType,
    });
}

export const uploadFile = async (file: File, user: User) => {
    let fileName = uuidv4();
    let storageRef = ref(storage, `${user.uid}/${fileName}`);
    let bytes = await file.arrayBuffer();
    let fileRef = await uploadBytes(storageRef, bytes);
    console.log(`uploaded image: ${fileRef.ref.fullPath}`)
    return fileRef.ref.name;
}

export const deleteImage = async (fileName: string, user: User) => {
    const imgRef = ref(storage, `${user.uid}/${fileName}`);
    await deleteObject(imgRef);
    console.log('Deleted image from bucket')
}

export const updateProfilePicture = async (fileName: string, uid: string) => {
    let userDocRef = doc(db, 'users', uid)
    setDoc(userDocRef, { profilePicture: fileName }, { merge: true })
        .catch(console.error)
}

export const getProfilePictureUrl = async (uid: string): Promise<{ url: Promise<string>, fileName: string }> => {
    let userDoc = await getDoc(doc(db, 'users', uid))
    let fileName = userDoc.get('profilePicture')
    if (!fileName)
        return { url: null, fileName: '' }
    let imageUrl = getDownloadURL(ref(storage, `${uid}/${fileName}`))
        .then(downloadUrl => { return downloadUrl })
        .catch(e => {
            console.debug(e);
            console.error('Failed to load image from storage bucket');
            return '';
        });
    return { url: imageUrl, fileName };
}

// export const migratePhotos = (user) => {
//     let oldDir = ref(storage, user.email)
//     listAll(oldDir)
//         .then(images => {
//             images.items.forEach(image => {
//                 let fileName = image.name;
//                 uploadFile(image)
//             })
//         }, console.error)
// }