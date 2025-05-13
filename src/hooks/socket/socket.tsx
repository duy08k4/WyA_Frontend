//  Import libraries
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Import Socket
import { io, Socket } from "socket.io-client";

// Import interface
import { interface__Socket__sendListFriendToSck, interface__Socket__sendRequestLocation, interface__Socket__shareLocation, interface__Socket__updateUserActivateStatus, interface__socketContext, interface__socketProviderProps } from "../../types/interface__Socket";
import { interface__FriendPage__connections } from "../../types/interface__FriendPage";

// Import redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { cacheUpdateUserLocation_targetLocation, cacheUpdateUserLocation_targetLocation_setAll, cacheUpdateUserLocation_targetRouting } from "../../redux/reducers/userLocation.reducer";

// Import custom
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
    const listUserOnline = useSelector((state: RootState) => state.userLocation.listUserOnline)
    const targetLocation = useSelector((state: RootState) => state.userLocation.targetLocation)
    const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)
    const targetRouting = useSelector((state: RootState) => state.userLocation.targetRouting)

    const { cacheSetData } = useCache()

    useEffect(() => {
        const targetLocation_copy = targetLocation

        mapConnection.forEach(user => {
            const userGmail = user.gmail

            if (!listUserOnline[btoa(userGmail)]) {
                delete targetLocation_copy[btoa(userGmail)]

                if (targetRouting[btoa(userGmail)]) {
                    cacheSetData(cacheUpdateUserLocation_targetRouting({
                        targetGmail: "",
                        targetLocation: [0, 0]
                    }))
                }
            }
        })

        cacheSetData(cacheUpdateUserLocation_targetLocation_setAll(targetLocation_copy))

    }, [listUserOnline])

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_GATE, {
            transports: ["websocket"],
            withCredentials: true,
        });

        socketRef.current = socket;

        // Listener socket server

        socket.on("receiveLocation", (data) => {
            if (targetRouting[btoa(data.from)]) {
                cacheSetData(cacheUpdateUserLocation_targetRouting({
                    targetGmail: data.from,
                    targetLocation: data.location
                }))
            }

            cacheSetData(cacheUpdateUserLocation_targetLocation({
                targetGmail: data.from,
                location: data.location
            }))
        })


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

    const shareLocation = (data: interface__Socket__shareLocation) => {
        const clientLocation = data.clientLocation
        const clientGmail = data.clientGmail
        const targetUsers = data.targetUsers
        let targetUsersGmail = [] as string[]

        targetUsers.forEach(user => {
            if (listUserOnline[btoa(user.gmail)]) {
                targetUsersGmail.push(user.gmail)
            }
        })

        if (targetUsersGmail.length != 0) {
            socketRef.current?.emit("shareLocation", {clientGmail, clientLocation, targetUsersGmail})
        }
    }

    return (
        <SocketContext.Provider value={{ sendListFriendToSck, setStatusWhenLogout, shareLocation }}>
            {children}
        </SocketContext.Provider>
    );
};
