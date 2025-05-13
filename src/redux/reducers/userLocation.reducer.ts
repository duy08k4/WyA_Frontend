import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { interface__MapPage__MapConnection, interface__MapPage__RequestShareLocation } from "../../types/interface__MapPage";

// Import interface

// Define initial values
const initial__userLocation = {
    targetRouting: {} as Record<string, [number, number]>,
    targetLocation: {} as Record<string, [number, number]>,
    clientLocation: [] as number[],
    listUserOnline: {} as Record<string, any>,
    shareLocationRequest: [] as interface__MapPage__RequestShareLocation[],
    mapConnection: [] as interface__MapPage__MapConnection[]
}

// Export reducer
export const userLocation = createSlice({
    name: "userLocation",
    initialState: initial__userLocation,
    reducers: {
        // Các action trong reducer sẽ được tự động tạo ra
        cacheUpdateUserLocation_targetRouting: (state, action: PayloadAction<{ targetGmail: string, targetLocation: [number, number]}>) => {
            const data = action.payload

            if (data.targetGmail != "") {
                state.targetLocation = {
                    [btoa(data.targetGmail)]: [...data.targetLocation]
                }
            } else {
                state.targetLocation = {}
            }
        },

        cacheUpdateUserLocation_targetLocation: (state, action: PayloadAction<{ targetGmail: string, location: [number, number] }>) => {
            const getTargetGmail = action.payload.targetGmail
            const getTargetLocation = action.payload.location
            state.targetLocation[btoa(getTargetGmail)] = getTargetLocation
        },

        cacheUpdateUserLocation_targetLocation_setAll: (state, action: PayloadAction<Record<string, [number, number]>>) => {
            state.targetLocation = action.payload
        },

        cacheSetUserLocation_clientLocation: (state, action: PayloadAction<number[]>) => {
            state.clientLocation = [...action.payload]
        },

        cacheSetUserLocation_requestShareLocation: (state, action: PayloadAction<interface__MapPage__RequestShareLocation[]>) => {
            state.shareLocationRequest = [...action.payload]
        },

        cacheSetUserLocation_listUserOnline: (state, action: PayloadAction<Object>) => {
            state.listUserOnline = action.payload
        },

        cacheSetUserLocation_mapConnection: (state, action: PayloadAction<interface__MapPage__MapConnection[]>) => {
            state.mapConnection = [...action.payload]
        },
    },
})

export const {
    cacheUpdateUserLocation_targetRouting,
    cacheUpdateUserLocation_targetLocation,
    cacheUpdateUserLocation_targetLocation_setAll,
    cacheSetUserLocation_clientLocation,
    cacheSetUserLocation_listUserOnline,
    cacheSetUserLocation_requestShareLocation,
    cacheSetUserLocation_mapConnection
} = userLocation.actions;

export default userLocation.reducer