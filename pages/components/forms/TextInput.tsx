import React from 'react'
import TextField from './TextField2'

interface Props {
    value: string;
    onChange: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: () => void | Promise<void>;
    width: number;
    placeholder: string;
    name: string;
    type: "text" | "email" | "password";
    autoFocus: boolean;
}

const TextInput: React.FC<Props> = (props) => {
    return (
        <div className='flex '>
            <TextField
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                autoFocus={props.autoFocus}
                type={props.type}
            />
            <button
                className='bg-lime-700 text-stone-200 hover:bg-lime-400 hover:text-brandGreen active:bg-lime-400 active:text-brandGreen focus:bg-lime-400 focus:text-brandGreen rounded-sm p-1 justify-center 
                    h-12  w-8 text-center content-center cursor-pointer'
                onClick={props.onSubmit}
            >
                &rarr;
            </button>
        </div>
    )
}

export default TextInput