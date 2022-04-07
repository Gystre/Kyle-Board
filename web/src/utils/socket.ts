import { useApolloClient } from "@apollo/client";
import { SocketCmds } from "@kyle/common";
import { useEffect } from "react";
import io from "socket.io-client";
import { PostResultFragment } from "../generated/graphql";

//read somewhere that it's better to keep this in a createContext and give a provider globally but can only use that in FC so kinda sux
const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
    autoConnect: false,
    withCredentials: true,
});

export const useSocket = () => {
    const apolloClient = useApolloClient();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();

            socket.on(SocketCmds.SendMessage, (post: PostResultFragment) => {
                // date comes in 2022-03-08T23:18:21.279Z for some reason so fix it
                post.createdAt = new Date(post.createdAt).getTime().toString();

                // i should really insert the post manually into the cache but this works fine for now
                apolloClient.resetStore();
            });

            socket.on(SocketCmds.DeleteMessage, (id) => {
                apolloClient.cache.evict({ id: "Post:" + id });
                apolloClient.cache.gc();
            });
        }
    }, [socket]);

    return socket;
};
