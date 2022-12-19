import React, { HTMLAttributes } from "react";

type InputElement = HTMLInputElement | HTMLTextAreaElement;
type InputChangeEvent = React.ChangeEvent<InputElement>;

interface TextFieldProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    name?: string;
    type?: "email" | "password" | "text";
    textarea?: boolean;
    width: string | number;
    style?: HTMLAttributes<any>;
}

const TextField = React.forwardRef<InputElement, TextFieldProps>(
    ({ onChange, textarea = false, ...props }, ref) => {
        const InputElement = textarea ? "textarea" : "input";
        return (
            <div>
                <InputElement
                    ref={ref as any}
                    className={`text-right border border-r-1 border-b-0 border-gray-600 border-opacity-40 text-lime-50 bg-secondaryDark bg-opacity-80 rounded-xl  
                                p-3 mb-3  brand text-sm
                                w-${props.width ? props.width : 24} 
                                ${textarea ? "h-28" : "h-12"}`
                    }
                    onChange={({ target: { value } }: InputChangeEvent) => onChange(value)}
                    {...props}
                />
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
