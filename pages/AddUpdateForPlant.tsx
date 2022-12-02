import { Input } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react'
import ReactLoading from 'react-loading'
import customImageLoader from '../util/customImageLoader';
import FileInput from './components/FileInput';

import styles from "../styles/tracking.module.css";
import { saveUpdateForPlant } from '../service/PlantService';
import { compressImage, deleteImage, uploadFile } from '../service/FileService';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import db from '../firebase/db';
import TextField from './components/TextField';
import Plant from '../domain/Plant';
import { useRouter } from 'next/router';
import GenericDatePicker from './components/GenericDatePicker';
import Update from '../domain/Update';

interface Props {
    plantId: string;
    plant: Plant;
    update?: Update;
    imageUrl?: string;
    updateId?: string;
}

const AddUpdateForPlant: React.FC<Props> = (props) => {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const [selectedFile, setSelectedFile] = useState<File>(null);
    const [imageUrl, setImageUrl] = useState(props.imageUrl ? props.imageUrl : "");
    const [title, setTitle] = useState(props.update ? props.update.title : "")
    const [description, setDescription] = useState(props.update ? props.update.description : "")
    const [dateCreated, setDateCreated] = useState(props.update ? props.update.dateCreated ? props.update.dateCreated : new Date() : new Date())
    const [savingStatus, setSavingStatus] = useState(null);

    const onRemoveFile = () => {
        if (!confirm('Remove the image?')) return;
        // if image was previously saved, delete from storage
        if (props.imageUrl && props.update && props.update.image && user && props.updateId) {
            deleteImage(props.update.image, user.uid)
                .then(() => {
                    setSelectedFile(null)
                    setImageUrl('')
                    setDoc(
                        doc(
                            collection(db, `users/${user.uid}/plantTrackingDetails/${props.plantId}/updates`),
                            props.updateId),
                        { picture: '' },
                        { merge: true }
                    )
                }).catch(console.error);
        }
        // otherwise just remove from UI
        else {
            setSelectedFile(null)
            setImageUrl('')
        }
    }

    const handleSave = async () => {
        let savedFileName = ""
        // Check if image to be processed
        if (imageUrl) {
            // Image was already saved 
            if (!selectedFile && props.update && props.update.image) {
                savedFileName = props.update.image;
            } else {
                try {
                    // Compress image
                    setSavingStatus('Compressing image ')
                    let compressedImage = await compressImage(selectedFile);
                    // Upload image to storage
                    setSavingStatus('Uploading image ')
                    savedFileName = await uploadFile(compressedImage, user);
                    console.log("Saved image " + savedFileName)
                } catch (e) {
                    console.error(e)
                }
            }
        }
        const update: Update = {
            title,
            description,
            dateCreated,
            image: savedFileName,
        }
        let didSave = false;
        if (props.updateId) {
            saveUpdateForPlant(user.uid, props.plantId, update, props.updateId)
                .then(() => {
                    console.log("saved")
                    router.back();
                })
                .catch((e) => {
                    console.error(e)
                    alert("Failed to save. Please try again later")
                })
        } else {
            saveUpdateForPlant(user.uid, props.plantId, update)
                .then(() => {
                    console.log("saved")
                    router.back();
                })
                .catch((e) => {
                    console.error(e)
                    alert("Failed to save. Please try again later")
                });
        }
    }

    return (
        <div className='text-black bg-[#bdc581] min-w-full min-h-screen' >
            {savingStatus ?
                <div className='flex justify-center items-center pt-60' >
                    {savingStatus} < ReactLoading type='bars' color="#fff" />
                </div>
                :
                <div>
                    <div className={styles.title}>
                        <a className='pt-20 '>
                            Add Update for {props.plant ? props.plant.species : 'plant'}
                        </a>
                    </div>
                    <div className='flex flex-col items-center m-auto p-4 '>
                        <div className='absolute min-h-100 top-50'>
                            <div>
                                <div className="flex justify-center m-auto ">
                                    {imageUrl ?
                                        <div>
                                            <Image src={imageUrl} loader={customImageLoader} alt='photo of plant' width='150' height='190' />
                                            <a className='absolute top-2 right-32 bg-stone-100 text-green cursor-pointer border border-red-700 rounded mb-24 p-1 text-xs'
                                                onClick={onRemoveFile} >
                                                &#10060;
                                            </a>
                                        </div>
                                        :
                                        <FileInput
                                            onAttachFile={(e) => {
                                                let f = e.target.files[0]
                                                setSelectedFile(f);
                                                setImageUrl(URL.createObjectURL(f))
                                            }}
                                            onRemoveFile={onRemoveFile}
                                            message='Add image? &nbsp; &#128247;'
                                        />
                                    }
                                </div>
                                <div className='grid grid-cols-2 gap-x-2 gap-y-6 m-7 items-center' >
                                    <label htmlFor='species'>
                                        Title:
                                    </label>
                                    <Input
                                        className={styles.input}
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder=""
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required={true}
                                    />
                                </div>
                                <div className='grid grid-cols-2 gap-x-2 gap-y-6 m-7 items-center pr-10' >
                                    <label htmlFor='species'>
                                        Description
                                    </label>
                                    <TextField
                                        placeholder=''
                                        value={description}
                                        onChange={setDescription}
                                        textarea={true}
                                        width={40}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-x-2 gap-y-6 m-7 items-center px-10 w-fit">
                                    <GenericDatePicker
                                        label='Date'
                                        value={dateCreated}
                                        onSelect={(d: Date) => {
                                            setDateCreated(d)
                                        }}
                                    />
                                </div>
                                <div className='flex justify-center'>
                                    <button
                                        className="bg-green text-lightGrayGreen py-2.5 rounded px-7 mt-4 mx-8"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AddUpdateForPlant