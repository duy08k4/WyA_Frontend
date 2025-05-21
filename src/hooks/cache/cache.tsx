// Import libraries
import React, { createContext, useContext, useEffect, useRef } from "react"

// Import interface
import {
    interface__authContext,
    interface__authProviderProps,
    interface__userInformation
} from "../../types/interface__Auth"

// Import Redux
import { cacheSetDefaultChat, cacheSetDefaultMessages, cacheSetDefaultNewMessages, cacheSetLastMessages, cacheSetMessages, cacheSetNewMessages, cacheSetNewMessages_sender, cacheSetRequestRemove, cacheUpdateAmountNewChat } from "../../redux/reducers/chat.reducer"
import { cacheSetFullUserInformation } from "../../redux/reducers/user.reducer"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"

// Import firebase
import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore"
import { db } from "../../config/firebaseSDK"

// Import services
import { cacheSetUserLocation_listUserOnline, cacheSetUserLocation_mapConnection, cacheSetUserLocation_requestShareLocation } from "../../redux/reducers/userLocation.reducer"

const CacheContext = createContext<interface__authContext | undefined>(undefined)

export const useCache = (): interface__authContext => {
    const context = useContext(CacheContext)

    if (!context) {
        throw new Error("useToast must be used within a CacheProvider");
    }

    return context
}

