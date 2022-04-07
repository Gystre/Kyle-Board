import { PermissionLevel } from "@kyle/common";
import NextLink from "next/link";
import React from "react";
import { convertPermission } from "../utils/convertPermission";

interface LinkNameProps {
    id: number;
    username: string;
    permissionLevel: PermissionLevel;
    bold?: boolean;
}

/*
    Simple component to allow the username and permission level to be underlineable.
    Also shoves a link on them to make it clickable.
    Used in the navbar and post components.
*/

export const LinkName: React.FC<LinkNameProps> = ({
    id,
    username,
    permissionLevel,
    bold = false,
}) => {
    return (
        <NextLink href="/user/[id]" as={`/user/${id}`}>
            <span
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                }}
            >
                {bold ? <b>{username}</b> : <>{username}</>}
                {convertPermission(permissionLevel)}
            </span>
        </NextLink>
    );
};
