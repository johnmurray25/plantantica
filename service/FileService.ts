import imageCompression from "browser-image-compression";
import { User } from "firebase/auth";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import storage from "../src/firebase/storage";

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
    let storageRef = ref(storage, `${user.email}/${file.name}`);
    let bytes = await file.arrayBuffer();
    let fileRef = await uploadBytes(storageRef, bytes);
    console.log(`uploaded image: ${fileRef.ref.fullPath}`)
    return fileRef.ref.name;
}

export const deleteImage = async (fileName: string, user: User) => {
    const imgRef = ref(storage, `${user.email}/${fileName}`);
    await deleteObject(imgRef);
    console.log('Deleted image from bucket')
}