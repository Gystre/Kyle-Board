import io from "socket.io-client";

//read somewhere that it's better to keep this in a createContext and give a provider globally but can only use that in FC so kinda sux
export const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
    autoConnect: false,
    withCredentials: true,
});
