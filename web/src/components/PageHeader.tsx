import { HStack, IconButton, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";

interface PageHeaderProps {
    title: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    const router = useRouter();

    return (
        <HStack>
            <IconButton
                size="sm"
                icon={<FiArrowLeft />}
                aria-label="search"
                onClick={() => {
                    router.back();
                }}
            />
            <Heading>{title}</Heading>
        </HStack>
    );
};
