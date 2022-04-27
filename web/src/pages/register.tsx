import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";
import { createRegisterSchema } from "@kyle/common";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import WithSpeechBubbles from "../components/WithSpeechBubbles";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

export const Register: React.FC<{}> = () => {
    //used to redirect user
    const router = useRouter();
    const [register] = useRegisterMutation();

    return (
        <Layout variant="small" pageName="Register">
            <Heading fontSize="xl">Register</Heading>
            <Text mb="3">
                Join a community of millions! That is if every single cell in my
                body was registered for this website :/
            </Text>
            <Formik
                validationSchema={createRegisterSchema}
                initialValues={{ email: "", username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({
                        variables: {
                            email: values.email,
                            username: values.username,
                            password: values.password,
                        },

                        //take the result of the data and stick it into the me query on register
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: "Query",
                                    me: data?.register.user,
                                },
                            });
                        },
                    });

                    if (response.data?.register.errors) {
                        //there was error
                        //transform the returned message error array into a map that formik understands
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        //worked, redirect them to homepage
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting, handleChange }) => (
                    <Form>
                        <InputField
                            label="Username"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                        />
                        <Box mt={4} />
                        <InputField
                            label="Email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                        />
                        <Box mt={4} />
                        <InputField
                            label="Password"
                            name="password"
                            placeholder="Password"
                            type="password"
                            onChange={handleChange}
                        />

                        <Button mt={4} type="submit" isLoading={isSubmitting}>
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
            <Text mt={4}>
                Or{" "}
                <NextLink href="/login" passHref>
                    <Link color="teal.500">login now</Link>
                </NextLink>
            </Text>
            <WithSpeechBubbles />
        </Layout>
    );
};

export default withApollo({ ssr: false })(Register);
