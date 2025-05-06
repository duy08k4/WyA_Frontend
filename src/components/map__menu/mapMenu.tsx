// Import library
import React, { memo, useEffect, useRef, useState } from "react";

// Import components

// Import services

// Import interface
import { interface__MapPage__Props } from "../../types/interface__MapPage";

// Import css
import "leaflet/dist/leaflet.css";
import "./mapMenu.css";

const MapMenu: React.FC<interface__MapPage__Props> = ({ friends, closeMenu, handleIsConnecttion }) => {
    // States
    const menuForm = useRef<HTMLDivElement>(null)
    const [chooseFriend, setChooseFriend] = useState<boolean>(false)
    const [chooseRequest, setChooseRequest] = useState<boolean>(false)


    // Error

    // Data
    const [choice, setChoide] = useState<string>("friends")
    // const [renderComponent, setRenderComponent] = useState<JSX.Element | null>(null)

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

    return (
        <div className="mapAdvancedMenu">
            <div className="menuForm" ref={menuForm}>
                <div className="menuForm__title__container">
                    <h2 className="menuForm__title">Online (3)</h2>
                </div>

                <div className="menuShowcase">

                        <div className="menu--item">
                            <div className="menu--user">
                                <div className="menu--userAvartar">
                                    <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                                </div>

                                <p className="menu__name">Username</p>
                            </div>

                            <button className="menu__button" onClick={handleIsConnecttion}>Connect</button>
                        </div>

                        <div className="menu--item">
                            <div className="menu--user">
                                <div className="menu--userAvartar">
                                    <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                                </div>

                                <p className="menu__name">Username</p>
                            </div>

                            <button className="menu__button">Connect</button>
                        </div>

                        <div className="menu--item">
                            <div className="menu--user">
                                <div className="menu--userAvartar">
                                    <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                                </div>

                                <p className="menu__name">Username</p>
                            </div>

                            <button className="menu__button">Connect</button>
                        </div>

                </div>

            </div>
        </div>
    );
};

export default MapMenu;