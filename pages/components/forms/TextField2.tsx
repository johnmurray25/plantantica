import React from "react";

type InputElement = HTMLInputElement | HTMLTextAreaElement;
type InputChangeEvent = React.ChangeEvent<InputElement>;

interface TextFieldProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    type?: "email" | "password" | "text";
    error?: string;
    // textarea?: boolean;
}

const TextField = React.forwardRef<InputElement, TextFieldProps>(
    ({ onChange, ...props }, ref) => {
        return (
                <input
                    ref={ref as any}
                    className={`text-left rounded-lg p-3 mb-1 w-full bg-gray-200 text-primary inter
                        focus:border-b-4 focus:border-primary
                        ${props.error && "border-2 border-red-700"}`}
                    onChange={({ target: { value } }: InputChangeEvent) => onChange(value)}
                    {...props}
                />
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
