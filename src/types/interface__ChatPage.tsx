interface interface__ChatPage__ChatBoxProps {
    closeChatBox: () => void
}

interface interface__ChatPage__message {
    sender: string, // Gmail of user who send message
    messID: string, // ID of message
    timestamp: string,
    content: string
}

interface interface__ChatPage__messageForSend {
    chatCode: string,
    sender: string,
    content: string,
    targetGmail: string
}

interface interface__ChatPage__merge {
    chatCode: string,
}

interface interface__ChatPage__removeChat {
    type: "revoke" | "remove",
    chatCode: string,
    requester: string,
    targetGmail: string
}

export type {
    interface__ChatPage__ChatBoxProps,
    interface__ChatPage__message,
    interface__ChatPage__messageForSend,
    interface__ChatPage__merge,
    interface__ChatPage__removeChat
}