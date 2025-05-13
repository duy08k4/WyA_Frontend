import { ReactNode } from "react";
import { interface__FriendPage__connections } from "./interface__FriendPage";
import { interface__MapPage__MapConnection } from "./interface__MapPage";

interface interface__socketContext {
    sendListFriendToSck: (data: interface__Socket__sendListFriendToSck) => void,
    setStatusWhenLogout: (gmail: string) => void,
    shareLocation: (data: interface__Socket__shareLocation) => void
}

interface interface__socketProviderProps {
    children: ReactNode;
}

interface interface__Socket__sendListFriendToSck {
    listFriends: interface__FriendPage__connections[],
    gmail: string
}

interface interface__Socket__updateUserActivateStatus {
    status: boolean,
    gmail: string
}

interface interface__Socket__sendRequestLocation {
    clientGmail: string,
    targetGmail: string
}

interface interface__Socket__shareLocation {
    clientGmail: string,
    clientLocation: [number, number],
    targetUsers: interface__MapPage__MapConnection[]
}

export type {
    interface__socketContext,
    interface__socketProviderProps,
    interface__Socket__sendListFriendToSck,
    interface__Socket__updateUserActivateStatus,
    interface__Socket__sendRequestLocation,
    interface__Socket__shareLocation
}