import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { count, DocumentData } from "firebase/firestore";
import { interface__ChatPage__message } from "../../types/interface__ChatPage";

// Import interface


// Define initial values
const initial_userChat = {
    chatCode: "",
    targetGmail: "",
    targetName: "",
    owners: [] as string[],
    requestRemove: "",
    messages: [] as interface__ChatPage__message[],
    newMessages: [] as interface__ChatPage__message[],
    amountNewChat: {} as Record<string, any>,
    newMessages_sender: "",
    lastMessages: {} as Record<string, any>,
    targetAvartarCode: "" as string
}

// Export reducer
export const userChat = createSlice({
    name: "userInformation",
    initialState: initial_userChat,
    reducers: {
        cacheSetChatCode: (state, action: PayloadAction<string>) => {
            state.chatCode = action.payload
        },

        cacheSetTargetAvatarCode: (state, action: PayloadAction<string>) => {
            state.targetAvartarCode = action.payload
        },
        
        cacheSetTargetGmail: (state, action: PayloadAction<string>) => {
            state.targetGmail = action.payload
        },

        cacheSetTargetName: (state, action: PayloadAction<string>) => {
            state.targetName = action.payload
        },

        cacheSetLastMessages: (state, action: PayloadAction<Record<string, any>>) => {
            state.lastMessages = {...action.payload}
        },

        cacheSetDefaultLastMessages: (state) => {
            state.lastMessages = {}
        },

        cacheSetMessages: (state, action: PayloadAction<interface__ChatPage__message[]>) => {
            state.messages = [...action.payload]
        },

        cacheAddAMessages: (state, action: PayloadAction<interface__ChatPage__message>) => {
            state.newMessages.push(action.payload)
        },

        cacheSetDefaultMessages: (state) => {
            state.messages = []
        },

        cacheSetNewMessages: (state, action: PayloadAction<interface__ChatPage__message[]>) => {
            state.newMessages = [...action.payload]
        },

        cacheUpdateAmountNewChat: (state, action: PayloadAction<Record<string, any>>) => {
            state.amountNewChat = {
                ...state.amountNewChat,
                ...action.payload
            } 
        },

        cacheSetNewMessages_sender: (state, action: PayloadAction<string>) => {
            state.newMessages_sender = action.payload
        },

        cacheSetDefaultNewMessages: (state) => {
            state.newMessages = []
        },

        cacheSetRequestRemove: (state, action: PayloadAction<string>) => {
            state.requestRemove = action.payload
        },
        
        cacheSetDefaultChat: (state) => {
            return { ...initial_userChat }
        },
    },
})

export const {
    cacheSetChatCode,
    cacheSetLastMessages,
    cacheSetTargetAvatarCode,
    cacheSetDefaultLastMessages,
    cacheSetTargetGmail,
    cacheSetTargetName,
    cacheSetMessages,
    cacheAddAMessages,
    cacheSetDefaultMessages,
    cacheSetNewMessages,
    cacheUpdateAmountNewChat,
    cacheSetNewMessages_sender,
    cacheSetDefaultNewMessages,
    cacheSetRequestRemove,
    cacheSetDefaultChat,
} = userChat.actions;

export default userChat.reducer