import { ReactNode } from "react";
import { interface__FriendPage__connections } from "./interface__FriendPage";

interface interface__socketContext {
    sendListFriendToSck: (data: interface__Socket__sendListFriendToSck) => void,
    setStatusWhenLogout: (gmail: string) => void
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

export type {
    interface__socketContext,
    interface__socketProviderProps,
    interface__Socket__sendListFriendToSck,
    interface__Socket__updateUserActivateStatus
}