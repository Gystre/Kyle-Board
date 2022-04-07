import {
    Avatar,
    Box,
    Center,
    Divider,
    Flex,
    Heading,
    HStack,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { Post } from "../components/Post";
import { useSearchPostQuery, useSearchUserQuery } from "../generated/graphql";
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
                    <Center
                        overflowY="auto"
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="md"
                        p={2}
                    >
                        <Box
                            rounded={"md"}
                            maxW={"150px"}
                            w={"full"}
                            bg={useColorModeValue("white", "gray.800")}
                        >
                            <Flex justify={"center"}>
                                <Avatar
                                    size={"xl"}
                                    src={u.imageUrl}
                                    css={{
                                        border: "2px solid white",
                                    }}
                                />
                            </Flex>
                            <Box p={6}>
                                <Stack spacing={0} align={"center"}>
                                    <Heading
                                        fontSize={"2xl"}
                                        fontWeight={500}
                                        fontFamily={"body"}
                                    >
                                        {u.username}
                                    </Heading>
                                </Stack>
                            </Box>
                        </Box>
                    </Center>
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
