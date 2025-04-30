import { ReactNode } from "react";

interface interface__authContext {
    cacheSetData: (param: any) => void,
    enableListener_userInformation: (gmail: string) => void,
    disableListener_userInformation: () => void
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