export const CacheProvider: React.FC<interface__authProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>()

    // Redux
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)
    const chatCode = useSelector((state: RootState) => state.userChat.chatCode)
    const listChatCode = useSelector((state: RootState) => state.userInformation.listChatCode)

    // Storage listener Event
    const subscribe_userInformation = useRef<(() => void) | undefined>(undefined);
    const subscribe_userChat_message = useRef<(() => void) | undefined>(undefined);
    const subscribe_userChat_newMessage = useRef<(() => void) | undefined>(undefined);
    const subscribe_userChat_amountNewMessage = useRef<(() => void) | undefined>(undefined);

    const subscribe_userLocation_listUserOnline = useRef<(() => void) | undefined>(undefined);
    const subscribe_userLocation_requestShareLocation = useRef<(() => void) | undefined>(undefined);
    const subscribe_userLocation_mapConnection = useRef<(() => void) | undefined>(undefined);

    // Custom hook

    // Function: Set data for Redux
    const cacheSetData = (param: any) => {
        dispatch(param)
    }

    // Handler
    useEffect(() => {
        if (chatCode == "") {
            disableListener_userChat_getNewMessage()
            disableListener_userChat_getMessage()
        } else {
            enableListener_userChat_getMessage()
            enableListener_userChat_getNewMessage()
        }
    }, [chatCode])

    useEffect(() => {
        if (gmail == "") {
            disableListener_userLocation_listUserOnline()
            disableListener_userLocation_requestShareLocation()
            disableListener_userLocation_mapConnection
        } else {
            enableListener_userLocation_listUserOnline(gmail)
            enableListener_userLocation_requestShareLocation()
            enableListener_userLocation_mapConnection()
        }
    }, [gmail])

    // Listener
    const enableListener_userInformation = (gmailInput: string) => { //Get userInformation

        if (subscribe_userInformation.current) {
            cacheSetData(cacheSetFullUserInformation(undefined))
            return
        }

        subscribe_userInformation.current = onSnapshot(doc(db, "userInformation", btoa(gmailInput)), (doc) => {
            const data = doc.data()
            if (data) {
                const getLastMessage = data.lastMessages
                cacheSetData(cacheSetFullUserInformation(data))
                cacheSetData(cacheSetLastMessages(getLastMessage))
                enableListener_userChat_amountNewMessage()
            } else {
                cacheSetData(cacheSetFullUserInformation(undefined))
                cacheSetData(cacheSetDefaultChat())
            }
        })

    }

    const enableListener_userChat_getMessage = () => {
        if (subscribe_userChat_message.current) {
            return
        }

        subscribe_userChat_message.current = onSnapshot(doc(db, "chat", btoa(chatCode)), async (document) => {
            const data = document.data()

            if (data) {
                cacheSetData(cacheSetMessages(data.messages))
                if (data.requestRemove) {
                    cacheSetData(cacheSetRequestRemove(data.requestRemove))
                } else {
                    cacheSetData(cacheSetRequestRemove(""))
                }
            } else {
                cacheSetData(cacheSetMessages([]))
            }
        })
    }

    const enableListener_userChat_getNewMessage = () => {
        if (subscribe_userChat_newMessage.current) {
            return
        }

        subscribe_userChat_newMessage.current = onSnapshot(doc(db, "newMessage", btoa(chatCode)), async (document) => {
            const data = document.data()

            if (data) {
                cacheSetData(cacheSetNewMessages(data.messages))
                cacheSetData(cacheSetNewMessages_sender(data.recentSender))
                enableListener_userChat_amountNewMessage()
            } else {
                cacheSetData(cacheSetNewMessages([]))
            }
        })
    }

    const enableListener_userChat_amountNewMessage = async () => {
        const querySnapshot = await getDocs(collection(db, "newMessage"));

        querySnapshot.forEach((val) => {
            const amountNewMessage = val.data().messages.length === 0 ? 0 : val.data().messages.length;
            cacheSetData(cacheUpdateAmountNewChat({
                [atob(val.id)]: {
                    amountNewMessage,
                    sender: val.data().recentSender
                }
            }));
        });
    }

    const enableListener_userLocation_listUserOnline = async (clientGmail: string) => {
        if (subscribe_userLocation_listUserOnline.current) {
            return
        }

        subscribe_userLocation_listUserOnline.current = onSnapshot(doc(db, "userActiveStatus", btoa(clientGmail)), (doc) => {
            const data = doc.data()
            if (data) {
                console.log(data)
                cacheSetData(cacheSetUserLocation_listUserOnline(data))
            }
        })
    }

    const enableListener_userLocation_requestShareLocation = () => {
        if (subscribe_userChat_newMessage.current) {
            return
        }

        subscribe_userLocation_requestShareLocation.current = onSnapshot(doc(db, "requestShareLocation", btoa(gmail)), async (document) => {
            const data = document.data()

            if (data) {
                console.log(Object.values(data))
                cacheSetData(cacheSetUserLocation_requestShareLocation(Object.values(data)))
            } else {
                cacheSetData(cacheSetUserLocation_requestShareLocation([]))
            }
        })
    }

    const enableListener_userLocation_mapConnection = () => {

        if (subscribe_userLocation_mapConnection.current) {
            return
        }

        subscribe_userLocation_mapConnection.current = onSnapshot(doc(db, "mapConnection", btoa(gmail)), (doc) => {
            const data = doc.data()
            
            if (data) {
                cacheSetData(cacheSetUserLocation_mapConnection(Object.values(data)))
            } else {
                
            }
        })

    }

    // Off listener
    const disableListener_userInformation = () => {
        if (subscribe_userInformation.current) {
            subscribe_userInformation.current()
            subscribe_userInformation.current = undefined
        }
    }

    const disableListener_userChat_getMessage = () => {
        if (subscribe_userChat_message.current) {
            subscribe_userChat_message.current()
            subscribe_userChat_message.current = undefined
        }
    }

    const disableListener_userChat_getNewMessage = () => {
        if (subscribe_userChat_newMessage.current) {
            subscribe_userChat_newMessage.current()
            subscribe_userChat_newMessage.current = undefined
        }
    }

    const disableListener_userLocation_listUserOnline = () => {
        if (subscribe_userLocation_listUserOnline.current) {
            subscribe_userLocation_listUserOnline.current()
            subscribe_userLocation_listUserOnline.current = undefined
        }
    }

    const disableListener_userLocation_requestShareLocation = () => {
        if (subscribe_userLocation_requestShareLocation.current) {
            subscribe_userLocation_requestShareLocation.current()
            subscribe_userLocation_requestShareLocation.current = undefined
        }
    }

    const disableListener_userLocation_mapConnection = () => {
        if (subscribe_userLocation_mapConnection.current) {
            subscribe_userLocation_mapConnection.current()
            subscribe_userLocation_mapConnection.current = undefined
        }
    }

    return (
        <CacheContext.Provider value={{
            cacheSetData,

            enableListener_userInformation,
            enableListener_userChat_getMessage,
            enableListener_userChat_getNewMessage,
            enableListener_userChat_amountNewMessage,
            enableListener_userLocation_listUserOnline,
            enableListener_userLocation_requestShareLocation,
            enableListener_userLocation_mapConnection,

            disableListener_userInformation,
            disableListener_userChat_getMessage,
            disableListener_userChat_getNewMessage,
            disableListener_userLocation_requestShareLocation,
            disableListener_userLocation_mapConnection
        }}>
            {children}
        </CacheContext.Provider>
    )
}