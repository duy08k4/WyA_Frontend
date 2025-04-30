// Import interface
import {
    interface__FriendRequest_send,
    interface__FriendRequest_revoke,
    interface__FriendRequest_accept,
    interface__Friend__remove
} from "../types/interface__FriendRequest"

// Send request
const sendFriendRequest = async (data: interface__FriendRequest_send) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/friend-request/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            return data
        })

    return serverResponse
}

// Revoke request
const revokeFriendRequest = async (data: interface__FriendRequest_revoke) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/friend-request/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })

    return serverResponse
}

// Accept request
const acceptFriendRequest = async (data: interface__FriendRequest_accept) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/friend-request/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })

    return serverResponse
}

// Remove friend
const removeFriend = async (data: interface__Friend__remove) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/friend-request/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })

    return serverResponse
}

export {
    sendFriendRequest,
    revokeFriendRequest,
    acceptFriendRequest,
    removeFriend
}