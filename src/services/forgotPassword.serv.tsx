// Import interface

import { interface__ForgotPassword, interface__ForgotPassword__sendOTP } from "../types/interface__ForgotPassword"


// Send request
const forgotPassword = async (data: interface__ForgotPassword) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/forgot-password`, {
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

const forgotPassword_sendOTP = async (data: interface__ForgotPassword__sendOTP) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/forgot-password/sendOTP`, {
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
    forgotPassword,
    forgotPassword_sendOTP
}