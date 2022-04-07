import Head from "next/head";
import { Navbar } from "./Navbar";
import { Wrapper, WrapperVariant } from "./Wrapper";

/*
    Contains the navbar, wrapper component, and SEO tags.
    Use this to create a basic page layout.
*/

interface Props {
    variant?: WrapperVariant;
}

export const Layout: React.FC<Props> = ({ children, variant }) => {
    return (
        <>
            <Head>
                <title>Kyle Board</title>
                <meta name="description" content="Twitter but cooler" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
