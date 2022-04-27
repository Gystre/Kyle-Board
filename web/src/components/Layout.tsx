import Head from "next/head";
import { Navbar } from "./Navbar";
import { Wrapper, WrapperVariant } from "./Wrapper";

/*
    Contains the navbar, wrapper component, and SEO tags.
    Use this to create a basic page layout.
*/

interface Props {
    variant?: WrapperVariant;
    title?: string;
    pageName?: string;
    description?: string;
}

export const Layout: React.FC<Props> = ({
    children,
    variant,
    title = "Kyle Board",
    pageName = "",
    description = "None quite like it.",
}) => {
    const realTitle = pageName !== "" ? pageName + " | " + title : title;
    return (
        <>
            <Head>
                <title>{realTitle}</title>
                <meta name="description" content={description} />
                <meta name="theme-color" content="#1affd1" />
                <link rel="icon" href="/favicon.ico" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={realTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="/banner.png" />

                {/* Facebook Meta Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={realTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://kylegodly.com" />
                <meta property="og:image" content="/banner.png" />
            </Head>
            <Navbar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
