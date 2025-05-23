interface interface__ForgotPassword {
    gmail: string,
    newPassword: string,
    verifyCode: string
}

interface interface__ForgotPassword__sendOTP {
    gmail: string
}

export type {
    interface__ForgotPassword,
    interface__ForgotPassword__sendOTP
}