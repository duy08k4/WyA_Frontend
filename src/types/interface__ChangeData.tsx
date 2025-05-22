interface interface__changeData__nameChange {
    typeChange: "changeName",
    client_mail: string,
    client_password: string,
    client_newName: string
}

interface interface__changeData__passwordChange {
    typeChange: "changePasword",
    client_mail: string,
    client_password: string,
    client_newPassword: string
}

interface interface__changeData__deleteAccount {
    client_mail: string,
    verifyCode: string
}

interface interface__changeData__deleteAccount__sendVerifyCode {
    client_mail: string,
}

export type {
    interface__changeData__nameChange,
    interface__changeData__passwordChange,
    interface__changeData__deleteAccount,
    interface__changeData__deleteAccount__sendVerifyCode
}