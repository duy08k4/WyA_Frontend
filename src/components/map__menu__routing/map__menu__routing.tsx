// Import library
import React, { memo, useEffect, useRef, useState } from "react";

// Import components

// Import services
import { disconect } from "../../services/mapFunction.serv";

// Import interface
import { interface__MapPage__AcceptRequestShareLocation, interface__MapPage__MapConnection, interface__MapPage__Props, interface__MapPage__RequestShareLocation, interface__MapPage__Routing__Props } from "../../types/interface__MapPage";
import { interface__FriendPage__connections } from "../../types/interface__FriendPage";

// Import redux
import { connect, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import custom hooks
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";

// Import css
import "leaflet/dist/leaflet.css";
import "./map__menu__routing.css";

const MapRoutingMenu: React.FC<interface__MapPage__Routing__Props> = ({ closeMenu, handleRoutingTargetUser, handleCloseRoutingTargetUser }) => {
    // States
    const menuRoutingForm = useRef<HTMLDivElement>(null)

    // Custom hook
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()

    // Error

    // Data

    // Redux
    const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)
    const listUserOnline = useSelector((state: RootState) => state.userLocation.listUserOnline)
    const targetRouting = useSelector((state: RootState) => state.userLocation.targetRouting)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)

    // Handlers

    // Listener
    useEffect(() => {
        const handleClickOutsideMenu = (event: MouseEvent | TouchEvent) => {
            if (menuRoutingForm.current && !menuRoutingForm.current.contains(event.target as Node)) {
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
        <div className="ConnectionMenu">
            <div className="menuConnectionForm" ref={menuRoutingForm}>
                <div className="ConnectionMenu__titleBox">
                    <h3>Routing</h3>
                </div>

                <div className="menuConnection">
                    {mapConnection.map((connection, index) => {
                        if (listUserOnline[btoa(connection.gmail)] == false) return ""

                        return (
                            <div key={index} className="menu--item--request menuRouting--item--request">
                                <div className="menu--user">
                                    <div className="menu--userAvartar">
                                        <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${connection.avartarCode}`} alt="Avatar User" />
                                    </div>

                                    <p className="menu__name menu__name__routingMenu">{connection.username}</p>
                                </div>

                                <div className="menu__buttonContainer--item--request menu__buttonContainer--item--routing">

                                    {targetRouting[btoa(connection.gmail)] ? "" : (
                                        <button className="menu__button menu__button--request" onClick={() => { handleRoutingTargetUser(connection.gmail, connection.username) }}>
                                            <i className="fas fa-directions"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                        )
                    })}
                </div>

                <div className="ConnectionMenu__btnBox">
                    <button className="removeRouting__btn" onClick={() => { handleCloseRoutingTargetUser(true) }}>Remove routing</button>
                </div>
            </div>

        </div>
    );
};

export default MapRoutingMenu;