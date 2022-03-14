import { Flex, Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import {
    MeDocument,
    MeQuery,
    useChangePasswordMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        variables: {
                            newPassword: values.newPassword,
                            token:
                                typeof router.query.token === "string"
                                    ? router.query.token
                                    : "",
                        },

                        //log the user in once they finish resetting password
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument, //MeDocument = query in a gql string
                                data: {
                                    __typename: "Query",
                                    me: data?.changePassword.user,
                                },
                            });
                        },
                    });
                    if (response.data?.changePassword.errors) {
                        //there was error
                        //transform the returned message error array into a map that formik understands
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );

                        if ("token" in errorMap) {
                            //pass in error msg for token
                            setTokenError(errorMap.token);
                        }

                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        //worked, redirect them to homepage
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError ? (
                            <Flex>
                                <Box mr={4} style={{ color: "red" }}>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgot-password" passHref>
                                    <Link>click here to get a new link</Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button mt={4} type="submit" isLoading={isSubmitting}>
                            Change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(ChangePassword);