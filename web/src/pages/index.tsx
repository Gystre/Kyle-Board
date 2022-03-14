import {
    Flex,
    Button,
    Stack,
    Box,
    Spinner,
    useToast,
    IconButton,
    CloseButton,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { useCreatePostMutation, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
import { InputField } from "../components/InputField";
import { Form, Formik } from "formik";
import { toErrorMap } from "../utils/toErrorMap";
import { createPostSchema } from "@kyle/common";
import { useIsAuth } from "../utils/useIsAuth";
import { Post } from "../components/Post";
import NewPosts from "../components/NewPosts";
import { FileUpload } from "../components/FileUpload";

const Home: NextPage = () => {
    const loggedIn = useIsAuth();
    const toast = useToast();

    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 30,
            cursor: null, //cursor will tell us at what point we want to fetch posts
        },
        notifyOnNetworkStatusChange: true, //loading will become true if click loadMore (enable the little spinning thing on load more button)
    });

    const [createPost] = useCreatePostMutation();

    if (!loading && !data) {
        return (
            <div>
                <div>
                    server is probs down rn so have a picture of one of the
                    greatest inspirations in my life
                </div>
                <img
                    width="50%"
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fircenterprises.com%2Fwp-content%2Fuploads%2F2020%2F06%2FDollar-Bill-scaled.jpeg&f=1&nofb=1"
                />
                <div>{error?.message}</div>
            </div>
        );
    }
    return (
        <>
            <Head>
                <title>Kyle Board</title>
                <meta name="description" content="Twitter but cooler" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                {/* only show the ability to make form if they're logged in */}
                {loggedIn ? (
                    <Formik
                        validationSchema={createPostSchema}
                        initialValues={{ text: "", file: null as File | null }}
                        onSubmit={async (values, { setErrors }) => {
                            const response = await createPost({
                                variables: { text: values.text },
                            });

                            if (response.data?.createPost.errors) {
                                //there was error
                                //transform the returned message error array into a map that formik understands
                                setErrors(
                                    toErrorMap(response.data.createPost.errors)
                                );
                            } else {
                                // reset the text
                                values.text = "";
                                values.file = null;

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
                            isSubmitting,
                            handleChange,
                            setFieldValue,
                            setFieldError,
                        }) => (
                            <Form>
                                <InputField
                                    label=""
                                    name="text"
                                    placeholder="type smthn here"
                                    onChange={handleChange}
                                    textarea
                                />

                                <FileUpload
                                    fieldName="file"
                                    accept={".jpg, .jpeg, .png, .gif"}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
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
                        <NewPosts />
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