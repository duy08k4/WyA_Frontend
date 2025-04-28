import React, { createContext, useContext, useRef } from "react"
import {
    interface__authContext,
    interface__authProviderProps,
    interface__userInformation
} from "../../types/interface__Auth"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { doc, DocumentData, onSnapshot } from "firebase/firestore"
import { db } from "../../config/firebaseSDK"
import { cacheSetFullUserInformation } from "../../redux/reducers/user.reducer"

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

    // Storage listener Event
    const subscribe_userInformation = useRef<(() => void) | undefined>(undefined);

    // Function: Set data for Redux
    const cacheSetData = (param: any) => {
        dispatch(param)
    }

    // Listener
    const enableListener_userInformation = (gmail: string) => {

        if (subscribe_userInformation.current) {
            console.log("Started before")
            cacheSetData(cacheSetFullUserInformation(undefined))
            return
        }
        
        subscribe_userInformation.current = onSnapshot(doc(db, "userInformation", btoa(gmail)), (doc) => {
            const data = doc.data()
            if (data) {
                console.log(doc.data())
                cacheSetData(cacheSetFullUserInformation(data))
            } else {
                cacheSetData(cacheSetFullUserInformation(undefined))
            }
        })

    }


    const disableListener_userInformation = () => {
        if (subscribe_userInformation.current) {
            subscribe_userInformation.current()
            subscribe_userInformation.current = undefined
            console.log("stop listen UserInformation")
        }
    }

    return (
        <CacheContext.Provider value={{
            cacheSetData,
            enableListener_userInformation,
            disableListener_userInformation
        }}>
            {children}
        </CacheContext.Provider>
    )
}