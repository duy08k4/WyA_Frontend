// Import interface
import {
    interface__FriendRequest_send,
    interface__FriendRequest_accept,
    interface__FriendRequest_decline
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
            console.log(data)
            return data
        })

    return serverResponse
}

// Accept request
const acceptFriendRequest = () => {

}

// Decline request
const declineFriendRequest = () => {

}

export { sendFriendRequest, acceptFriendRequest, declineFriendRequest }