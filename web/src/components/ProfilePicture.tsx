import { Avatar, AvatarProps } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

/*
    Component that displays profile picture with link to the user's profile as well as darkening the image on hover
*/

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
                cursor="pointer"
                _hover={{
                    transition: "all 0.2s ease",
                    filter: "brightness(70%)",
                }}
            />
        </NextLink>
    );
};
