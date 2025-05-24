// Import libraries
import React, { useEffect, useRef, useState } from "react"

// Import component

// Import css
import "./ChatBox.css"

// Import intrface
import { interface__ChatPage__ChatBoxProps } from "../../types/interface__ChatPage"
import { useToast } from "../../hooks/toastMessage/toast"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

// Import services
import { removeChat, sendMessage } from "../../services/sendMessage.serv"
import { useCache } from "../../hooks/cache/cache"
import { cacheAddAMessages, cacheSetRequestRemove } from "../../redux/reducers/chat.reducer"
import { useSpinner } from "../../hooks/spinner/spinner"

// Import redux

const ChatBox: React.FC<interface__ChatPage__ChatBoxProps> = ({ closeChatBox }) => {
    // State
    const [userOnline, setUserOnline] = useState<boolean>(false)
    const [chatBoxConfirm, setChatBoxConfirm] = useState<boolean>(false)
    const [inputPlaceholder, setInputPlaceholder] = useState<boolean>(false)
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLDivElement>(null);

    // Custom hook
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()
    const { enableListener_userChat_getMessage, cacheSetData } = useCache()

    // Redux
    const messages = useSelector((state: RootState) => state.userChat.messages)
    const newMessage = useSelector((state: RootState) => state.userChat.newMessages)
    const chatCode = useSelector((state: RootState) => state.userChat.chatCode)
    const targetGmail = useSelector((state: RootState) => state.userChat.targetGmail)
    const targetName = useSelector((state: RootState) => state.userChat.targetName)
    const targetAvartarCode = useSelector((state: RootState) => state.userChat.targetAvartarCode)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)
    const requestRemove = useSelector((state: RootState) => state.userChat.requestRemove)
    const avartarCode = useSelector((state: RootState) => state.userInformation.avartarCode)
    const listUserOnline = useSelector((state: RootState) => state.userLocation.listUserOnline) // Object Type

    // Data

    // Handlers
    const openChatBoxConfirm = () => {
        setChatBoxConfirm(true)
    }

    const closeChatBoxConfirm = () => {
        setChatBoxConfirm(false)
    }

    const handleDeleteChat = async () => {
        setChatBoxConfirm(false)
        openSpinner()

        await removeChat({
            chatCode,
            requester: gmail,
            targetGmail,
            type: "remove"
        }).then((data) => {
            closeSpinner()
        }).catch((err) => {
            console.error(err)
            closeSpinner()
            addToast({
                typeToast: "e",
                content: "Can't send",
                duration: 3
            })
        })
    }

    const handleRevoke = async () => {
        openSpinner()

        removeChat({
            chatCode,
            requester: gmail,
            targetGmail,
            type: "revoke"
        }).then(() => {
            closeSpinner()
            cacheSetData(cacheSetRequestRemove(""))
            addToast({
                typeToast: "i",
                content: "Revoked",
                duration: 3
            })
        }).catch((err) => {
            console.error(err)
            closeSpinner()
            addToast({
                typeToast: "e",
                content: "Can't revoke",
                duration: 3
            })
        })
    }

    const handleSendMessage = async () => {
        const getMessage = messageInputRef.current?.textContent?.trim() || '';

        if (getMessage == "") return

        cacheAddAMessages({
            content: getMessage,
            messID: "",
            timestamp: "Send",
            sender: gmail
        })

        await sendMessage({
            chatCode,
            sender: gmail,
            content: getMessage,
            targetGmail
        }).then((data) => {
            console.log(data)
            if (messageInputRef.current) {
                messageInputRef.current.innerHTML = ""
            }
        }).catch((err) => { console.log(err) })
    }

    // Auto scroll to bottom
    useEffect(() => { // For message        
        const el = messageContainerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    const autoScrollToBottom = () => {
        const el = messageInputRef.current;
        const getMessage = messageInputRef.current?.textContent?.trim() || ''
        if (el) {
            el.scrollTop = el.scrollHeight;
        }

        if (getMessage == "") {
            setInputPlaceholder(false)
        } else {
            setInputPlaceholder(true)
        }
    }

    useEffect(() => {
        if (requestRemove != "" && requestRemove) {
            if (requestRemove != gmail) {
                addToast({
                    typeToast: "i",
                    content: `${requestRemove} require remove chat`,
                    duration: 4
                })
            }
        }
    }, [requestRemove])

    useEffect(() => {
        const targetUser_status = listUserOnline[btoa(targetGmail)]
        setUserOnline(targetUser_status)
    }, [listUserOnline])

    return (
        <div className="chatbox">
            <div className={`chatbox__header`}>
                <button className="chatbox__button--back" onClick={closeChatBox}>
                    <i className="fa-solid fa-caret-left"></i>
                </button>

                <div className="chatbox__user">


                    <div className={`chatbox__avatar ${userOnline ? "online" : ""}`}>
                        <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${targetAvartarCode}`} alt="avatar user" />
                    </div>

                    <div className="chatbox__user--info">
                        <p className="chatbox__user--username">{targetName}</p>
                        <p className="chatbox__user--onlineStatus">
                            <i className={`fas fa-circle userStatus ${userOnline ? "online" : ""}`}></i>
                            {userOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {messages.length == 0 ? "" : (
                    requestRemove == gmail ? (
                        <button className="chatbox__button--clearChat chatbox__button--clearChat--revoke" onClick={handleRevoke}>Revoke</button>
                    ) : (
                        <button className="chatbox__button--clearChat" onClick={openChatBoxConfirm}>Delete</button>
                    )
                )}

            </div>

            <div className="chatbox__message__container" ref={messageContainerRef}>
                <div className="space"></div>

                {messages.length == 0 ? "" : (
                    messages.map((message, index) => {
                        return (

                            <div key={index} className={`chatbox__message__box ${message.sender == gmail ? "" : "receiver"}`}>
                                <div className="chatbox__message">
                                    <p className="chatbox__message--content">{message.content}</p>
                                    <p className="chatbox__message--timestamp">{message.timestamp}</p>
                                </div>
                            </div>

                        )
                    })
                )}

                {newMessage.length == 0 ? "" : (
                    newMessage.map((message, index) => {
                        return (

                            <div key={index} className={`chatbox__message__box ${message.sender == gmail ? "" : "receiver"}`}>
                                <div className="chatbox__message">
                                    <p className="chatbox__message--content">{message.content}</p>
                                    <p className="chatbox__message--timestamp">{message.timestamp}</p>
                                </div>
                            </div>

                        )
                    })
                )}

            </div>

            <div className="chatbox__input--container">
                <div contentEditable="true" ref={messageInputRef} className={`chatbox__input ${inputPlaceholder ? "placeholder" : ""}`} onInput={autoScrollToBottom}></div>

                <button className="chatbox__button--send" onClick={handleSendMessage}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>

            {chatBoxConfirm && (
                <div className="chatbox__announce">
                    <div className="chatbox__announce__form">
                        <h2 className="chatbox__announce__form--title">Delete Chat</h2>
                        <p className="chatbox__announce__form--des">You can only delete if both users agree.</p>
                        <div className="chatbox__announce__form__choiceContainer">
                            <button className="chatbox__announce__form--cancelBtn" onClick={closeChatBoxConfirm}>Cancel</button>
                            <button className="chatbox__announce__form--acceptBtn" onClick={handleDeleteChat}>Continute</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBox