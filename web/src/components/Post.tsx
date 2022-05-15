import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FileType } from "@kyle/common";
import NextLink from "next/link";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { PostResultFragment } from "../generated/graphql";
import { convertStringToDate } from "../utils/convertStringToDate";
import { EditDeletePostButtons } from "./EditDeletePostButtons";
import { LinkName } from "./LinkName";
import { ProfilePicture } from "./ProfilePicture";

interface PostProps {
    post: PostResultFragment;
    noBorder?: boolean;
}

export const Post: React.FC<PostProps> = ({ post: p, noBorder = false }) => {
    const [isOpen, setIsOpen] = useState<boolean>();
    // const isNsfw = useNsfw(p.fileUrl as string);

    var fileContent = null;
    if (p.fileUrl) {
        if (p.fileType == FileType.Image) {
            fileContent = (
                <button
                    onClick={(e) => {
                        // prevent going to the post page onclick
                        e.preventDefault();

                        setIsOpen(true);
                    }}
                    style={{ display: "block", margin: "auto" }}
                >
                    {/* <Nsfw imageUrl={p.fileUrl} /> */}
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
            );
        } else if (p.fileType == FileType.Video) {
            fileContent = (
                <>
                    <Box mt={2} />
                    <video
                        controls
                        style={{
                            display: "block",
                            margin: "auto",
                            borderRadius: "var(--chakra-radii-md)",
                        }}
                    >
                        <source src={p.fileUrl} />
                        Your browser doesn&apos;t support HTML5 video lmao
                    </video>
                </>
            );
        }
    }

    return (
        <Box
            cursor="pointer"
            p={5}
            shadow={noBorder ? "" : "md"}
            borderWidth={noBorder ? "" : "1px"}
            borderRadius={noBorder ? "" : "md"}
            _hover={{
                transition: "all 0.2s ease",
                backgroundColor: "gray.100",
            }}
        >
            <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                <Flex>
                    <ProfilePicture
                        name={p.creator.username}
                        src={p.creator.imageUrl}
                        userId={p.creator.id}
                    />
                    <Box ml={3}>
                        <Box>
                            <LinkName
                                id={p.creator.id}
                                username={p.creator.username}
                                permissionLevel={p.creator.permissionLevel}
                                bold
                            />
                            <Text color="grey" display="inline">
                                {" "}
                                · {convertStringToDate(p.createdAt)}
                            </Text>
                        </Box>
                        <Text wordBreak="break-word">{p.text}</Text>
                    </Box>
                    <Box ml="auto" pl={4}>
                        <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creator.id}
                        />
                    </Box>
                </Flex>
            </NextLink>
            {fileContent}
        </Box>
    );
};
