// Import interface
import { interface__Contact } from "../types/interface__Contact"

// Send Contact
const sendProblem = async (data: interface__Contact) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/contact`, {
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

export {
    sendProblem,
}