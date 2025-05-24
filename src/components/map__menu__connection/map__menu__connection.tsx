// Import library
import React, { memo, useEffect, useRef, useState } from "react";

// Import components

// Import services
import { disconect } from "../../services/mapFunction.serv";

// Import interface
import { interface__MapPage__AcceptRequestShareLocation, interface__MapPage__MapConnection, interface__MapPage__Props, interface__MapPage__RequestShareLocation } from "../../types/interface__MapPage";
import { interface__FriendPage__connections } from "../../types/interface__FriendPage";

// Import redux
import { connect, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import custom hooks
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";

// Import css
import "leaflet/dist/leaflet.css";
import "./map__menu__connection.css";

const MapConnectionMenu: React.FC<interface__MapPage__Props> = ({ closeMenu }) => {
    // States
    const menuConnectionForm = useRef<HTMLDivElement>(null)

    // Custom hook
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()

    // Error

    // Data

    // Redux
    const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)

    // Handlers

    // Listener
    useEffect(() => {
        const handleClickOutsideMenu = (event: MouseEvent | TouchEvent) => {
            if (menuConnectionForm.current && !menuConnectionForm.current.contains(event.target as Node)) {
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

    const handleDisconect = async (connection: interface__MapPage__MapConnection) => {
        openSpinner()

        await disconect({
            type: "oneConnection",
            clientGmail: gmail,
            targetConnection: [connection]
        }).then((data) => {
            closeSpinner()
            if (data.status == 200) {
                addToast({
                    typeToast: "s",
                    content: data.data.mess,
                    duration: 3
                })
            } else {
                addToast({
                    typeToast: "e",
                    content: data.data.mess,
                    duration: 3
                })
            }
        }).catch((err) => {
            closeSpinner()

            addToast({
                typeToast: "e",
                content: "Can't process your action",
                duration: 3
            })

            console.log(err)
        })
    }

    const handleDisconectAll = async () => {
        openSpinner()

        await disconect({
            type: "allConnection",
            clientGmail: gmail,
            targetConnection: mapConnection
        }).then((data) => {
            closeSpinner()
            if (data.status == 200) {
                closeMenu()

            } else {
                addToast({
                    typeToast: "e",
                    content: data.data.mess,
                    duration: 3
                })
            }
        }).catch((err) => {
            closeSpinner()

            addToast({
                typeToast: "e",
                content: "Can't process your action",
                duration: 3
            })

            console.log(err)
        })
    }

    return (
        <div className="ConnectionMenu">
            <div className="menuConnectionForm" ref={menuConnectionForm}>
                <div className="ConnectionMenu__titleBox">
                    <h3>Your connections</h3>
                </div>

                <div className="menuConnection">
                    {mapConnection.map((connection, index) => {
                        return (
                            <div key={index} className="menu--item--request">
                                <div className="menu--user">
                                    <div className="menu--userAvartar">
                                        <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${connection.avartarCode}`} alt="Avatar User" />
                                    </div>

                                    <p className="menu__name">{connection.username}</p>
                                </div>

                                {mapConnection.length == 1 ? "" : (
                                    <div className="menu__buttonContainer--item--request">
                                        <button className="menu__button menu__button--request menu__button--requestRevoke" onClick={() => { handleDisconect(connection) }}>
                                            Disconnect
                                        </button>
                                    </div>
                                )}

                            </div>
                        )
                    })}

                </div>

                <div className="ConnectionMenu__btnBox">
                    <button onClick={handleDisconectAll}>Disconnect {mapConnection.length > 1 ? "All" : ""}</button>
                </div>
            </div>

        </div>
    );
};

export default MapConnectionMenu;