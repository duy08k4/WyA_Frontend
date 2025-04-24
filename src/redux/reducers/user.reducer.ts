import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define initial values
const initial_userInformation = {
    username: "abc",
    gmail: "example@gmail.com",
    uuid: "",
    avartarCode: "",
    friends: {
        status: "public",
        list: [] as string[]
    },
    requests: [] as string[],
    setting: {},
    profileStatus: "public"
}

// Export reducer
export const userInformation = createSlice({
    name: "userInformation",
    initialState: initial_userInformation,
    reducers: {
        // Các action trong reducer sẽ được tự động tạo ra
        setName: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setGmail: (state, action: PayloadAction<string>) => {
            state.gmail = action.payload;
        },
        setAvatarCode: (state, action: PayloadAction<string>) => {
            state.avartarCode = action.payload;
        },
        setListFriend: (state, action: PayloadAction<string>) => {
            state.friends.list.push(action.payload);
        },
        setFriendRequest: (state, action: PayloadAction<string>) => {
            state.requests.push(action.payload);
        },
        setFullUserInformation: (state, action: PayloadAction<typeof initial_userInformation>) => {
            return action.payload;
        },
    },
})

export const {
    setName,
    setGmail,
    setAvatarCode,
    setListFriend,
    setFriendRequest,
    setFullUserInformation,
} = userInformation.actions;

export default userInformation.reducer