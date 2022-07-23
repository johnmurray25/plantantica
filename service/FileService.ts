import imageCompression from "browser-image-compression";
import { User } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";

import storage from "../firebase/storage";

export const compressImage = async (imageFile: File) => {
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    }

    try {
        const compressedFile = await imageCompression(imageFile, options);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
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
