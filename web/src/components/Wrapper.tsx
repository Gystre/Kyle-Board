import { Box } from "@chakra-ui/layout";
import React from "react";

/*
    Component to keep things in a mobile friendly format
*/

//creating a type here b/c we're reusing this in Layout
export type WrapperVariant = "small" | "regular";

interface Props {
    variant?: WrapperVariant;
}

export const Wrapper: React.FC<Props> = ({ children, variant = "regular" }) => {
    return (
        <Box
            mt={8}
            mx="auto"
            maxW={variant === "regular" ? "800px" : "400px"}
            w="100%"
            padding={2}
        >
            {children}
        </Box>
    );
};
