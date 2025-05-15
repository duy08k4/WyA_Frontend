// Import library
import { IonPage, IonContent } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

// Import components
import ChatBox from "../../components/chat__chatBox/ChatBox";

// Import css
import "./chat_page.css"
import "../../main.css"

// Import deux
import { RootState } from "../../redux/store";
import { cacheSetChatCode, cacheSetRequestRemove, cacheSetTargetGmail, cacheSetTargetName } from "../../redux/reducers/chat.reducer";

// Import service
import { meregMessage } from "../../services/sendMessage.serv";

// Import custom hook
import { useCache } from "../../hooks/cache/cache";
import { useToast } from "../../hooks/toastMessage/toast";

const ChatPage: React.FC = () => {
  // State
  const [isChatBox, setIsChatBox] = useState<boolean>(false);
  const redirect = useHistory()

  // Data
  const gmail = useSelector((state: RootState) => state.userInformation.gmail)
  const newMessageSender = useSelector((state: RootState) => state.userChat.newMessages_sender)
  const amountNewChat = useSelector((state: RootState) => state.userChat.amountNewChat)

  // Custom hook
  const { addToast } = useToast()

  // Redux
  const { cacheSetData, enableListener_userChat_amountNewMessage } = useCache()
  const listChat = useSelector((state: RootState) => state.userInformation.friends)
  const lastMessages = useSelector((state: RootState) => state.userChat.lastMessages)

  // Effect
  useEffect(() => {
    setIsChatBox(false);
  }, []);

  // Handlers
  const openChatBox = async (chatIndex: number) => {
    console.log("ha ha ha ha ha")
    const showToast = setTimeout(() => {
      addToast({
        typeToast: "i",
        content: "Loading chat",
        duration: 2
      })
    }, 1000)

    const getChatCode = listChat[chatIndex].chatCode
    const getTargetGmail = listChat[chatIndex].gmail
    const getTargetName = listChat[chatIndex].username

    await meregMessage({
      chatCode: getChatCode
    }).then((data) => {
      clearTimeout(showToast)
      cacheSetData(cacheSetChatCode(getChatCode))
      cacheSetData(cacheSetTargetName(getTargetName))
      cacheSetData(cacheSetTargetGmail(getTargetGmail))
      setIsChatBox(true);
    }).catch((err) => {
      console.warn(err)
    })
  }

  const closeChatBox = () => {
    cacheSetData(cacheSetChatCode(""))
    cacheSetData(cacheSetRequestRemove(""))
    setIsChatBox(false);
  }

  useEffect(() => {
    enableListener_userChat_amountNewMessage()
  }, [])

  // Back to dashboard
  const handleDirection = () => {
    redirect.push("/")
  }

  return (
    <IonPage>
      <div className="chat__container">
        <div className="chat__header">
          <button className="chat__button--back" onClick={handleDirection}>
            <i className="fa-solid fa-caret-left"></i>
          </button>

          <h1 className="chat__header--title">Message</h1>
        </div>

        <div className="chat__search">
          <input className="chat__search__input" type="text" placeholder="Find..." />
        </div>

        <div className="chat__list">

          {listChat.length == 0 ? "" : (
            listChat.map((chat, index) => {
              const lastMessageForChat = lastMessages[chat.chatCode]
              return (
                <div key={index} className="chat__list__item" onClick={() => { openChatBox(index) }}>
                  { amountNewChat[chat.chatCode] && (
                    gmail == amountNewChat[chat.chatCode].sender ? "" : (
                      amountNewChat[chat.chatCode].amountNewMessage == 0 ?
                        "" :
                        <p className="amountMessage">
                          {amountNewChat[chat.chatCode].amountNewMessage}
                        </p>
                    )
                  )}


                  <div className="chat__list__item--part chat__list__item__infoBox">
                    <div className="chat__list__item--part chat__list__item__avatarBox">
                      <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="user avatar" />
                    </div>

                    <div className="chat__list__item__infoBox--content">
                      <p className="chat__list__item__infoBox--name">{chat.username}</p>

                      {!lastMessageForChat ? "" : (
                        lastMessageForChat.sender == gmail ? (
                          <p className="chat__list__item__infoBox--lastMessage">
                            <b>You: </b>
                            {lastMessageForChat.content}
                          </p>
                        ) : (
                          <p className="chat__list__item__infoBox--lastMessage">
                            <b></b>
                            {lastMessageForChat.content}
                          </p>
                        )
                      )}



                    </div>
                  </div>

                  <div className="chat__list__item--part chat__list__item__timestamp">
                    <p className="chat__list__item__timestamp--timeShowcase">
                      {!lastMessageForChat ? "" : lastMessageForChat.timestamp.split("-")[1]}
                    </p>
                  </div>
                </div>
              )
            })
          )}


        </div>
      </div>

      {isChatBox && <ChatBox closeChatBox={closeChatBox} />}

    </IonPage>
  );
};

export default ChatPage;