interface interface__SendOTP {
    method: string
    gmail: string
}

interface interface__VerifyOTP {
    inputOtp: string
}

export type { interface__SendOTP, interface__VerifyOTP }