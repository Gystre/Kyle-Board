import { Box, IconButton, useToast } from "@chakra-ui/react";
import { PermissionLevel } from "@kyle/common";
import { FiTrash2 } from "react-icons/fi";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

/*
    Component which displays buttons for editing and deleting posts.
    Commented out the edit button for now since i'm too lazy to implement it LOL.
*/

interface Props {
    id: number;
    creatorId: number;
}

export const EditDeletePostButtons: React.FC<Props> = ({ id, creatorId }) => {
    const toast = useToast();
    const { data: meData } = useMeQuery();
    const [deletePost] = useDeletePostMutation();

    //only show the edit and delete buttons if user owns the post or is an admin
    if (
        meData?.me?.id !== creatorId &&
        meData?.me?.permissionLevel != PermissionLevel.Admin
    ) {
        return null;
    }

    return (
        <Box>
            {/* <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton
                    icon={<FiEdit />}
                    ml="auto"
                    mr={4}
                    aria-label="Edit Post"
                />
            </NextLink> */}
            <IconButton
                ml="auto"
                icon={<FiTrash2 />}
                aria-label="Delete Post"
                onClick={() => {
                    deletePost({
                        variables: { id, creatorId },

                        //remove the post from the cache so the user doesn't see it anymore
                        update: (cache, { data }) => {
                            if (data?.deletePost) {
                                cache.evict({ id: "Post:" + id });
                                cache.gc();

                                toast({
                                    title: `Deleted post ${id}`,
                                    position: "top",
                                    status: "success",
                                    isClosable: true,
                                });
                            } else {
                                toast({
                                    title: `Failed to delete post ${id}`,
                                    description: `You don't own this post or you aren't an admin`,
                                    position: "top",
                                    status: "error",
                                    isClosable: true,
                                });
                            }
                        },
                    });
                }}
            />
        </Box>
    );
};
