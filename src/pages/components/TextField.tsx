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
}

const TextField = React.forwardRef<InputElement, TextFieldProps>(
    ({ onChange, textarea = false, ...rest }, ref) => {
        const InputElement = textarea ? "textarea" : "input";
        return (
            <div>
                <InputElement
                    ref={ref as any}
                    className={`rounded-md w-24 p-3 mb-3 bg-lightGrayGreen text-black ${textarea ? "h-32" : ""
                        }`}
                    onChange={({ target: { value } }: InputChangeEvent) => onChange(value)}
                    {...rest}
                />
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
