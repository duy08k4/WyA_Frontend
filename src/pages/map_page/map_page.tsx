// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

// Import components
import MapResizeHandler from "../../components/map_resizeHandler/MapResizeHandler";
import MapMenu from "../../components/map__menu/mapMenu";

// Import css
import "./map_page.css";
import "../../main.css";

// Ionic 
import { Capacitor } from "@capacitor/core";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Leaflet
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import L, { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

const customIcon = new L.Icon({
    iconUrl: 'https://png.pngtree.com/png-clipart/20230805/original/pngtree-map-marker-flat-red-color-icon-ui-position-placement-vector-picture-image_9756810.png',  // Đường dẫn đến biểu tượng
    iconSize: [32, 41],  // Kích thước của biểu tượng
    iconAnchor: [16, 32],  // Chân của biểu tượng sẽ nằm ở đâu
    popupAnchor: [0, -41],  // Vị trí popup sẽ xuất hiện
});

const MapPage: React.FC = () => {
    // States
    const [isMapMenu, setIsMapMenu] = useState<boolean>(false)
    const [isConnect, setIsConnect] = useState<boolean>(false)
    const redirect = useHistory()

    // State map
    const mapRef = useRef<any>(null);
    const markerRef = useRef<LeafletMarker>(null)
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [path, setPath] = useState<[number, number][]>([]); // Position history
    const [position, setPosition] = useState<[number, number]>([10.8231, 106.6297]);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // Error

    // Data

    // Redux
    const listFriends = useSelector((state: RootState) => state.userInformation.friends)

    // Listener

    // Handlers
    const handleCloseMenu = () => {
        setIsMapMenu(!isMapMenu)
    }

    const findMyLocation = () => {
        if (mapRef.current && position) {
            mapRef.current.setView(position, 21)
        }
    }

    const handleIsConnecttion = () => {
        setIsConnect(!isConnect)
    }

    const handleDirection = () => {
        redirect.push("/")
    }


    // Map
    useEffect(() => {
        const getGeolocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    (loc) => {
                        // Khi vị trí thay đổi
                        const newPos: [number, number] = [loc.coords.latitude, loc.coords.longitude];
                        setPosition(newPos);
                    },
                    (error) => {
                        console.error(error);
                    },
                    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                );
            } else {
                console.log("Geolocation không khả dụng trên trình duyệt này.");
            }
        };

        const getMobileGeolocation = async () => {
            try {
                await Geolocation.requestPermissions();
                const id = await Geolocation.watchPosition({}, (loc) => {
                    if (loc && loc.coords) {
                        const newPos: [number, number] = [loc.coords.latitude, loc.coords.longitude];
                        setPosition(newPos);
                    }
                });
            } catch (error) {
                console.error("Không thể lấy vị trí từ Capacitor", error);
            }
        };

        // Kiểm tra nền tảng hiện tại
        if (Capacitor.getPlatform() === 'web') {
            getGeolocation();
        } else {
            getMobileGeolocation();
        }

    }, []);

    useEffect(() => {
        if (mapRef.current && position && !isUserInteracting) {
            mapRef.current.setView(position, mapRef.current.getZoom())
        }
    }, [position, isUserInteracting])

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, []);

    mapRef.current?.on("movestart", () => {
        setIsUserInteracting(true);

        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }

        interactionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
        }, 15000);
    });


    return (
        <IonPage>
            <div className="mapPage">
                <div className="mapPage__header">

                    <div className={`mainPage__searchBox ${isConnect ? "" : "noCnnection"}`}>
                        <button className="mainPage__searchBox__backBtn" onClick={handleDirection}>
                            <i className="fa-solid fa-caret-left mapPage__icon--back"></i>
                        </button>

                        {!isConnect ? "" : (
                            <>
                                <div className="mapPage__userInfor">
                                    <div className="mainPage__searchBox__avatarBox">
                                        <img
                                            src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"
                                            alt="Avatar user"
                                        />
                                    </div>

                                    <p className="mapPage__header--username">Tuong Duy</p>
                                </div>

                                <button className="mapPage__disconnect--button"><i className="fas fa-unlink"></i></button>
                            </>
                        )}

                    </div>

                </div>

                <div className="mapPage__mapShowcase">
                    <MapContainer
                        center={[10.8231, 106.6297]}
                        zoom={16}
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
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position} icon={customIcon} ref={markerRef}>
                            <Popup>
                                <img src="https://cdn3.iconfinder.com/data/icons/business-299/24/Location_Pin-512.png" height={100} width={100} alt="" />
                            </Popup>
                        </Marker>
                        <MapResizeHandler />
                    </MapContainer>
                </div>

                <div className="mapPage__mainButtonContainer">
                    <button className="mapPage__mainButtonContainer--button mapPage__mainButtonContainer--button--advancedMenu" onClick={handleCloseMenu}>
                        <i className="fas fa-ellipsis-h"></i>
                    </button>

                    <button className="mapPage__mainButtonContainer--button mapPage__mainButtonContainer--button--locate" onClick={findMyLocation}>
                        <i className="fas fa-crosshairs"></i>
                    </button>

                    <button className="mapPage__mainButtonContainer--button mapPage__mainButtonContainer--button--gps">
                        <i className="fas fa-road"></i>
                    </button>
                </div>

                {/* <div className="mapPage__buttonContainer">
                    <button className="mapPage__func mapPage__func--disconnect"><i className="fas fa-unlink"></i></button>
                    <button className="mapPage__func mapPage__func--direction"><i className="fas fa-road"></i></button>
                </div> */}

                {!isMapMenu ? "" : (
                    <MapMenu closeMenu={handleCloseMenu} friends={listFriends} handleIsConnecttion={handleIsConnecttion} />
                )}
            </div>
        </IonPage>
    );
};

export default MapPage;