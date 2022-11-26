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
            <a
                className='cursor-pointer bg-[#53984D] text-yellow rounded justify-center h-12 w-8 text-center content-center'
                onClick={props.onSubmit}
            >
                &rarr;
            </a>
        </div>
    )
}

export default TextInput