// Import interface
import { interface__MapPage__AcceptRequestShareLocation, interface__MapPage__Disconect, interface__MapPage__RevokeRequestShareLocation, interface__MapPage__SendRequestShareLocation } from "../types/interface__MapPage"

// send RequestShareLocation service
const sendRequestShareLocation = async (data: interface__MapPage__SendRequestShareLocation) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/map-function`, {
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

// revoke RequestShareLocation service
const revokeRequestShareLocation = async (data: interface__MapPage__RevokeRequestShareLocation) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/map-function/revoke-request`, {
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

// revoke RequestShareLocation service
const acceptRequestShareLocation = async (data: interface__MapPage__AcceptRequestShareLocation) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/map-function/accept-request`, {
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

// Disconect
const disconect = async (data: interface__MapPage__Disconect) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/map-function/disconnect`, {
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
    sendRequestShareLocation,
    revokeRequestShareLocation,
    acceptRequestShareLocation,
    disconect
}