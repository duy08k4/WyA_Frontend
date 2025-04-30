// Import library
import { IonPage } from "@ionic/react";
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router";

// Import components


// Import custom hook
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";

// Import redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import services
import searchUser from "../../services/searchUser.serv";
import {
  sendFriendRequest,
  revokeFriendRequest,
  acceptFriendRequest,
  removeFriend
} from "../../services/friendRequest.serv";

// Import interface
import {
  interface__ChattingPage__user,
  interface__ChattingPage__requestConnection,
  interface__ChattingPage__sentRequest,
  interface__ChattingPage__friendRequest,
  interface__ChattingPage__connections
} from "../../types/interface__ChattingPage";

// Import css
import "./friend_page.css"
import "../../main.css"


//Sample data :) 
const ChattingPage: React.FC = () => {
  // State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const redirect = useHistory()

  // Data
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchResult, setSearchResult] = useState<interface__ChattingPage__user[]>([])
  const [requestConnection, setRequestConnection] = useState<interface__ChattingPage__requestConnection[]>([])
  const [sentRequest, setSentRequest] = useState<interface__ChattingPage__sentRequest[]>([])
  const [friendList, setFriendList] = useState<interface__ChattingPage__connections[]>([])
  const [friendDelete, setFriendDelete] = useState<interface__ChattingPage__connections | undefined>(undefined)

  // Redux
  const gmail = useSelector((state: RootState) => state.userInformation.gmail)
  const username = useSelector((state: RootState) => state.userInformation.username)
  const avartarCode = useSelector((state: RootState) => state.userInformation.avartarCode)
  const friendRequest = useSelector((state: RootState) => state.userInformation.requests)
  const getFriendList = useSelector((state: RootState) => state.userInformation.friends)

  // Custom hook
  const { addToast } = useToast()
  const { openSpinner, closeSpinner } = useSpinner()

  // Handler Effects ----------------------------------------------------------------------------------------------
  // Debounce
  useEffect(() => {
    if (searchInput != "") {
      const debounce = setTimeout(async () => {
        openSpinner()
        await searchUser(searchInput, gmail).then((res) => {
          closeSpinner()
          setSearchResult(res)
        }).catch((err) => {
          console.log(err)
        })
      }, 1000)

      return () => {
        clearTimeout(debounce)
      }
    } else {
      setSearchResult([])
    }
  }, [searchInput])

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    if (isSearchActive) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };

  }, [isSearchActive]);

  // Filter friendRequest
  useEffect(() => {
    if (friendRequest.length != 0) {
      const listRequestConection: interface__ChattingPage__requestConnection[] = []
      const listSentRequest: interface__ChattingPage__sentRequest[] = []

      friendRequest.forEach((request: interface__ChattingPage__requestConnection | interface__ChattingPage__sentRequest) => {
        if (request.type == "receiver") {
          listRequestConection.push(request)
        } else {
          listSentRequest.push(request)
        }
      })

      setRequestConnection(listRequestConection)
      setSentRequest(listSentRequest)
    } else {
      setRequestConnection([])
      setSentRequest([])
    }
  }, [friendRequest])

  // Get friend List
  useEffect(() => {
    setFriendList(getFriendList)
  }, [getFriendList])

  // Handlers
  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(friendRequest)
    setIsSearchActive(true);
  };

  const handleDirection = () => {
    redirect.push("/")
  }

  // Send request
  const handleRequest = async (searchUserIndex: number) => {
    const getTargetUser = searchResult[searchUserIndex]
    const dataForSendRequest = {
      senderGmail: gmail,
      receiverGmail: getTargetUser.gmail,
    }

    await sendFriendRequest(dataForSendRequest).then((data) => {
      if (data.status == 200) {
        setSearchInput("")
        setIsSearchActive(false)
      } else {
        console.warn(data)
      }
    }).catch((err) => { console.error(err) })
  }

  // Revoke request
  const handleRevokeInvitation = async (invitationIndex: number) => {
    const getInvitation = sentRequest[invitationIndex]
    const dataForRevoke = {
      ...getInvitation,
      gmail
    }
    // console.log(dataForRevoke)
    await revokeFriendRequest(dataForRevoke).then((data) => {
      if (data.status != 200) {
        addToast({
          typeToast: "w",
          content: data.data.mess,
          duration: 3
        })

      }
    }).catch((err) => { console.error(err) })
  }

  // Cancel request
  const handleCancelRequest = async (connectionIndex: number) => {
    const getInvitation = requestConnection[connectionIndex]
    const dataForCancel = {
      ...getInvitation,
      gmail
    }
    // console.log(dataForCancel)
    await revokeFriendRequest(dataForCancel).then((data) => {
      console.log(data)
    }).catch((err) => { console.error(err) })
  }

  // Accept request
  const handleAcceptRequest = async (friendIndex: number) => {
    const getFriendData = requestConnection[friendIndex]
    const dataForAccept = {
      ...getFriendData,
      gmail,
      username,
      avartarCode
    }

    await acceptFriendRequest(dataForAccept).then((data) => {
      console.log(data)
    }).catch((err) => { console.error(err) })

    // console.log(dataForAccept)
  }

  // Delete friend
  const handleDeleteFriend = (friendDeleteIndex: number) => {
    setFriendDelete(friendList[friendDeleteIndex])
  }

  const confirmForm_accept = async () => {
    const friendData = friendDelete
    const clientData = {
      gmail,
      username,
      avartarCode,
      chatCode: (friendDelete as interface__ChattingPage__connections).chatCode
    }

    await removeFriend({
      client: clientData,
      friend: (friendData as interface__ChattingPage__connections)
    }).then((data) => {
      console.log(data)
      setFriendDelete(undefined)
      addToast({
        typeToast: "s",
        content: `Removed ${(friendDelete as interface__ChattingPage__connections).username}`,
        duration: 3
      })
    }).catch((err) => { console.error(err) })

  }

  const confirmForm_decline = () => {
    setFriendDelete(undefined)
  }

  return (
    <IonPage>
      <div className="chat">
        {/* Header with search and profile */}
        <div className="chat__header">
          <div className="chat__header__container" ref={searchPopupRef}>
            <div className={`chat__search ${searchResult.length == 0 ? "allBorder" : ""}`}>
              <button className="chat__button--back" onClick={handleDirection}>
                <i className="fa-solid fa-caret-left chat__icon--back"></i>
              </button>

              <div className="chat__input--search">
                <input type="text" placeholder="Find your connection..." onClick={handleSearchClick} onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
              </div>

              <div className="chat__avatar--profile">
                <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
              </div>
            </div>

            {isSearchActive && (
              <div className="chat__search--history">
                {searchResult.length == 0 ? "" : (
                  searchResult.map((user: interface__ChattingPage__user, index) => {
                    return (
                      <div key={index} className="chat__search--item">
                        <div className="chat__search--user">
                          <div className="chat__search--userAvartar">
                            <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                          </div>

                          <p className="chat__name--usersearch">{user.username}</p>
                        </div>

                        <button className="chat__button--request" onClick={() => { handleRequest(index) }}>Request</button>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="chat__content">

          {requestConnection.length != 0 ? (
            <div className="chat__section">
              <h2 className="chat__title--section">Request connection</h2>
              <div className="chat__container">
                {requestConnection.map((request: interface__ChattingPage__requestConnection, index) => {
                  return (
                    <div key={index} className="chat__item--request">
                      <div className="chat__user">
                        <div className="chat__avatar--user">
                          <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                        </div>

                        <p className="chat__name--user">{request.request_name}</p>
                      </div>

                      <div className="chat__actions">

                        <button className="chat__button--decline" onClick={() => { handleCancelRequest(index) }} >
                          <i className="fa-solid fa-xmark"></i>
                        </button>

                        <button className="chat__button--accept" onClick={() => { handleAcceptRequest(index) }}>
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          ) : ""}

          {sentRequest.length != 0 ? (
            <div className="chat__section">
              <h2 className="chat__title--section">Sent request</h2>
              <div className="chat__container">
                {sentRequest.map((request: interface__ChattingPage__sentRequest, index) => {
                  return (
                    <div key={index} className="chat__item--request">
                      <div className="chat__user">
                        <div className="chat__avatar--user">
                          <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                        </div>

                        <p className="chat__name--user">{request.request_name}</p>
                      </div>

                      <div className="chat__actions">
                        <button className="chat__button--revokeInvitation" onClick={() => { handleRevokeInvitation(index) }} >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          ) : ""}


          {/* Friends List Section */}
          <div className="chat__section">
            <h2 className="chat__title--section">Connection ({friendList.length})</h2>
            <div className="chat__container">
              {friendList.map((friend: interface__ChattingPage__connections, index) => {
                return (
                  <div key={index} className="chat__item--friend">
                    <div className="chat__user">
                      <div className="chat__avatar--user">
                        <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="User avatar" />
                      </div>

                      <div className="chat__info--user">
                        <p className="chat__name--user">{friend.username}</p>
                      </div>
                    </div>

                    <button className="chat__item--friend--delete" onClick={() => { handleDeleteFriend(index) }}>Disconnect</button>
                  </div>
                )
              })}

            </div>
          </div>
        </div>

        {!friendDelete ? "" : (
          <div className="chatConfirm">
            <div className="chatConfirm__form">
              <h4 className="chatConfirm__form--title">Do you want to continue?</h4>
              <p className="chatConfirm__form--des">Remove <b>{friendDelete.username}</b></p>

              <div className="chatConfirm__form__choiceContainer">
                <button className="chatConfirm__form__btn chatConfirm__form__Cancelbtn" onClick={confirmForm_decline}>No</button>
                <button className="chatConfirm__form__btn chatConfirm__form__Acceptbtn" onClick={confirmForm_accept}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </IonPage>
  );
};

export default ChattingPage;