import { Flex, Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { PostResultFragment } from "../generated/graphql";
import { convertStringToDate } from "../utils/convertStringToDate";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import NextLink from "next/link";

interface PostProps {
    post: PostResultFragment;
}

export const Post: React.FC<PostProps> = ({ post: p }) => {
    return (
        // <NextLink href="/post/[id]" as={`/post/${p.id}`}>
        <Flex p={5} shadow="md" borderWidth="1px">
            <Avatar name={p.creator.username} src={p.creator.imageUrl} />
            <Box ml={3}>
                <b>{p.creator.username}</b>
                <Text>{p.text}</Text>
                <Text mt={3} color="grey">
                    <em>{convertStringToDate(p.createdAt)}</em>
                </Text>
            </Box>
            <Box ml="auto" pl={4}>
                <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
            </Box>
        </Flex>
        // </NextLink>
    );
};
