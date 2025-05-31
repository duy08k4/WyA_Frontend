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
  interface__FriendPage__user,
  interface__FriendPage__requestConnection,
  interface__FriendPage__sentRequest,
  interface__FriendPage__friendRequest,
  interface__FriendPage__connections
} from "../../types/interface__FriendPage";

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
  const [searchResult, setSearchResult] = useState<interface__FriendPage__user[]>([])
  const [requestConnection, setRequestConnection] = useState<interface__FriendPage__requestConnection[]>([])
  const [sentRequest, setSentRequest] = useState<interface__FriendPage__sentRequest[]>([])
  const [friendList, setFriendList] = useState<interface__FriendPage__connections[]>([])
  const [friendDelete, setFriendDelete] = useState<interface__FriendPage__connections | undefined>(undefined)

  // Redux
  const gmail = useSelector((state: RootState) => state.userInformation.gmail)
  const username = useSelector((state: RootState) => state.userInformation.username)
  const avartarCode = useSelector((state: RootState) => state.userInformation.avartarCode)
  const friendRequest = useSelector((state: RootState) => state.userInformation.requests)
  const getFriendList = useSelector((state: RootState) => state.userInformation.friends)

  const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)

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
          console.log(res)
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
      const listRequestConection: interface__FriendPage__requestConnection[] = []
      const listSentRequest: interface__FriendPage__sentRequest[] = []

      friendRequest.forEach((request: interface__FriendPage__requestConnection | interface__FriendPage__sentRequest) => {
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

    console.log(dataForAccept)
    await acceptFriendRequest(dataForAccept).then((data) => {
      console.log(data)
    }).catch((err) => { console.error(err) })

    // console.log(dataForAccept)
  }

  // Delete friend
  const handleDeleteFriend = (friendDeleteIndex: number) => {
    const friendRemove = friendList[friendDeleteIndex]
    const checkUser = mapConnection.filter(connect => connect.gmail == friendRemove.gmail)
    
    if (checkUser.length == 0) {
      setFriendDelete(friendRemove)
    } else {
      addToast({
        typeToast: "w",
        content: `Let disconnect this user in Map`,
        duration: 5
      })
    }

  }

  const confirmForm_accept = async () => {
    const friendData = friendDelete
    const clientData = {
      gmail,
      username,
      avartarCode,
      chatCode: (friendDelete as interface__FriendPage__connections).chatCode
    }

    await removeFriend({
      client: clientData,
      friend: (friendData as interface__FriendPage__connections)
    }).then((data) => {
      console.log(data)
      setFriendDelete(undefined)
      addToast({
        typeToast: "s",
        content: `Removed ${(friendDelete as interface__FriendPage__connections).username}`,
        duration: 3
      })
    }).catch((err) => { console.error(err) })

  }

  const confirmForm_decline = () => {
    setFriendDelete(undefined)
  }

  return (
    <IonPage>
      <div className="friend">
        {/* Header with search and profile */}
        <div className="friend__header">
          <div className="friend__header__container" ref={searchPopupRef}>
            <div className={`friend__search ${searchResult.length == 0 ? "allBorder" : ""}`}>
              <button className="friend__button--back" onClick={handleDirection}>
                <i className="fa-solid fa-caret-left friend__icon--back"></i>
              </button>

              <div className="friend__input--search">
                <input type="text" placeholder="Find your connection..." onClick={handleSearchClick} onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
              </div>

              <div className="friend__avatar--profile">
                <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${avartarCode}`} alt="Avatar User" />
              </div>
            </div>

            {isSearchActive && (
              <div className="friend__search--history">
                {searchResult.length == 0 ? "" : (
                  searchResult.map((user: interface__FriendPage__user, index) => {
                    return (
                      <div key={index} className="friend__search--item">
                        <div className="friend__search--user">
                          <div className="friend__search--userAvartar">
                            <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.avartarCode}`} alt="Avatar User" />
                          </div>

                          <p className="friend__name--usersearch">{user.username}</p>
                        </div>

                        <button className="friend__button--request" onClick={() => { handleRequest(index) }}>Request</button>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="friend__content">

          {requestConnection.length != 0 ? (
            <div className="friend__section">
              <h2 className="friend__title--section">Friend request</h2>
              <div className="friend__container">
                {requestConnection.map((request: interface__FriendPage__requestConnection, index) => {
                  return (
                    <div key={index} className="friend__item--request">
                      <div className="friend__user">
                        <div className="friend__avatar--user">
                          <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${request.request_avartarCode}`} alt="Avatar User" />
                        </div>

                        <p className="friend__name--user">{request.request_name}</p>
                      </div>

                      <div className="friend__actions">

                        <button className="friend__button--decline" onClick={() => { handleCancelRequest(index) }} >
                          <i className="fa-solid fa-xmark"></i>
                        </button>

                        <button className="friend__button--accept" onClick={() => { handleAcceptRequest(index) }}>
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
            <div className="friend__section">
              <h2 className="friend__title--section">Sent request</h2>
              <div className="friend__container">
                {sentRequest.map((request: interface__FriendPage__sentRequest, index) => {
                  return (
                    <div key={index} className="friend__item--request">
                      <div className="friend__user">
                        <div className="friend__avatar--user">
                          <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${request.request_avartarCode}`} alt="Avatar User" />
                        </div>

                        <p className="friend__name--user">{request.request_name}</p>
                      </div>

                      <div className="friend__actions">
                        <button className="friend__button--revokeInvitation" onClick={() => { handleRevokeInvitation(index) }} >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          ) : ""}


          {/* Friends List Section */}
          <div className="friend__section">
            <h2 className="friend__title--section">Friends ({friendList.length})</h2>
            <div className="friend__container">
              {friendList.map((friend: interface__FriendPage__connections, index) => {
                return (
                  <div key={index} className="friend__item--friend">
                    <div className="friend__user">
                      <div className="friend__avatar--user">
                        <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${friend.avartarCode}`} alt="User avatar" />
                      </div>

                      <div className="friend__info--user">
                        <p className="friend__name--user">{friend.username}</p>
                      </div>
                    </div>

                    <button className="friend__item--friend--delete" onClick={() => { handleDeleteFriend(index) }}>Remove</button>
                  </div>
                )
              })}

            </div>
          </div>
        </div>

        {!friendDelete ? "" : (
          <div className="friendConfirm">
            <div className="friendConfirm__form">
              <h4 className="friendConfirm__form--title">Do you want to continue?</h4>
              <p className="friendConfirm__form--des">Remove <b>{friendDelete.username}</b></p>

              <div className="friendConfirm__form__choiceContainer">
                <button className="friendConfirm__form__btn chatConfirm__form__Cancelbtn" onClick={confirmForm_decline}>No</button>
                <button className="friendConfirm__form__btn chatConfirm__form__Acceptbtn" onClick={confirmForm_accept}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </IonPage>
  );
};

export default ChattingPage;