// Import library
import React, { memo, useEffect, useRef, useState } from "react";

// Import components

// Import services
import { acceptRequestShareLocation, revokeRequestShareLocation, sendRequestShareLocation } from "../../services/mapFunction.serv";

// Import interface
import { interface__MapPage__AcceptRequestShareLocation, interface__MapPage__Menu__Props, interface__MapPage__RequestShareLocation } from "../../types/interface__MapPage";
import { interface__FriendPage__connections } from "../../types/interface__FriendPage";

// Import redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import custom hooks
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";

// Import css
import "leaflet/dist/leaflet.css";
import "./mapMenu.css";

const MapMenu: React.FC<interface__MapPage__Menu__Props> = ({ closeMenu }) => {
    // States
    const menuForm = useRef<HTMLDivElement>(null)
    const [chooseFriend, setChooseFriend] = useState<boolean>(true)
    const [chooseRequest, setChooseRequest] = useState<boolean>(false)
    const [isNewShareLocationRequest, setIsNewShareLocationRequest] = useState<boolean>(false)
    const [doConnection, setDoConnection] = useState<boolean>(false)

    // Custom hook
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()

    // Error

    // Data
    const [choice, setChoide] = useState<string>("friends")
    const [userOnline, setUserOnline] = useState<interface__FriendPage__connections[]>([])
    const [listPendingRequest, setListPendingRequest] = useState<interface__MapPage__RequestShareLocation[]>([])
    const [listRequest, setListRequest] = useState<interface__MapPage__RequestShareLocation[]>([])

    // Redux
    const listFriends = useSelector((state: RootState) => state.userInformation.friends)
    const listUserOnline = useSelector((state: RootState) => state.userLocation.listUserOnline)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)
    const username = useSelector((state: RootState) => state.userInformation.username)
    const avartarCode = useSelector((state: RootState) => state.userInformation.avartarCode)
    const listRequestShareLocation = useSelector((state: RootState) => state.userLocation.shareLocationRequest)
    const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)

    // Handlers
    const handleChooseFriend = () => {
        setChooseFriend(true)
        setChooseRequest(false)
    }

    const handleChooseRequest = () => {
        setChooseRequest(true)
        setChooseFriend(false)
    }

    const handleIsConnect = async (targetGmail: string) => {
        const targetUserInfo = listFriends.find(friend => friend.gmail === targetGmail)
        openSpinner()

        if (targetUserInfo) {
            await sendRequestShareLocation({
                clientGmail: gmail,
                clientName: username,
                clientAvartarCode: avartarCode,
                request_gmail: targetGmail,
                request_name: targetUserInfo?.username,
                request_avartarCode: targetUserInfo?.avartarCode
            }).then((data) => {
                if (data.status == 200) {
                    addToast({
                        typeToast: "s",
                        content: `Sent request to ${targetGmail}`,
                        duration: 3
                    })

                    setDoConnection(true)
                    closeSpinner()
                }
            }).catch((error) => {
                console.error(error)
                addToast({
                    typeToast: "e",
                    content: "Can't send request",
                    duration: 3
                })
                setDoConnection(false)
                closeSpinner()
            })
        }
    }

    const handleRevokeRequest = async (request: interface__MapPage__RequestShareLocation) => {
        openSpinner()

        const dataForRevoke = {
            clientGmail: gmail,
            request_gmail: request.gmail
        }

        await revokeRequestShareLocation(dataForRevoke).then((data) => {
            console.log(data)
            if (data.status == 200) {
                closeSpinner()
                addToast({
                    typeToast: "s",
                    content: `Revoked`,
                    duration: 3
                })
            } else {
                closeSpinner()
                addToast({
                    typeToast: "e",
                    content: `Can't revoke your request`,
                    duration: 3
                })
            }
        }).catch((err) => {
            console.log(err)
            addToast({
                typeToast: "e",
                content: `Can't revoke your request`,
                duration: 3
            })
        })
    }

    const handleAcceptRequest = async (request: interface__MapPage__RequestShareLocation) => {
        openSpinner()
        const dataForAccept = {
            clientGmail: gmail,
            clientName: username,
            clientAvartarCode: avartarCode,
            request_gmail: request.gmail,
            request_username: request.username,
            request_avartarCode: request.avartarCode
        }

        await acceptRequestShareLocation(dataForAccept).then((data) => {
            closeSpinner()
        }).catch((err) => {
            console.log(err)
            addToast({
                typeToast: "s",
                content: `Can't process your action`,
                duration: 3
            })

            closeSpinner()
        })
    }

    // Listener
    useEffect(() => {
        const handleClickOutsideMenu = (event: MouseEvent | TouchEvent) => {
            if (menuForm.current && !menuForm.current.contains(event.target as Node)) {
                closeMenu()
            }
        };

        document.addEventListener('mousedown', handleClickOutsideMenu);
        document.addEventListener('touchstart', handleClickOutsideMenu);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideMenu);
            document.removeEventListener('touchstart', handleClickOutsideMenu);
        };
    }, [])

    useEffect(() => {
        setChooseRequest(false)
        setChooseFriend(false)
        switch (choice) {
            case "requests":
                setChooseRequest(true)
                break;
            case "friends":
                setChooseFriend(true)
                break;
            default:
                break;
        }
    }, [choice])


    useEffect(() => {
        const onlineFriends = listFriends.filter(friend => listUserOnline[btoa(friend.gmail)] === true);
        setUserOnline(onlineFriends);
    }, [listUserOnline, listFriends]);

    useEffect(() => {
        if (listRequestShareLocation.length != 0) {
            setListPendingRequest(listRequestShareLocation.filter(user => user.type == "sender"))
            setListRequest(listRequestShareLocation.filter(user => user.type == "receiver"))
        } else {
            setListPendingRequest([])
            setListRequest([])
        }
    }, [listRequestShareLocation])

    useEffect(() => {
        const newRequest = listRequestShareLocation.filter(request => request.type === "receiver")
        setIsNewShareLocationRequest(newRequest.length != 0 ? true : false)
    }, [listRequestShareLocation])

    return (
        <div className="mapAdvancedMenu">
            <div className="menuForm" ref={menuForm}>
                <div className="menuForm__tab__container">
                    <button className={`menuForm__tab ${chooseFriend ? "chosen" : ""} menuForm__tab--friend`} onClick={handleChooseFriend}>
                        Online ({userOnline.length})
                    </button>

                    <button className={`menuForm__tab ${chooseRequest ? "chosen" : ""} menuForm__tab--request`} onClick={handleChooseRequest}>
                        {!isNewShareLocationRequest ? "" : (
                            <p className="menuForm__tab--announce">!</p>
                        )}
                        Request ({listRequest.length})
                    </button>
                </div>

                <div className="menuShowcase">

                    {!chooseFriend ? "" : (
                        <div className="menuShowcase--child menuShowcase--friend">
                            {userOnline.length === 0 ? "" : (
                                userOnline.map((user, index) => {
                                    const isSendRequest = listRequestShareLocation.find(friend => friend.gmail == user.gmail)
                                    const isConnect = mapConnection.find(connection => connection.gmail == user.gmail)

                                    return (
                                        <div key={index} className="menu--item">
                                            <div className="menu--user">
                                                <div className="menu--userAvartar">
                                                    <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.avartarCode}`} alt="Avatar User" />
                                                </div>

                                                <p className="menu__name">{user.username}</p>
                                            </div>

                                            {isSendRequest || isConnect ? "" : (
                                                <button className="menu__button" onClick={() => { handleIsConnect(user.gmail) }}>Connect</button>
                                            )}
                                        </div>
                                    )
                                })
                            )}

                        </div>
                    )}

                    {!chooseRequest ? "" : (
                        <div className="menuShowcase--child menuShowcase--request">

                            {listPendingRequest?.length == 0 ? "" : (

                                <div className="menuShowcase--request--pendingContainer">
                                    <h4>Pending</h4>

                                    <div className="menuShowcase--child--listShowcase">
                                        {listPendingRequest?.map((request, index) => {
                                            return (
                                                <div key={index} className="menu--item--request">
                                                    <div className="menu--user">
                                                        <div className="menu--userAvartar">
                                                            <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${request.avartarCode}`} alt="Avatar User" />
                                                        </div>

                                                        <p className="menu__name">{request.username}</p>
                                                    </div>

                                                    <div className="menu__buttonContainer--item--request">
                                                        <button className="menu__button menu__button--request menu__button--requestRevoke" onClick={() => { handleRevokeRequest(request) }}>
                                                            <i className="far fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}


                                    </div>
                                </div>

                            )}

                            {listRequest?.length == 0 ? "" : (
                                <div className="menuShowcase--request--requestContainer">
                                    <h4>Request</h4>
                                    <div className="menuShowcase--child--listShowcase">

                                        {listRequest?.map((request, index) => {
                                            return (
                                                <div key={index} className="menu--item--request">
                                                    <div className="menu--user">
                                                        <div className="menu--userAvartar">
                                                            <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${request.avartarCode}`} alt="Avatar User" />
                                                        </div>

                                                        <p className="menu__name">{request.username}</p>
                                                    </div>

                                                    <div className="menu__buttonContainer--item--request">
                                                        <button className="menu__button menu__button--request menu__button--requestAccept" onClick={() => { handleAcceptRequest(request) }}>
                                                            <i className="fas fa-check"></i>
                                                        </button>

                                                        <button className="menu__button menu__button--request menu__button--requestDecline" onClick={() => { handleRevokeRequest(request) }}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>
        </div>
    );
};

export default MapMenu;