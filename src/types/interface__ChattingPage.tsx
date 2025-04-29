interface interface__ChattingPage__user {
    gmail: string,
    username: string,
    avartarCode: string
}

interface interface__ChattingPage__friendRequest {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "receiver" | "sender"
}

interface interface__ChattingPage__requestConnection {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "receiver"
}

interface interface__ChattingPage__sentRequest {
    request_gmail: string,
    request_name: string,
    request_avartarCode: string,
    type: "sender"
}

interface interface__ChattingPage__connections {

}

export type { 
    interface__ChattingPage__user, 
    interface__ChattingPage__friendRequest,
    interface__ChattingPage__requestConnection, 
    interface__ChattingPage__sentRequest,
    interface__ChattingPage__connections
}