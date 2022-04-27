import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
    const router = useRouter();

    const [forgotPassword] = useForgotPasswordMutation();

    return (
        <Layout pageName="Forgot Password">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    await forgotPassword({ variables: values });

                    router.replace("/login?forgotPassword=true");
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="Email"
                            />
                        </Box>

                        <Button mt={4} type="submit" isLoading={isSubmitting}>
                            Forgot password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(ForgotPassword);
