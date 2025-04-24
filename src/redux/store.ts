import { configureStore } from "@reduxjs/toolkit";

// Import Reducers
import userInformation from "./reducers/user.reducer";

export const store = configureStore({
    reducer: {
        userInformation: userInformation
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
