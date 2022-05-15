import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { NextPage } from "next";
import { Layout } from "../components/Layout";
import { PageHeader } from "../components/PageHeader";
import { withApollo } from "../utils/withApollo";

const Changelog: NextPage = () => {
    return (
        <Layout
            pageName={"Changelog"}
            description={"some registered user on kyle board i dunno lol"}
        >
            <PageHeader title="Changelog" />
            <Heading>v1.2</Heading>
            <UnorderedList>
                <ListItem>upload videos</ListItem>
                <ListItem>seo fixes</ListItem>
                <ListItem>bug fixes</ListItem>
            </UnorderedList>

            <Box mb={4} />

            <Heading>v1.1</Heading>
            <UnorderedList>
                <ListItem>i don&apos;t remember</ListItem>
                <ListItem>was probably something important</ListItem>
            </UnorderedList>

            <Box mb={4} />

            <Heading>v1.0</Heading>
            <UnorderedList>
                <ListItem>initial release</ListItem>
            </UnorderedList>
        </Layout>
    );
};

export default withApollo({ ssr: true })(Changelog);
