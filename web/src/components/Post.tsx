import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";
import { PermissionLevel } from "@kyle/common";
import React from "react";
import { PostResultFragment } from "../generated/graphql";
import { convertStringToDate } from "../utils/convertStringToDate";
import { EditDeletePostButtons } from "./EditDeletePostButtons";

interface PostProps {
    post: PostResultFragment;
}

export const Post: React.FC<PostProps> = ({ post: p }) => {
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
                <Image
                    mt={3}
                    borderRadius="md"
                    src={p.fileUrl}
                    alt="image or smthn idk lol"
                />
            ) : null}
        </Box>
    );
};
