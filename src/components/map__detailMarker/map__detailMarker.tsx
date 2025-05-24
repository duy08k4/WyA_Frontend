// Import library
import React, { useEffect, useRef, useState } from "react";

// Import interface
import { interface__MapPage__DetailMarker__Props } from "../../types/interface__MapPage";

// Import redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import css
import "./map__detailMarker.css"
import { UserInformation } from "../../types/interface__FriendPage";

const MapPage__DetailMarker: React.FC<interface__MapPage__DetailMarker__Props> = ({ closeMenu }) => {
    // States
    const menuMarkerDetailForm = useRef<HTMLDivElement>(null)

    // Data
    const [userInfo, setUserInfo] = useState<UserInformation>()

    // Redux
    const targetGmailForDetail = useSelector((state: RootState) => state.userLocation.targetGmailForDetail)
    const fullFriendInformation = useSelector((state: RootState) => state.userInformation.fullFriendInformation)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)


    // State map
    useEffect(() => {

        if (targetGmailForDetail) {
            const getUserData = fullFriendInformation.filter(user => user.gmail == targetGmailForDetail)
            setUserInfo(getUserData[0])
            console.log(getUserData)

        } else {
            closeMenu()
        }

    }, [targetGmailForDetail])

    // UseEffect
    useEffect(() => {
        const handleClickOutsideMenu = (event: MouseEvent | TouchEvent) => {
            if (menuMarkerDetailForm.current && !menuMarkerDetailForm.current.contains(event.target as Node)) {
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

    return (
        <div className="mapPage__detailMarker__container">
            <div className="mapPage__detailMarker__form" ref={menuMarkerDetailForm}>
                {userInfo && (
                    <>
                        <div className="mapPage__detailMarker__form__element mapPage__detailMarker__form__info">
                            <div className="mapPage__detailMarker__form__info--avartar">
                                <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${userInfo.avartarCode}`} alt="User Avartar" />
                            </div>

                            <div className="mapPage__detailMarker__form__info--username">
                                <p className="mapPage__detailMarker__form__info--username--content">{userInfo.username}</p>
                            </div>

                            <div className="mapPage__detailMarker__form__info--gmail">
                                <i className="far fa-envelope"></i>
                                <p className="mapPage__detailMarker__form__info--gmail--content">{userInfo.gmail}</p>
                            </div>
                        </div>

                        <div className="mapPage__detailMarker__form__element mapPage__detailMarker__form__element__connectionList">
                            <h4 className="mapPage__detailMarker__form__element__connectionList--title">
                                <i className="fas fa-link"></i>
                                Connections
                            </h4>

                            <div className="mapPage__detailMarker__form__element__connectionList__showcase">
                                {userInfo.friends.map((friendOfUser, index) => {
                                    return (
                                        <div key={index} className="mapPage__detailMarker__connectionTag">
                                            <div className="mapPage__detailMarker__connectionTag__avartarBox">
                                                <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${friendOfUser.avartarCode}`} alt="" />
                                            </div>

                                            <p className="mapPage__detailMarker__connectionTag__username">
                                                {friendOfUser.username}
                                                <b style={{ color: "red" }}>{friendOfUser.gmail == gmail ? " (You)" : ""}</b>
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MapPage__DetailMarker;