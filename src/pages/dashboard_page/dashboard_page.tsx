// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

// Import components

// Redux
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

// Import css
import "./dashboard_page.css"
import "../../main.css"

// Import image
import mapIcon from "../../assets/dashboard_map_icon.png"
import friendIcon from '../../assets/dashboard_friend_icon.png'
import chatIcon from '../../assets/dashboard_chat_icon.png'
import aboutIcon from '../../assets/dashboard_aboutus_icon.png'
import contactIcon from '../../assets/dashboard_contactus_icon.png'
import profileIcon from '../../assets/dashboard_setting_icon.png'
import { useCache } from "../../hooks/cache/cache";


const DashboardPage: React.FC = () => {
    // State
    const [isNewMessage, setIsNewMessage] = useState<boolean>(false)
    const redirect = useHistory()

    // Custom hook
    const { cacheSetData } = useCache()

    // Redux
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)
    const username = useSelector((state: RootState) => state.userInformation.username)
    const amountNewChat = useSelector((state: RootState) => state.userChat.amountNewChat)

    // Handlers
    const handleDirection = (endtryPoint: string) => {
        redirect.push(`/${endtryPoint}`)
    }

    useEffect(() => {
        let amount = Object.values(amountNewChat)
            .filter(item => item.amountNewMessage !== 0)     // lọc theo điều kiện
            .reduce((acc, item) => acc + item.amountNewMessage, 0);

        setIsNewMessage(amount == 0 ? false : true)
    }, [amountNewChat])

    return (
        <IonPage>

            <div className="dashboard__page">
                <div className="dashboard__profileCard--container">
                    <div className="dashboard__profileCard__card">
                        <div className="dashboard__profileCard__imgBox">
                            <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" className="dashboard__profileCard__imgBox--img" alt="User avartar" />
                        </div>

                        <div className="dashboard__profileCard__infoBox">
                            <h3 className="dashboard__profileCard__infoBox--username">{username}</h3>
                            <p className="dashboard__profileCard__infoBox--gmail">{gmail}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard__menu">
                    <div className="dashboard__menu__titleBox">
                        <h3 className="dashboard__menu__titleBox--title">dashboard</h3>
                    </div>

                    <div className="dashboard__menu__listFuncs">
                        <div className="dashboard__menu__func dashboard__menu__func--map" onClick={() => handleDirection("map")}>
                            <img src={mapIcon} className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Map</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--chat" onClick={() => handleDirection("friend")}>
                            <img src={friendIcon} className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Connection</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--todo" onClick={() => handleDirection("chat")}>
                            {!isNewMessage ? "" : (
                                <p className="dashboard__menu__func--amount">!</p>
                            )}

                            <img src={chatIcon} className="dashboard__chat__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Message</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--about" onClick={() => handleDirection("about")}>
                            <img src={aboutIcon} className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">About</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--contact" onClick={() => handleDirection("contact")}>
                            <img src={contactIcon} className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Contact</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--profile" onClick={() => handleDirection("profile")}>
                            <img src={profileIcon} className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Profile</p>
                        </div>

                    </div>
                </div>
            </div>
        </IonPage>

    )

}
export default DashboardPage