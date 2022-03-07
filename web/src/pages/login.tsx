import {
    Box,
    Flex,
    Button,
    Link,
    Input,
    Text,
    Heading,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withApollo } from "../utils/withApollo";
import { useRouter } from "next/router";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import NextLink from "next/link";
import { toErrorMap } from "../utils/toErrorMap";
import { InputField } from "../components/InputField";

export const Login: React.FC<{}> = () => {
    //used to redirect user
    const router = useRouter();
    const [login] = useLoginMutation();

    return (
        <Wrapper variant="small">
            <Heading fontSize="xl">Login</Heading>
            <Text mb="3">haha loser</Text>
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors, setFieldError }) => {
                    const response = await login({
                        variables: values,
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument, //MeDocument = query in a gql string
                                data: {
                                    __typename: "Query",
                                    me: data?.login.user,
                                },
                            });

                            //clear all posts on login
                            // cache.evict({ fieldName: "posts:{}" });
                            // cache.gc();
                        },
                    });

                    if (response.data?.login.errors) {
                        //there was error
                        //transform the returned message error array into a map that formik understands
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        if (typeof router.query.next === "string") {
                            //worked, redirec them to the page they were on
                            router.push(router.query.next);
                        } else {
                            //worked, redirect them to homepage
                            router.push("/");
                        }
                    }
                }}
            >
                {({ isSubmitting, handleChange }) => (
                    <Form>
                        <InputField
                            label="Username or Email"
                            name="usernameOrEmail"
                            placeholder="Username or Email"
                            onChange={handleChange}
                        />
                        <Box mt={4}>
                            <InputField
                                label="Password"
                                name="password"
                                placeholder="Password"
                                type="password"
                                onChange={handleChange}
                            />
                        </Box>
                        <Flex mt={3}>
                            <NextLink href="/forgot-password" passHref>
                                <Link
                                    ml="auto"
                                    color="teal.500"
                                    textDecoration="underline"
                                >
                                    Forgot password?
                                </Link>
                            </NextLink>
                        </Flex>
                        <Button mt={4} type="submit" isLoading={isSubmitting}>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>

            <Text mt={4}>
                Or{" "}
                <NextLink href="/register" passHref>
                    <Link color="teal.500">register now</Link>
                </NextLink>
            </Text>
        </Wrapper>
    );
};

//don't need ssr here b/c no js is being evaluated to make HTML look different
export default withApollo({ ssr: false })(Login);
