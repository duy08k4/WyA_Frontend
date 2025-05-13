import { ReactNode } from "react";

interface interface__authContext {
    cacheSetData: (param: any) => void,

    // Listener
    enableListener_userInformation: (gmail: string) => void,
    enableListener_userChat_getMessage: () => void,
    enableListener_userChat_getNewMessage: () => void,
    enableListener_userChat_amountNewMessage: () => void,
    enableListener_userLocation_listUserOnline: (clientGmail: string) => void,
    enableListener_userLocation_requestShareLocation: () => void,
    enableListener_userLocation_mapConnection: () => void,

    // Disable Listener
    disableListener_userInformation: () => void,
    disableListener_userChat_getMessage: () => void,
    disableListener_userChat_getNewMessage: () => void,
    disableListener_userLocation_requestShareLocation: () => void,
    disableListener_userLocation_mapConnection: () => void
}

interface interface__authProviderProps {
    children: ReactNode,
}

interface interface__userInformation {
    username: string,
    gmail: string,
    uuid: string,
    avartarCode: string,
    friends: string[] | string,
    requests: string[] | string,
    setting: {} | string, // hoặc cụ thể hơn nếu có
    profileStatus: string
}

export type { interface__authContext, interface__authProviderProps, interface__userInformation }