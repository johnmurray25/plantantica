import React from "react";

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
}

const TextField = React.forwardRef<InputElement, TextFieldProps>(
    ({ onChange, textarea = false, ...props }, ref) => {
        const InputElement = textarea ? "textarea" : "input";
        return (
            <div>
                <InputElement
                    ref={ref as any}
                    className={`bg-inherit text-right border border-t-0 border-x-0 text-stone-200 
                                p-3 mb-3  
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
