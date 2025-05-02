interface interface__FriendPage__user {
    gmail: string,
    username: string,
    avartarCode: string
}

interface interface__FriendPage__friendRequest {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "receiver" | "sender"
}

interface interface__FriendPage__requestConnection {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "receiver"
}

interface interface__FriendPage__sentRequest {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "sender"
}

interface interface__FriendPage__connections {
    gmail: string,
    username: string,
    avartarCode: string,
    lastMessage: {
        sender: string,
        messID: string,
        timestamp: string,
        content: string
    }
    chatCode: string
}

export type {
    interface__FriendPage__user,
    interface__FriendPage__friendRequest,
    interface__FriendPage__requestConnection,
    interface__FriendPage__sentRequest,
    interface__FriendPage__connections,
}