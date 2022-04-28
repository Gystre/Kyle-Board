import { Box, Button, Heading, Link, Text, useToast } from "@chakra-ui/react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { createRegisterSchema } from "@kyle/common";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormDecorator } from "../components/FormDecorator";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import WithSpeechBubbles from "../components/WithSpeechBubbles";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

export const Register: React.FC<{}> = () => {
    //used to redirect user
    const router = useRouter();
    const toast = useToast();
    const [register] = useRegisterMutation();

    const onExpire = () => {
        toast({
            title: "hCaptcha token expired, please refresh the page",
            position: "top",
            status: "error",
            isClosable: true,
            duration: 5000,
        });
        console.log("hCaptcha token Expired");
    };

    const onError = (err: any) => {
        toast({
            title: `hCaptcha Error: ${err}`,
            position: "top",
            status: "error",
            isClosable: true,
            duration: 5000,
        });
        console.log(`hCaptcha Error: ${err}`);
    };

    return (
        <Layout variant="small" pageName="Register">
            <Heading fontSize="xl">Register</Heading>
            <Text mb="3">
                Join a community of millions! That is if every single cell in my
                body was registered for this website :/
            </Text>
            <Formik
                validationSchema={createRegisterSchema}
                initialValues={{
                    email: "",
                    username: "",
                    password: "",
                    captchaToken: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values);

                    const response = await register({
                        variables: {
                            email: values.email,
                            username: values.username,
                            password: values.password,
                            captchaToken: values.captchaToken,
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
                {({ isSubmitting, handleChange, setFieldValue }) => (
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

                        <Box mt={4} />
                        <FormDecorator label="Captcha" name="captchaToken">
                            <HCaptcha
                                sitekey={
                                    process.env
                                        .NEXT_PUBLIC_HCAPTCHA_SITEKEY as string
                                }
                                onVerify={(captchaToken, ekey) => {
                                    console.log(captchaToken, ekey);

                                    setFieldValue("captchaToken", captchaToken);
                                }}
                                onError={onError}
                                onExpire={onExpire}
                            />
                        </FormDecorator>
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
