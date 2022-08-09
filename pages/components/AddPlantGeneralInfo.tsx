import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { Input, MenuItem, Select } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";

import Plant from '../../domain/Plant';
import auth from '../../firebase/auth';
import styles from "../styles/tracking.module.css";

interface Props {
    plant?: {
        species: string,
        lightRequired: string | number,
    },
}

const AddPlantGeneralInfo: FC<Props> = (props) => {
    const [user] = useAuthState(auth)
    const [plant, setPlant] = useState(props.plant ? props.plant : {species: '', lightRequired: -1})

    return (
        <div className='grid grid-cols-2 gap-x-2 gap-y-6 m-7 items-center' >
            <label htmlFor='species'>
                Species:
            </label>
            <Input
                className={styles.input}
                type="text"
                name="species"
                id="species"
                placeholder="Enter a species..."
                value={plant.species}
                onChange={(e) => plant.species = e.target.value}
                required={true}
            />
            <label htmlFor="lightReq">
                Requires
            </label>
            <Select
                id="lightReq"
                className="bg-lightGrayGreen"
                value={plant.lightRequired}
                label="light required"
                onChange={(e) => plant.lightRequired = e.target.value}
            >
                <MenuItem value={2}>Bright indirect light</MenuItem>
                <MenuItem value={10}>Bright light</MenuItem>
            </Select>
        </div>
    )
}

export default AddPlantGeneralInfo