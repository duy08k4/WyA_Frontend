// Import services
import { interface__VerifyOTP } from "../types/interface__OTP"

const verifyOTP = async (data: interface__VerifyOTP) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/create-account/verify-otp`, {
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

export default verifyOTP