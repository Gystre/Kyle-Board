import { Box, Flex, Image, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { PostResultFragment } from "../generated/graphql";
import { convertPermission } from "../utils/convertPermission";
import { convertStringToDate } from "../utils/convertStringToDate";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import { ProfilePicture } from "./ProfilePicture";

interface PostProps {
    post: PostResultFragment;
    noBorder?: boolean;
}

export const Post: React.FC<PostProps> = ({ post: p, noBorder = false }) => {
    const [isOpen, setIsOpen] = useState<boolean>();

    return (
        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
            <Box
                cursor="pointer"
                p={5}
                shadow={noBorder ? "" : "md"}
                borderWidth={noBorder ? "" : "1px"}
                borderRadius={noBorder ? "" : "md"}
            >
                <Flex>
                    <ProfilePicture
                        name={p.creator.username}
                        src={p.creator.imageUrl}
                        userId={p.creator.id}
                    />
                    <Box ml={3}>
                        <Box>
                            <NextLink
                                href="/user/[id]"
                                as={`/user/${p.creator.id}`}
                            >
                                <span
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.textDecoration =
                                            "underline";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.textDecoration =
                                            "none";
                                    }}
                                >
                                    <b>{p.creator.username}</b>
                                    {convertPermission(
                                        p.creator.permissionLevel
                                    )}
                                </span>
                            </NextLink>
                            <Text color="grey" display="inline">
                                {" "}
                                · {convertStringToDate(p.createdAt)}
                            </Text>
                        </Box>
                        <Text>{p.text}</Text>
                    </Box>
                    <Box ml="auto" pl={4}>
                        <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creator.id}
                        />
                    </Box>
                </Flex>
                {p.fileUrl ? (
                    <button
                        onClick={(e) => {
                            // prevent going to the post page onclick
                            e.preventDefault();

                            setIsOpen(true);
                        }}
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
        </NextLink>
    );
};
