import { configureStore } from "@reduxjs/toolkit";

// Import Reducers
import userInformation from "./reducers/user.reducer";
import userChat from "./reducers/chat.reducer";


export const store = configureStore({
    reducer: {
        userInformation: userInformation,
        userChat: userChat
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
