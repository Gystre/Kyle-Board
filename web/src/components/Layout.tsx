import { FileType } from "@kyle/common";
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
    fileUrl?: string; // the file in the embed, will default to some banner thing if can't find anything
    fileType?: FileType;
}

export const Layout: React.FC<Props> = ({
    children,
    variant,
    title = "Kyle Board",
    pageName = "",
    description = "None quite like it.",
    fileUrl = "/banner.png",
    fileType = FileType.Unknown,
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
                {fileType == FileType.Image ? (
                    <>
                        <meta
                            name="twitter:card"
                            content="summary_large_image"
                        />
                        <meta name="twitter:image" content={fileUrl} />
                        <meta property="og:image" content={fileUrl} />
                    </>
                ) : null}
                {fileType == FileType.Video ? (
                    <>
                        <meta name="twitter:card" content="player" />
                        <meta name="twitter:player" content={fileUrl} />
                        <meta property="og:video" content={fileUrl} />
                    </>
                ) : null}
                <meta name="twitter:title" content={realTitle} />
                <meta name="twitter:description" content={description} />

                {/* Facebook Meta Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={realTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://kylegodly.com" />
            </Head>
            <Navbar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
