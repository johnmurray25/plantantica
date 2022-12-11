import React from 'react'
import TextField from './TextField'

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
                name={props.name}
                type={props.type}
                width={props.width}
            />
            <button
                className='bg-lime-700 text-stone-200 hover:bg-lime-400 hover:text-green active:bg-lime-400 active:text-green focus:bg-lime-400 focus:text-green rounded-sm p-1 justify-center 
                    h-12  w-8 text-center content-center cursor-pointer'
                onClick={props.onSubmit}
            >
                &rarr;
            </button>
        </div>
    )
}

export default TextInput