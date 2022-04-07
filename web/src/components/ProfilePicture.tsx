import React from "react";
import { Avatar, AvatarProps, Box } from "@chakra-ui/react";
import NextLink from "next/link";

interface ProfilePictureProps extends AvatarProps {
    userId: number;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
    name,
    src,
    userId,
    ...props
}) => {
    return (
        <NextLink href="/user/[id]" as={`/user/${userId}`}>
            <Avatar
                {...props}
                name={name}
                src={src}
                _hover={{
                    transition: "all 0.2s ease",
                    filter: "brightness(70%)",
                    cursor: "pointer",
                }}
            />
        </NextLink>
    );
};
