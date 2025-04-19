// Import interface
import { interface__SendOTP } from "../types/interface__OTP"

const sendOTP = async (data:interface__SendOTP) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/create-account/send-otp`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
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

export default sendOTP