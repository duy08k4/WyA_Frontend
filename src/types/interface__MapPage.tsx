import { interface__FriendPage__connections } from "./interface__FriendPage"

interface interface__MapPage__Props {
    closeMenu: () => void,
}

interface interface__MapPage__Routing__Props {
    closeMenu: () => void,
    handleRoutingTargetUser: (targetGmail: string, targetName: string) => void,
    handleCloseRoutingTargetUser: (isToast:boolean) => void
}

interface interface__MapPage__DetailMarker__Props {
    closeMenu: () => void,
}

interface interface__MapPage__SendRequestShareLocation {
    clientGmail: string,
    clientName: string,
    clientAvartarCode: string,
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
}

interface interface__MapPage__RequestShareLocation {
    type: "sender" | "receiver",
    gmail: string,
    username: string,
    avartarCode: string
}

interface interface__MapPage__RevokeRequestShareLocation {
    clientGmail: string
    request_gmail: string
}

interface interface__MapPage__AcceptRequestShareLocation {
    clientGmail: string,
    clientName: string,
    clientAvartarCode: string,
    request_gmail: string,
    request_username: string,
    request_avartarCode: string
}

interface interface__MapPage__MapConnection {
    gmail: string,
    username: string,
    avartarCode: string
}

interface interface__MapPage__Disconect {
    type: "oneConnection" | "allConnection",
    clientGmail: string,
    targetConnection: interface__MapPage__MapConnection[]
}

export type {
    interface__MapPage__Props,
    interface__MapPage__Routing__Props,
    interface__MapPage__DetailMarker__Props,

    interface__MapPage__SendRequestShareLocation,
    interface__MapPage__RequestShareLocation,
    interface__MapPage__RevokeRequestShareLocation,
    interface__MapPage__AcceptRequestShareLocation,
    interface__MapPage__MapConnection,
    interface__MapPage__Disconect
}