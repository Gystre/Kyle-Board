import { Box, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/PageHeader";
import { Post as PostComponent } from "../../components/Post";
import { usePostQuery } from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const Post: NextPage = () => {
    const router = useRouter();
    const postId =
        typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const { data, error, loading } = usePostQuery({
        skip: postId === -1,
        variables: { id: postId },
    });

    if (loading) {
        return (
            <Layout>
                <Box mb={4}>Loading stuff...</Box>
                <Spinner size="xl" />
            </Layout>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    //couldn't find a post with that id
    if (!data?.post) {
        return (
            <Layout>
                <Box>Couldn&apos;t find post</Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <PageHeader title="Post" />
            <PostComponent post={data.post} noBorder />
        </Layout>
    );
};

export default withApollo({ ssr: true })(Post);
