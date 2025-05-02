import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";

// Import interface
import { interface__FriendPage__connections, interface__FriendPage__friendRequest } from "../../types/interface__FriendPage";

// Define initial values
const initial_userInformation = {
    username: "",
    gmail: "",
    uuid: "",
    avartarCode: "",
    friends: [] as interface__FriendPage__connections[],
    requests: [] as interface__FriendPage__friendRequest[],
    setting: {},
    listChatCode: [],
    lastMessage: {},
    profileStatus: ""
}

// Export reducer
export const userInformation = createSlice({
    name: "userInformation",
    initialState: initial_userInformation,
    reducers: {
        // Các action trong reducer sẽ được tự động tạo ra
        cacheSetName: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        cacheSetGmail: (state, action: PayloadAction<string>) => {
            state.gmail = action.payload;
        },
        cacheSetAvatarCode: (state, action: PayloadAction<string>) => {
            state.avartarCode = action.payload;
        },
        cacheSetListFriend: (state, action: PayloadAction<interface__FriendPage__connections>) => {
            state.friends.push(action.payload);
        },
        cacheSetFriendRequest: (state, action: PayloadAction<interface__FriendPage__friendRequest>) => {
            state.requests.push(action.payload);
        },
        cacheSetFullUserInformation: (state, action: PayloadAction<typeof initial_userInformation | DocumentData | undefined>) => {
            const payload = action.payload;

            if (
                !payload ||
                typeof payload !== 'object' ||
                Array.isArray(payload) ||
                Object.values(payload).every(value => value === "" || (Array.isArray(value) && value.length === 0) || (typeof value === "object" && Object.keys(value).length === 0))
            ) {
                return state;
            }


            return payload as typeof initial_userInformation;
        },
        cacheSetDefaultUserInformation: (state) => {
            return {...initial_userInformation}
        }
    },
})

export const {
    cacheSetName,
    cacheSetGmail,
    cacheSetAvatarCode,
    cacheSetListFriend,
    cacheSetFriendRequest,
    cacheSetFullUserInformation,
    cacheSetDefaultUserInformation,
} = userInformation.actions;

export default userInformation.reducer