import { configureStore } from "@reduxjs/toolkit";

// Import Reducers
import userInformation from "./reducers/user.reducer";
import userChat from "./reducers/chat.reducer";
import userLocation from "./reducers/userLocation.reducer";


export const store = configureStore({
    reducer: {
        userInformation: userInformation,
        userChat: userChat,
        userLocation: userLocation
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
