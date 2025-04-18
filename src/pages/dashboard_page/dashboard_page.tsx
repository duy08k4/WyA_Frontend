// Import library
import { IonPage } from "@ionic/react";
import React, { useState } from "react";
import { useHistory } from "react-router";

// Import components

// Import css
import "./dashboard_page.css"
import "../../main.css"

const DashboardPage:React.FC = () => {
    // State
    const redirect = useHistory()

    // Error

    // Data

    // Handlers
    const handleDirection = (endtryPoint:string) => {
        redirect.push(`/${endtryPoint}`)
    }


    return (
        <IonPage>
            <div className="dashboard__page">
                <div className="dashboard__profileCard--container">
                    <div className="dashboard__profileCard__card">
                        <div className="dashboard__profileCard__imgBox">
                            <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" className="dashboard__profileCard__imgBox--img" alt="User avartar" />
                        </div>

                        <div className="dashboard__profileCard__infoBox">
                            <h3 className="dashboard__profileCard__infoBox--username">Username</h3>
                            <p className="dashboard__profileCard__infoBox--gmail">duytran.290804@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard__menu">
                    <div className="dashboard__menu__titleBox">
                        <h3 className="dashboard__menu__titleBox--title">dashboard</h3>
                    </div>

                    <div className="dashboard__menu__listFuncs">
                        <div className="dashboard__menu__func dashboard__menu__func--map" onClick={() => handleDirection("map")}>
                            <img src="src/assets/dashboard_map_icon.png" className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Map</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--chat" onClick={() => handleDirection("chatting")}>
                            <img src="src/assets/dashboard_chat_icon.png" className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Chat</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--todo" onClick={() => handleDirection("todo")}>
                            <img src="src/assets/dashboard_todo_icon.png" className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Todo</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--about" onClick={() => handleDirection("about")}>
                            <img src="src/assets/dashboard_aboutus_icon.png" className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">About</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--contact" onClick={() => handleDirection("contact")}>
                            <img src="src/assets/dashboard_contactus_icon.png" className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Contact</p>
                        </div>

                        <div className="dashboard__menu__func dashboard__menu__func--profile" onClick={() => handleDirection("profile")}>
                            <img src="src/assets/dashboard_setting_icon.png" className="dashboard__menu__func--icon" alt="Icon function" />
                            <p className="dashboard__menu__func--title">Profile</p>
                        </div>

                    </div>
                </div>
            </div>
        </IonPage>
    )

}
export default DashboardPage