import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { interface__Socket__sendListFriendToSck, interface__Socket__updateUserActivateStatus, interface__socketContext, interface__socketProviderProps } from "../../types/interface__Socket";
import { interface__FriendPage__connections } from "../../types/interface__FriendPage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useCache } from "../cache/cache";

const SocketContext = createContext<interface__socketContext | undefined>(undefined);

export const useSocket = (): interface__socketContext => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<interface__socketProviderProps> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    //   Redux
    const listFriends = useSelector((state: RootState) => state.userInformation.friends)

    const { cacheSetData } = useCache()
    
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_GATE, {
            transports: ["websocket"],
            withCredentials: true,
        });

        socketRef.current = socket;

        // Listener socket server


        // Cleanup when component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendListFriendToSck = (data: interface__Socket__sendListFriendToSck) => {
        socketRef.current?.emit("connected", data)
    }

    const setStatusWhenLogout = (gmail: string) => {
        if (gmail && gmail != "") {
            socketRef.current?.emit("userLogout", gmail)
        } else {
            console.log("Socket<userLogout>: Gmail is invalid")
        }
    }

    return (
        <SocketContext.Provider value={{ sendListFriendToSck, setStatusWhenLogout }}>
            {children}
        </SocketContext.Provider>
    );
};
