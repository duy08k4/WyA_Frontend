import React, { createContext, useContext, useEffect, useRef } from "react"
import {
    interface__authContext,
    interface__authProviderProps,
    interface__userInformation
} from "../../types/interface__Auth"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import { collection, doc, DocumentData, getDoc, getDocs, onSnapshot } from "firebase/firestore"
import { db } from "../../config/firebaseSDK"
import { cacheSetFullUserInformation } from "../../redux/reducers/user.reducer"
import { cacheSetDefaultChat, cacheSetDefaultMessages, cacheSetDefaultNewMessages, cacheSetLastMessages, cacheSetMessages, cacheSetNewMessages, cacheSetNewMessages_sender, cacheSetRequestRemove, cacheUpdateAmountNewChat } from "../../redux/reducers/chat.reducer"
import { meregMessage } from "../../services/sendMessage.serv"

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

    // Function: Set data for Redux
    const cacheSetData = (param: any) => {
        dispatch(param)
    }

    // Handler
    useEffect(() => {
        console.log(chatCode == "" ? true : false)
        if (chatCode == "") {
            disableListener_userChat_getNewMessage()
            disableListener_userChat_getMessage()
        } else {
            enableListener_userChat_getMessage()
            enableListener_userChat_getNewMessage()
        }
    }, [chatCode])

    // Listener
    const enableListener_userInformation = (gmailInput: string) => { //Get userInformation

        if (subscribe_userInformation.current) {
            console.log("Started before")
            cacheSetData(cacheSetFullUserInformation(undefined))
            return
        }

        subscribe_userInformation.current = onSnapshot(doc(db, "userInformation", btoa(gmailInput)), (doc) => {
            const data = doc.data()
            if (data) {
                console.log(data)
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
            console.log("start get message")
            return
        }

        subscribe_userChat_message.current = onSnapshot(doc(db, "chat", btoa(chatCode)), async (document) => {
            const data = document.data()
            console.log(data)
            
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
            console.log("start get new message")
            return
        }

        subscribe_userChat_newMessage.current = onSnapshot(doc(db, "newMessage", btoa(chatCode)), async (document) => {
            const data = document.data()
            console.log(data)
            
            if (data) {
                cacheSetData(cacheSetNewMessages(data.messages))
                cacheSetData(cacheSetNewMessages_sender(data.recentSender))
                enableListener_userChat_amountNewMessage()
                meregMessage({ chatCode })
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

    // Off listener
    const disableListener_userInformation = () => {
        if (subscribe_userInformation.current) {
            subscribe_userInformation.current()
            subscribe_userInformation.current = undefined
            console.log("stop listen UserInformation")
        }
    }

    const disableListener_userChat_getMessage = () => {
        if (subscribe_userChat_message.current) {
            subscribe_userChat_message.current()
            subscribe_userChat_message.current = undefined
            console.log("stop listen getMessage")
        }
    }

    const disableListener_userChat_getNewMessage = () => {
        if (subscribe_userChat_newMessage.current) {
            subscribe_userChat_newMessage.current()
            subscribe_userChat_newMessage.current = undefined
            console.log("stop listen get New Message")
        }
    }

    return (
        <CacheContext.Provider value={{
            cacheSetData,

            enableListener_userInformation,
            enableListener_userChat_getMessage,
            enableListener_userChat_getNewMessage,
            enableListener_userChat_amountNewMessage,

            disableListener_userInformation,
            disableListener_userChat_getMessage,
            disableListener_userChat_getNewMessage,
        }}>
            {children}
        </CacheContext.Provider>
    )
}