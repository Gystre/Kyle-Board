import { createContext } from "react";
import io from "socket.io-client";

/*
    Need to store the socket object in a global context and wrap the entire app around the SocketProvider component.
    This way we can ensure that only ONE OF THESE THINGS exist.
*/

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
    withCredentials: true,
});

export const socketContext = createContext(socket);

interface SocketProviderProps {}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
};
