// Import interface
import { interface__ChatPage__merge, interface__ChatPage__messageForSend, interface__ChatPage__removeChat } from "../types/interface__ChatPage"

// Service
const sendMessage = async (data: interface__ChatPage__messageForSend) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("data", data)
            return data
        })

    return serverResponse
}

const meregMessage = async (data: interface__ChatPage__merge) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/send-message/merge`, {
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

const removeChat = async (data: interface__ChatPage__removeChat) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/send-message/remove-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("data", data)
            return data
        })

    return serverResponse
}

export { sendMessage, meregMessage, removeChat }