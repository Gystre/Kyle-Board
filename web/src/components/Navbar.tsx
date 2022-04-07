import { useApolloClient } from "@apollo/client";
import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useSocket } from "../utils/socket";
import { LinkName } from "./LinkName";
import { ProfilePicture } from "./ProfilePicture";

interface Props {}
export const Navbar: React.FC<Props> = () => {
    const router = useRouter();
    const toast = useToast();
    const [logout, { loading: logoutFetching }] = useLogoutMutation(); //the mutation function we use on the front end to communicate with the backend
    const apolloClient = useApolloClient();
    const { data, loading } = useMeQuery({ skip: isServer() });
    const socket = useSocket();

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
            <Flex align="center" style={{ gap: 5 }}>
                <ProfilePicture
                    name={data.me.username}
                    src={data.me.imageUrl}
                    userId={data.me.id}
                />
                {window.screen.width > 600 ? (
                    <LinkName
                        id={data.me.id}
                        username={data.me.username}
                        permissionLevel={data.me.permissionLevel}
                    />
                ) : null}
                <Button
                    onClick={async () => {
                        await logout();
                        socket.disconnect();

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
            zIndex={999}
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
                        <Heading size="lg" userSelect="none">
                            Kyle Board
                        </Heading>
                    </Link>
                </NextLink>
                <Box mr={4} />
                <Formik
                    initialValues={{
                        query: "",
                    }}
                    onSubmit={(values) => {
                        if (values.query.length != 0) {
                            router.push("/search?q=" + values.query);
                        } else {
                            toast({
                                title: `Search needs to have smthn in it`,
                                position: "top",
                                status: "error",
                                isClosable: true,
                                duration: 1000,
                            });
                        }
                    }}
                >
                    {({ handleChange }) => (
                        <Form>
                            <InputGroup size="md">
                                <Input
                                    pr="4.5rem"
                                    type="text"
                                    placeholder="Search Kyle Board"
                                    variant="flushed"
                                    _placeholder={{
                                        opacity: 0.4,
                                        color: "#000000",
                                        userSelect: "none",
                                    }}
                                    onChange={handleChange}
                                    name="query"
                                />
                                <InputRightElement>
                                    <IconButton
                                        size="sm"
                                        type="submit"
                                        icon={<FiSearch />}
                                        aria-label="search"
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Form>
                    )}
                </Formik>
                <Box ml="auto">{body}</Box>
            </Flex>
        </Flex>
    );
};
