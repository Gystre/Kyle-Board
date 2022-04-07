import {
    Box,
    Center,
    Flex,
    Heading,
    HStack,
    Spinner,
    Stack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../components/Layout";
import { PageHeader } from "../components/PageHeader";
import { Post } from "../components/Post";
import { ProfilePicture } from "../components/ProfilePicture";
import { useSearchPostQuery, useSearchUserQuery } from "../generated/graphql";
import { convertPermission } from "../utils/convertPermission";
import { withApollo } from "../utils/withApollo";

const Search: NextPage = () => {
    const router = useRouter();
    const query = typeof router.query.q === "string" ? router.query.q : "";

    const searchPost = useSearchPostQuery({
        variables: {
            query,
        },
    });
    let postResult = null;
    if (searchPost.data && !searchPost.loading) {
        postResult = (
            <Stack spacing={8}>
                {searchPost.data!.searchPost.map((p) => (
                    <Post key={p.id} post={p} />
                ))}
            </Stack>
        );
    }

    const searchUser = useSearchUserQuery({
        variables: {
            query,
        },
    });
    let searchResult = null;
    if (!searchUser.loading && searchUser.data) {
        searchResult = (
            <HStack spacing={8}>
                {searchUser.data!.searchUser.map((u) => (
                    <NextLink href="/user/[id]" as={`/user/${u.id}`}>
                        <Center
                            overflowY="auto"
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="md"
                            p={2}
                            cursor="pointer"
                            _hover={{
                                transition: "all 0.2s ease",
                                backgroundColor: "gray.100",
                            }}
                        >
                            <Box rounded={"md"} maxW={"250px"} w={"full"}>
                                <Flex justify={"center"}>
                                    <ProfilePicture
                                        userId={u.id}
                                        src={u.imageUrl}
                                        size="xl"
                                    />
                                </Flex>
                                <Box p={6}>
                                    <Stack spacing={0} align={"center"}>
                                        <Heading
                                            fontSize={"2xl"}
                                            fontWeight={500}
                                            fontFamily={"body"}
                                            _hover={{
                                                textDecoration: "underline",
                                            }}
                                        >
                                            {u.username}
                                            {convertPermission(
                                                u.permissionLevel
                                            )}
                                        </Heading>
                                    </Stack>
                                </Box>
                            </Box>
                        </Center>
                    </NextLink>
                ))}
            </HStack>
        );
    }

    return (
        <Layout>
            <PageHeader title="Search" />

            {searchResult && postResult ? (
                <>
                    {searchResult}
                    <Box mb={4} />
                    {postResult}
                </>
            ) : (
                <Box textAlign="center">
                    <Box mb={4}>Loading results...</Box>
                    <Spinner size="xl" />
                </Box>
            )}
        </Layout>
    );
};

export default withApollo({ ssr: true })(Search);
