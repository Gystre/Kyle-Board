import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { SocketProvider } from "../components/SocketProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <SocketProvider>
                <Component {...pageProps} />
            </SocketProvider>
        </ChakraProvider>
    );
}

export default MyApp;
