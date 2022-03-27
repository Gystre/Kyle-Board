import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";
import { PermissionLevel } from "@kyle/common";
import React, { useState } from "react";
import { PostResultFragment } from "../generated/graphql";
import { convertStringToDate } from "../utils/convertStringToDate";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import Lightbox from "react-image-lightbox";

interface PostProps {
    post: PostResultFragment;
}

export const Post: React.FC<PostProps> = ({ post: p }) => {
    const [isOpen, setIsOpen] = useState<boolean>();

    var levelText = "";
    if (p.creator.permissionLevel == PermissionLevel.Admin) {
        levelText = "(Admin)";
    } else {
        levelText = "(Unknown PermissionLevel)";
    }

    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Flex>
                <Avatar name={p.creator.username} src={p.creator.imageUrl} />
                <Box ml={3}>
                    <Box>
                        <b>{p.creator.username}</b>
                        {p.creator.permissionLevel != PermissionLevel.User ? (
                            <Text color="red" display="inline">
                                {" "}
                                {levelText}
                            </Text>
                        ) : null}
                        <Text color="grey" display="inline">
                            {" "}
                            · {convertStringToDate(p.createdAt)}
                        </Text>
                    </Box>
                    <Text>{p.text}</Text>
                </Box>
                <Box ml="auto" pl={4}>
                    <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                </Box>
            </Flex>
            {p.fileUrl ? (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ display: "block", margin: "auto" }}
                >
                    <Image
                        mt={3}
                        display="block"
                        borderRadius="md"
                        src={p.fileUrl}
                        alt="image or smthn idk lol"
                    />

                    {isOpen ? (
                        <Lightbox
                            mainSrc={p.fileUrl}
                            onCloseRequest={() => setIsOpen(false)}
                        />
                    ) : null}
                </button>
            ) : null}
        </Box>
    );
};
