import Head from "next/head";
import { Navbar } from "./Navbar";
import { Wrapper, WrapperVariant } from "./Wrapper";

/*
    Contains the navbar, wrapper component, and SEO tags.
    Use this to create a basic page layout.
*/

interface Props {
    variant?: WrapperVariant;
    title?: string; // used to complete the title
    pageName?: string; // used to complete the title
    description?: string; // the desc text you see in the embed
    imageUrl?: string; // the image in the embed
}

export const Layout: React.FC<Props> = ({
    children,
    variant,
    title = "Kyle Board",
    pageName = "",
    description = "None quite like it.",
    imageUrl = "/banner.png",
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
                <meta name="twitter:image" content={imageUrl} />

                {/* Facebook Meta Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={realTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://kylegodly.com" />
                <meta property="og:image" content={imageUrl} />
            </Head>
            <Navbar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
