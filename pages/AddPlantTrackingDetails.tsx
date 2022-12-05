import React, { FC, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { collection, addDoc, doc, setDoc, DocumentReference, DocumentData } from "firebase/firestore";
import ReactLoading from 'react-loading'

import db from '../firebase/db';
import Plant from "../domain/Plant";
import FileInput from "./components/FileInput";
import Image from "next/image";
import { compressImage, uploadFile, getImageUrl, deleteImage } from "../service/FileService";
import GenericDatePicker from "./components/GenericDatePicker";
import customImageLoader from "../util/customImageLoader";
import TextField from "./components/TextField";
import UserContext from "../context/UserContext";

const MILLIS_IN_DAY = 86400000;

interface Props {
  plant?: Plant,
}

const AddPlantTrackingDetails: FC<Props> = (props) => {
  const router = useRouter();
  const { user } = useContext(UserContext)
  const todaysDate = new Date();

  const [plant] = useState<Plant>(props.plant);
  const [species, setSpecies] = useState(plant ? plant.species : "");
  const [dateObtained, setDateObtained] = useState(plant ? plant.dateObtained : todaysDate);
  const [daysBetweenWatering, setDaysBetweenWatering] = useState(plant ? plant.daysBetweenWatering : 7);
  const [dateLastWatered, setDateLastWatered] = useState(plant ? plant.dateLastWatered : null);
  const [dateToWaterNext, setDateToWaterNext] = useState(plant ? plant.dateToWaterNext : null); //new Date(todaysDate.getTime() + daysBetweenWatering * MILLIS_IN_DAY));
  const [dateLastFed, setDateLastFed] = useState(plant ? plant.dateLastFed : null);
  const [dateToFeedNext, setDateToFeedNext] = useState(plant ? plant.dateToFeedNext : null);
  const [lightRequired, setLightRequired] = useState(plant ? plant.lightRequired : 2);
  const [careInstructions, setCareInstructions] = useState(plant ? plant.careInstructions : '');

  const [selectedFile, setSelectedFile] = useState<File>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(null);

  useEffect(() => {
    if (imageUrl === '' && user && plant && plant.picture) {
      getImageUrl(plant.picture, user.uid)
        .then(s => setImageUrl(s))
    }
    if (dateLastWatered) {
      setDateToWaterNext(new Date(dateLastWatered.getTime() + daysBetweenWatering * MILLIS_IN_DAY));
    }
  }, [plant, imageUrl, selectedFile, user, dateLastWatered, daysBetweenWatering]);

  const savePlantTrackingDetails = async (event) => {
    event.preventDefault();
    // Validation
    if (!species) {
      alert("You must enter a species. Or, give the plant a name");
      return;
    }
    if (!dateLastWatered || !dateToWaterNext) {
      alert('You must provide watering dates 🙂')
      return
    }
    if (!user) {
      alert('No user is logged in');
      return;
    }
    let savedFileName = '';
    // Check if image to be processed
    if (imageUrl) {
      // Image was already saved 
      if (!selectedFile && plant && plant.picture) {
        savedFileName = plant.picture;
      } else {
        try {
          // Compress image
          setLoadingStatus('Compressing image ')
          let compressedImage = await compressImage(selectedFile);
          // Upload image to storage
          setLoadingStatus('Uploading image ')
          savedFileName = await uploadFile(compressedImage, user);
        } catch (e) {
          console.error(e)
        }
      }
    }
    setLoadingStatus('Saving ')
    // Save document to firestore db
    let plantTrackingDetails = {
      species: species,
      dateObtained: dateObtained.getTime(),
      daysBetweenWatering: daysBetweenWatering,
      dateLastWatered: dateLastWatered.getTime(),
      dateToWaterNext: dateToWaterNext.getTime(),
      dateLastFed: dateLastFed && dateLastFed.getTime() > 0 ? dateLastFed.getTime() : null,
      dateToFeedNext: dateToFeedNext && dateToFeedNext.getTime() > 0 ? dateToFeedNext.getTime() : null,
      lightRequired: lightRequired,
      dateCreated: (new Date()).getTime(),
      picture: savedFileName ? savedFileName : plant ? plant.picture ? plant.picture : '' : '',
      careInstructions: careInstructions || "",
    };
    let docRef: DocumentReference<DocumentData> = null;
    if (plant) {
      // Update an existing document
      await setDoc(doc(collection(doc(db, 'users', user.uid), 'plantTrackingDetails'), plant.id), plantTrackingDetails, { merge: true });
      console.log('Updated existing plant tracking details');
    } else {
      // Add a new document with a generated id.
      docRef = await addDoc(collection(doc(db, 'users', user.uid), 'plantTrackingDetails'), plantTrackingDetails);
      console.log(`Document written with ID: ${docRef.id}`);
    }
    // Redirect back to tracking page
    router.push('/Tracking');
  };

  const onChangeDaysBetweenWatering = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value.replace(/\D/g, '');
    let val = Number(s);
    setDaysBetweenWatering(val);
    if (dateLastWatered) {
      setDateToWaterNext(new Date(dateLastWatered.getTime() + val * MILLIS_IN_DAY));
    }
  }

  const onRemoveFile = () => {
    if (!confirm('Remove the image?')) return;
    // if image was previously saved, delete from storage
    if (plant && plant.picture) {
      deleteImage(plant.picture, user.uid)
        .then(() => {
          plant.picture = '';
          setSelectedFile(null)
          setImageUrl('')
          setDoc(
            doc(
              collection(doc(db, 'users', user.uid), 'plantTrackingDetails'),
              plant.id),
            { picture: '' },
            { merge: true }
          )
            .then(() => console.log('removed image ref from db'))
        })
        .catch(console.error);
    }
    // otherwise just remove from UI
    else {
      setSelectedFile(null)
      setImageUrl('')
    }
  }

  return (
    <div className='antialiased text-lg text-stone-100 bg-green ' >
      {loadingStatus ?
        <div className='flex justify-center items-center pt-60' >
          {loadingStatus} <ReactLoading type='bars' color="#FFF7ED" />
        </div>
        :
        <div>
          <div className="text-3xl text-center italic text-zinc-100 border-4 border-x-0 border-t-0 border-zinc-200 border-dotted w-full p-6 bg-lime-900">
            <a className='pt-20'>
              {`${plant ? 'Edit' : 'Add'} Plant Info`}
            </a>
          </div>
          <div className='flex flex-col items-center m-auto p-4 '>
            {/** Divide form content by page */}
            <div className=' min-h-100 top-50'>
              {/* // Page 1: General Plant Info */}
              <div>
                <div className="relative  m-auto w-fit p-1">
                  {imageUrl ?
                    <div>
                      <Image src={imageUrl} loader={customImageLoader} alt='photo of plant' width='150' height='190' />
                      <a className='absolute top-2 right-2 bg-stone-100 text-green cursor-pointer border border-red-700 rounded mb-24 p-1 text-xs'
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
                < div className='grid grid-cols-2 gap-x-1 gap-y-6 items-center pt-6' >
                  <label htmlFor='species'>
                    Species:
                  </label>
                  <TextField
                    placeholder='Enter a species...'
                    value={species}
                    onChange={setSpecies}
                    textarea={true}
                    width="full"
                  />
                  {/* <label htmlFor="lightReq">
                    Requires
                  </label> */}
                  {/* <Select
                    id="lightReq"
                    className="bg-orange-50"
                    value={lightRequired}
                    label="light required"
                    onChange={(e) => setLightRequired(e.target.value)}
                  >
                    <MenuItem value={2}>Bright indirect light</MenuItem>
                    <MenuItem value={10}>Bright light</MenuItem>
                  </Select> */}
                </div>
              </div>
              <div>
                <div className='flex flex-row justify-center items-center pt-6'>
                  <label htmlFor="minDays">
                    Water every &nbsp;
                  </label>
                  <input
                    className='bg-orange-50 p-2 px-0 my-2 text-slate text-center w-14'
                    type="text"
                    name="minDays"
                    id="minDays"
                    value={String(daysBetweenWatering)}
                    onChange={onChangeDaysBetweenWatering}
                  />
                  &nbsp; days
                </div>
                <div className="m-auto items-center w-fit pt-6">
                  {/* <label htmlFor="nextWater" >Last watered on</label> */}
                  <GenericDatePicker
                    label='Last watered on'
                    value={dateLastWatered}
                    onSelect={(d: Date) => {
                      if (d) {
                        setDateLastWatered(d);
                        setDateToWaterNext(new Date(d.getTime() + daysBetweenWatering * MILLIS_IN_DAY));
                      }
                    }}
                  />
                  {/* <label htmlFor="nextWater">Water next on</label> */}
                  <GenericDatePicker
                    label='Water next on'
                    value={dateToWaterNext}
                    onSelect={(d: Date) => setDateToWaterNext(d)}
                  />
                </div>
              </div>
              <div>
                <div className="m-auto items-center  py-6 w-fit">
                  <div className='flex justify-center items-center '>
                    <GenericDatePicker
                      label='Last fed on'
                      value={dateLastFed}
                      onSelect={(d: Date) => {
                        setDateLastFed(d)
                      }}
                    />
                    {dateLastFed &&
                      <a className='bg-stone-100 text-green cursor-pointer border border-red-700 rounded ml-2 p-1 w-fit text-xs'
                        onClick={() => {
                          if (confirm('Remove date last fed?')) {
                            setDateLastFed(null);
                          }
                        }} >
                        &#10060;
                      </a>}
                  </div>
                  <div className='flex justify-center items-center'>
                    <GenericDatePicker
                      label='Feed next on'
                      value={dateToFeedNext}
                      onSelect={(d: Date) => setDateToFeedNext(d)}
                    />
                    {dateToFeedNext &&
                      <a className='bg-stone-100 text-green cursor-pointer border border-red-700 rounded ml-2 p-1 w-fit text-xs'
                        onClick={() => {
                          if (confirm('Remove date to feed next?')) {
                            setDateToFeedNext(null);
                          }
                        }} >
                        &#10060;
                      </a>
                    }
                  </div>
                </div>
              </div>
              <div>
                {/* Date obtained */}
                <div className="m-auto w-fit">
                  <GenericDatePicker
                    label='Obtained plant on'
                    value={dateObtained}
                    onSelect={(d: Date) => {
                      setDateObtained(d)
                    }}
                  />
                </div>
                {/* Other care instructions */}
                <div className='grid grid-cols-2 gap-x-2 gap-y-6 m-7 items-center pr-10' >
                  <label htmlFor='species'>
                    Other care instructions
                  </label>
                  <TextField
                    placeholder=''
                    value={careInstructions}
                    onChange={setCareInstructions}
                    textarea={true}
                    width={"full"}
                  />
                </div>
              </div>
            </div>
            <div className="mx-3 mt-0 ">
              <div className='flex justify-evenly '>
                <a
                  className="bg-lime-100 text-green py-2.5 rounded px-7 mt-4 mx-8"
                  onClick={router.back}>
                  Cancel
                </a>
                <button
                  className="bg-lime-700 text-stone-50 font-bold py-2.5 rounded px-7 mt-4 mx-8"
                  onClick={savePlantTrackingDetails}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div >
  );
}

export default AddPlantTrackingDetails;
