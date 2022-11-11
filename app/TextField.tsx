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
    width: number;
}

const TextField = React.forwardRef<InputElement, TextFieldProps>(
    ({ onChange, textarea = false, ...props }, ref) => {
        const InputElement = textarea ? "textarea" : "input";
        return (
            <div>
                <InputElement
                    ref={ref as any}
                    className={`rounded-md w-${props.width ? props.width : 24} p-3 mb-3 bg-lightGrayGreen text-black ${textarea ? "h-32" : ""
                        }`}
                    onChange={({ target: { value } }: InputChangeEvent) => onChange(value)}
                    {...props}
                />
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
