import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { Flex, Button, Box, Heading, Link } from "@chakra-ui/react";
import { isServer } from "../utils/isServer";

interface Props {}
export const Navbar: React.FC<Props> = () => {
    const router = useRouter();
    const [logout, { loading: logoutFetching }] = useLogoutMutation(); //the mutation function we use on the front end to communicate with the backend
    const apolloClient = useApolloClient();
    const { data, loading } = useMeQuery({ skip: isServer() });
    let body = null;

    if (loading) {
        //data is loading
    } else if (!data?.me) {
        //user not logged in
        body = (
            <>
                <NextLink href="/login" passHref>
                    {/* using <Link> instead of <a> b/c it lets us do client side routing */}
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register" passHref>
                    <Link>Register</Link>
                </NextLink>
            </>
        );
    } else {
        //user is logged in
        body = (
            <Flex align="center">
                <NextLink href="/create-post" passHref>
                    <Button mr={4}>Create post</Button>
                </NextLink>

                <Box mr={2}>{data.me.username}</Box>
                <Button
                    onClick={async () => {
                        await logout();

                        //reset cache
                        await apolloClient.resetStore();
                    }}
                    variant={"link"}
                    isLoading={logoutFetching}
                >
                    Logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex
            zIndex={1}
            position="sticky"
            top={0}
            bg="tan"
            p={4}
            ml={"auto"}
            align="center"
        >
            <Flex flex={1} m="auto" align="center" maxW={800}>
                <NextLink href="/" passHref>
                    <Link>
                        <Heading>Kyle Board</Heading>
                    </Link>
                </NextLink>
                <Box ml="auto">{body}</Box>
            </Flex>
        </Flex>
    );
};
