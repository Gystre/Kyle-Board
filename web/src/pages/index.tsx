import { useApolloClient } from "@apollo/client";
import {
    Box,
    Button,
    Flex,
    Image,
    Spinner,
    Stack,
    useToast,
} from "@chakra-ui/react";
import {
    createPostSchema,
    FileType,
    getFileType,
    SocketCmds,
} from "@kyle/common";
import { Form, Formik } from "formik";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useContext, useEffect } from "react";
import { FiHash } from "react-icons/fi";
import { FileUpload } from "../components/FileUpload";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { socketContext } from "../components/SocketProvider";
import {
    PostResultFragment,
    useCreatePostMutation,
    usePostsQuery,
    useSignB2Mutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { uploadToB2 } from "../utils/uploadToB2";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const Home: NextPage = () => {
    const loggedIn = useIsAuth();
    const toast = useToast();

    const { data, error, loading, fetchMore } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null, //cursor will tell us at what point we want to fetch posts
        },
        notifyOnNetworkStatusChange: true, //loading will become true if click loadMore (enable the little spinning thing on load more button)
    });

    const [createPost] = useCreatePostMutation();
    const [signB2] = useSignB2Mutation();

    const apolloClient = useApolloClient();
    const socket = useContext(socketContext);
    useEffect(() => {
        socket.on(SocketCmds.SendMessage, (post: PostResultFragment) => {
            // apolloClient.cache.modify({
            //     fields: {
            //         posts(existing = []) {
            //             console.log(existing);
            //             return {
            //                 ...existing,
            //                 posts: [
            //                     ...existing.posts,
            //                     { __ref: "Post:35" },
            //                 ],
            //             };
            //         },
            //     },
            // });

            // TODO: better than resetStore() since we don't have to refetch Me query
            // but still inefficient since could just write into cache and force react to reload page with new cached data somehow
            apolloClient.cache.evict({ fieldName: "posts:{}" });
            apolloClient.cache.gc();
        });

        socket.on(SocketCmds.DeleteMessage, (id) => {
            apolloClient.cache.evict({ id: "Post:" + id });
            apolloClient.cache.gc();
        });
    }, [socket, apolloClient.cache]);

    if (!loading && !data) {
        return (
            <div>
                <div>
                    i probs shut down the server so have a picture of one of the
                    greatest inspirations in my life
                </div>
                <Image
                    width="50%"
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fircenterprises.com%2Fwp-content%2Fuploads%2F2020%2F06%2FDollar-Bill-scaled.jpeg"
                    alt="monies"
                />
                <div>{error?.message}</div>
            </div>
        );
    }

    return (
        <>
            <Layout>
                <NextLink href="/changelog" passHref>
                    <Button
                        leftIcon={<FiHash />}
                        colorScheme="teal"
                        variant="solid"
                    >
                        Changelog - v1.2
                    </Button>
                </NextLink>
                {/* only show the ability to make form if they're logged in */}
                {loggedIn ? (
                    <Formik
                        validationSchema={createPostSchema}
                        initialValues={{
                            text: "",
                            file: null as File | null,
                            previewSrc: "" as string | null,
                        }}
                        onSubmit={async (values, { setErrors, resetForm }) => {
                            // SOMEWHERE HERE I NEED TO CATCH ERROR OF NOT AUTHENTICATED (fix later probably)
                            // file was added, get upload url and send post request
                            var newFileName: string | null | undefined = null;
                            var fileType: FileType | null = null;
                            if (values.file) {
                                const signB2Response = await signB2({
                                    variables: {
                                        fileName: values.file.name as string,
                                        fileType: values.file.type as string,
                                    },
                                });

                                if (
                                    signB2Response.errors != null ||
                                    !signB2Response.data
                                ) {
                                    toast({
                                        title: `Failed to upload image`,
                                        position: "top",
                                        status: "error",
                                        isClosable: true,
                                        duration: 2000,
                                    });
                                    return;
                                }

                                newFileName =
                                    signB2Response.data.signB2.fileName;
                                fileType = getFileType(values.file.type);

                                await uploadToB2(
                                    values.file,
                                    newFileName as string,
                                    signB2Response.data.signB2
                                        .uploadUrl as string,
                                    signB2Response.data.signB2
                                        .authorizationToken as string,
                                    values.text
                                );
                            }

                            const response = await createPost({
                                variables: {
                                    text: values.text,
                                    newFileName,
                                    fileType,
                                },
                            });

                            if (response.data?.createPost.errors) {
                                setErrors(
                                    toErrorMap(response.data.createPost.errors)
                                );
                            } else {
                                resetForm();

                                toast({
                                    title: `Posted!`,
                                    position: "top",
                                    status: "success",
                                    isClosable: true,
                                    duration: 2000,
                                });
                            }
                        }}
                    >
                        {({
                            values,
                            isSubmitting,
                            handleChange,
                            setFieldValue,
                        }) => (
                            <Form>
                                <InputField
                                    name="text"
                                    placeholder="type smthn here"
                                    onChange={handleChange}
                                    value={values.text}
                                    textarea
                                />

                                <FileUpload
                                    name="file"
                                    setFieldValue={setFieldValue}
                                    value_PreviewSrc={values.previewSrc}
                                />

                                <Button type="submit" isLoading={isSubmitting}>
                                    Post
                                </Button>
                            </Form>
                        )}
                    </Formik>
                ) : null}
                <Box mb={5} />
                {!data && loading ? (
                    <Box textAlign="center">
                        <Box mb={4}>Loading stuff...</Box>
                        <Spinner size="xl" />
                    </Box>
                ) : (
                    <Stack spacing={8}>
                        {data!.posts.posts.map((p) => (
                            <Post key={p.id} post={p} />
                        ))}
                    </Stack>
                )}
                {data && data.posts.hasMore ? (
                    <Flex>
                        <Button
                            onClick={() => {
                                fetchMore({
                                    variables: {
                                        limit: 30,
                                        cursor: data.posts.posts[
                                            data.posts.posts.length - 1
                                        ].createdAt, //get all items after the last item in the list
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
        </>
    );
};

export default withApollo({ ssr: true })(Home);
