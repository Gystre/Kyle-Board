import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

/*
    Wrap this component around any objects that you want validated with formik forms.
    Make sure that the name prop matches the state variable inside of the formik form.
*/

//
//make this component take in any props that a normal <input> element would take
export type FormDecoratorProps = {
    label?: string;
    name: string;
};

export const FormDecorator: React.FC<FormDecoratorProps> = ({
    label = "",
    children,
    ...props
}) => {
    const [field, { error }] = useField(props);
    return (
        // !! = cast to boolean ("" -> empty string becomes false, "asdfasdf" -> not empty becomes true)
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            {children}
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
