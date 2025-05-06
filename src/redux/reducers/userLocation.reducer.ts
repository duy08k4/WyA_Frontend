import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Import interface

// Define initial values
const initial__userLocation = {
    targetGmail: "",
    targetLocation: [] as number[],
    clientLocation: [] as number [],
    listUserOnline: {} as Record<string, any>
}

// Export reducer
export const userLocation = createSlice({
    name: "userLocation",
    initialState: initial__userLocation,
    reducers: {
        // Các action trong reducer sẽ được tự động tạo ra
        cacheSetUserLocation_targetGmail: (state, action: PayloadAction<string>) => {
            state.targetGmail = action.payload
        },

        cacheSetUserLocation_targetLocation: (state, action: PayloadAction<number[]>) => {
            state.targetLocation = [...action.payload]
        },

        cacheSetUserLocation_clientLocation: (state, action: PayloadAction<number[]>) => {
            state.clientLocation = [...action.payload]
        },

        cacheSetUserLocation_listUserOnline: (state, action: PayloadAction<Object>) => {
            state.listUserOnline = action.payload
        },
        
    },
})

export const {
    cacheSetUserLocation_targetGmail,
    cacheSetUserLocation_targetLocation,
    cacheSetUserLocation_clientLocation,
    cacheSetUserLocation_listUserOnline
} = userLocation.actions;

export default userLocation.reducer