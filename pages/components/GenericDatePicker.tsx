import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
    label: string,
    value: Date,
    onSelect: (date: Date) => void,
}

const GenericDatePicker: React.FC<Props> = (props) => {

    return (
        <div className='bg-orange-50 text-brandGreen p-3 m-auto rounded-lg mb-1'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    className='bg-stone-100'
                    label={props.label}
                    value={props.value}
                    onChange={(newValue) => props.onSelect(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    );
}

export default GenericDatePicker