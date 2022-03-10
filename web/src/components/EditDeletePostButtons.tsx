import { Box, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface Props {
    id: number;
    creatorId: number;
}
export const EditDeletePostButtons: React.FC<Props> = ({ id, creatorId }) => {
    const { data: meData } = useMeQuery();
    const [deletePost] = useDeletePostMutation();

    //only show the edit and delete buttons if user owns the post
    if (meData?.me?.id !== creatorId) {
        return null;
    }

    return (
        <Box>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton
                    icon={<EditIcon />}
                    ml="auto"
                    mr={4}
                    aria-label="Edit Post"
                />
            </NextLink>
            <IconButton
                ml="auto"
                icon={<DeleteIcon />}
                aria-label="Delete Post"
                onTouchMove={() => {
                    console.log("smthn");
                }}
                onClick={() => {
                    deletePost({
                        variables: { id },

                        //remove the post from the cache so the user doesn't see it anymore
                        update: (cache) => {
                            //same as invalidate cache in urql
                            //Post:66
                            cache.evict({ id: "Post:" + id });
                            cache.gc();
                        },
                    });
                }}
            />
        </Box>
    );
};
