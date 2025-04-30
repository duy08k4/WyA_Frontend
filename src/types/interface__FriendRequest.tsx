interface interface__FriendRequest_send {
    senderGmail: string,
    receiverGmail: string,
}

interface interface__FriendRequest_revoke {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "receiver" | "sender",
    gmail: string
}

interface interface__FriendRequest_accept {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "receiver" | "sender",
    gmail: string, //Client
    username: string, // Client
    avartarCode: string // Client
}

interface interface__Friend__remove {
    client: {
        gmail: string,
        username: string,
        avartarCode: string,
        chatCode: string
    },
    friend: {
        gmail: string,
        username: string,
        avartarCode: string,
        chatCode: string
    }
}

export type {
    interface__FriendRequest_send,
    interface__FriendRequest_revoke,
    interface__FriendRequest_accept,
    interface__Friend__remove
}