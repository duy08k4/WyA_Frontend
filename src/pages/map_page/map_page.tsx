// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

// Import components
import { MapContainer, TileLayer, useMap } from "react-leaflet";

// Import css
import "./map_page.css";
import "../../main.css";
import "leaflet/dist/leaflet.css";

// Component for handling resize map
const MapResizeHandler = () => {
    const map = useMap();

    useEffect(() => {
        // Xử lý khi component mount
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Thêm ResizeObserver để theo dõi thay đổi kích thước
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });

        const mapContainer = map.getContainer();
        resizeObserver.observe(mapContainer);

        return () => {
            resizeObserver.unobserve(mapContainer);
        };
    }, [map]);

    return null;
};

const MapPage: React.FC = () => {
    // States
    const mapRef = useRef<any>(null);
    const [isSearchFriend, setIsSearchFriend] = useState<boolean>(false)
    const searchHistory = useRef<HTMLDivElement>(null)
    const redirect = useHistory()

    // Error

    // Data
    const [searchData, setSearchData] = useState<string>("")

    // Listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (searchHistory.current && !searchHistory.current.contains(event.target as Node)) {
              setIsSearchFriend(false);
            }
          };
      
          if (isSearchFriend) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
          }
          
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
          };
    }, [isSearchFriend])

    // Handlers
    const showSearch = (e: React.MouseEvent) => {
        if (!isSearchFriend) setIsSearchFriend(true)
    }

    const handleDirection = () => {
        redirect.push("/")
    }


    return (
        <IonPage>
            <div className="mapPage">
                <div className="mapPage__header" ref={searchHistory}>
                    <div className={`mainPage__searchBox ${!isSearchFriend ? "allBorder": ""}`}>
                        <button className="mainPage__searchBox__backBtn" onClick={handleDirection}>
                            <i className="fa-solid fa-caret-left mapPage__icon--back"></i>
                        </button>

                        <input
                            type="text"
                            className="mainPage__searchBox__input"
                            placeholder="Find your friend..."
                            onClick={showSearch}
                            onChange={(e) => {setSearchData(e.target.value)}}
                            value={searchData}
                        />

                        <div className="mainPage__searchBox__avatarBox">
                            <img
                                src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"
                                alt="Avatar user"
                            />
                        </div>
                    </div>

                    {isSearchFriend && (
                        <div className="map__search--history">
                            <div className="map__search--item">
                                <div className="map__search--user">
                                    <div className="map__search--userAvartar">
                                        <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                                    </div>

                                    <p className="map__name--usersearch">Username</p>
                                </div>

                                <button className="map__button--connect">Connect</button>
                            </div>
                        </div>
                    )}

                </div>

                <div className="mapPage__mapShowcase">
                    <MapContainer
                        center={[10.7769, 106.7009]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        ref={mapRef}
                        zoomControl={false}
                        whenReady={() => {
                            setTimeout(() => {
                                if (mapRef.current) {
                                    mapRef.current.invalidateSize();
                                }
                            }, 100);
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapResizeHandler />
                    </MapContainer>
                </div>

                <div className="mapPage__menu">
                    <button className="mapPage__func mapPage__func--locate"><i className="fas fa-globe-asia"></i></button>
                    <button className="mapPage__func mapPage__func--gps"><i className="fas fa-circle"></i></button>
                </div>
            </div>
        </IonPage>
    );
};

export default MapPage;