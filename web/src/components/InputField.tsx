import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

/*
    Component for textarea's but in chakra style.
    (ripped from chakra docs example)
*/

//
//make this component take in any props that a normal <input> element would take
type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    label: string;
    name: string;
    textarea?: boolean;
};

export const InputField: React.FC<Props> = ({
    label,
    textarea,
    size: _,
    ...props
}) => {
    //check if textarea, then change the component acorrdingly
    let InputOrTextArea = textarea ? Textarea : Input;

    const [field, { error }] = useField(props);
    return (
        // !! = cast to boolean ("" -> empty string becomes false, "asdfasdf" -> not empty becomes true)
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextArea
                {...field}
                {...props}
                id={field.name}
                placeholder={props.placeholder}
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
