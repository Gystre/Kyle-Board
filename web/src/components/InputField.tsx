import { Input, Textarea } from "@chakra-ui/react";
import React, { InputHTMLAttributes } from "react";
import { FormDecorator, FormDecoratorProps } from "./FormDecorator";

/*
    Component for textarea's but in chakra style.
    (ripped from chakra docs example)
*/

//
//make this component take in any props that a normal <input> element would take
type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> &
    FormDecoratorProps & {
        textarea?: boolean;
    };

export const InputField: React.FC<Props> = ({
    label,
    name,
    textarea,
    size: _,
    ...props
}) => {
    //check if textarea, then change the component acorrdingly
    let InputOrTextArea = textarea ? Textarea : Input;

    return (
        <FormDecorator label={label} name={name}>
            <InputOrTextArea
                id={name}
                {...props}
                placeholder={props.placeholder}
            />
        </FormDecorator>
    );
};
