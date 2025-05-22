// Import interface
import {
    interface__changeData__nameChange,
    interface__changeData__passwordChange,
    interface__changeData__deleteAccount,
    interface__changeData__deleteAccount__sendVerifyCode
} from "../types/interface__ChangeData"

// Change data 
const changeData = async (
    data: interface__changeData__nameChange | interface__changeData__passwordChange
) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/change-data`, {
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

const deleteAccount__sendVerifyCode = async (data: interface__changeData__deleteAccount__sendVerifyCode) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/change-data/send-verifyCode`, {
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

const deleteAccount = async (data: interface__changeData__deleteAccount) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/change-data/delete-account`, {
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
    changeData,
    deleteAccount__sendVerifyCode,
    deleteAccount
}