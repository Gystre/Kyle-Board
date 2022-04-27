import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/PageHeader";
import { Post } from "../../components/Post";
import { useFindByIdQuery, usePostsQuery } from "../../generated/graphql";
import { convertPermission } from "../../utils/convertPermission";
import { useSocket } from "../../utils/socket";
import { withApollo } from "../../utils/withApollo";

const User: NextPage = () => {
    const router = useRouter();
    useSocket();
    const id =
        typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const { data, error, loading } = useFindByIdQuery({
        variables: {
            id,
        },
    });

    const posts = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null,
            creatorId: id,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "no-cache", // TODO: figure out how to merge new posts while also combining them with the cached posts for more efficient network transfer
    });

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.findById && !loading) {
        return (
            <Layout>
                <Box>Couldn&apos;t find user</Box>
            </Layout>
        );
    }

    return (
        <Layout pageName={data?.findById?.username}>
            <PageHeader title="User" />

            <Avatar
                name={data?.findById?.username}
                src={data?.findById?.imageUrl}
                size="xl"
            />

            <Heading>
                {data?.findById?.username}
                {convertPermission(data?.findById?.permissionLevel as number)}
            </Heading>
            <Text>
                I&apos;m too lazy to implement a description feature so have a
                filler description instead heheh. This guy is a total idiot
                whoever this profile belongs too except for kyle&apos;s tho, his
                is very cool.
            </Text>

            <Divider my={2} />

            {!posts.data && posts.loading ? (
                <Box textAlign="center">
                    <Box mb={4}>Loading stuff...</Box>
                    <Spinner size="xl" />
                </Box>
            ) : (
                <Stack spacing={8}>
                    {posts.data?.posts.posts.map((p) => (
                        <Post key={p.id} post={p} />
                    ))}
                </Stack>
            )}
            {posts.data && posts.data.posts.hasMore ? (
                <Flex>
                    <Button
                        onClick={() => {
                            posts.fetchMore({
                                variables: {
                                    limit: 30,
                                    cursor: posts.data?.posts.posts[
                                        posts.data?.posts.posts.length - 1
                                    ].createdAt, //get all items after the last item in the list
                                    creatorId: id,
                                },
                            });
                        }}
                        isLoading={loading}
                        m="auto"
                        my={8}
                    >
                        Load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withApollo({ ssr: true })(User);
