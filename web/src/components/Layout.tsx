import Head from "next/head";
import { Navbar } from "./Navbar";
import { WrapperVariant, Wrapper } from "./Wrapper";

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
