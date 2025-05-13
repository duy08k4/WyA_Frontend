// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

// Import components
import MapResizeHandler from "../../components/map_resizeHandler/MapResizeHandler";
import MapMenu from "../../components/map__menu/mapMenu";
import MapConnectionMenu from "../../components/map__menu__connection/map__menu__connection";
import MapRoutingMenu from "../../components/map__menu__routing/map__menu__routing";

// Import css
import "./map_page.css";
import "../../main.css";

// Ionic 
import { Capacitor } from "@capacitor/core";

// Custom hook
import { useSocket } from "../../hooks/socket/socket";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Leaflet
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import L, { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-defaulticon-compatibility';

const customIcon = new L.Icon({
    iconUrl: 'https://png.pngtree.com/png-clipart/20230805/original/pngtree-map-marker-flat-red-color-icon-ui-position-placement-vector-picture-image_9756810.png',  // Đường dẫn đến biểu tượng
    iconSize: [32, 41],  // Kích thước của biểu tượng
    iconAnchor: [16, 32],  // Chân của biểu tượng sẽ nằm ở đâu
    popupAnchor: [0, -41],  // Vị trí popup sẽ xuất hiện
});

const customTargetIcon = new L.Icon({
    iconUrl: 'https://easydrawingguides.com/wp-content/uploads/2017/01/How-to-Draw-a-cartoon-car-20.png',  // Đường dẫn đến biểu tượng
    iconSize: [32, 41],  // Kích thước của biểu tượng
    iconAnchor: [16, 32],  // Chân của biểu tượng sẽ nằm ở đâu
    popupAnchor: [0, -41],  // Vị trí popup sẽ xuất hiện
});

const MapPage: React.FC = () => {
    // States
    const [isMapMenu, setIsMapMenu] = useState<boolean>(false)
    const [isConnect, setIsConnect] = useState<boolean>(false)
    const [haveConnection, setHaveConnection] = useState<boolean>(false)
    const [isRouting, setIsRouting] = useState<boolean>(false)
    const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
    const [routes, setRoutes] = useState<any[]>([]);
    const redirect = useHistory()

    // State map
    const mapRef = useRef<any>(null);
    const markerRef = useRef<LeafletMarker>(null)
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [path, setPath] = useState<[number, number][]>([]); // Position history
    const [position, setPosition] = useState<[number, number]>([10.8231, 106.6297]);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // Custom hook
    const { shareLocation } = useSocket()

    // Data
    const maxAvartarBox = parseInt(import.meta.env.VITE_HEADER_SHOWCASEUSER_MAX_ELEMENT)

    // Redux
    const listFriends = useSelector((state: RootState) => state.userInformation.friends)
    const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)

    const listUserOnline = useSelector((state: RootState) => state.userLocation.listUserOnline)
    const targetLocation = useSelector((state: RootState) => state.userLocation.targetLocation)

    // Function
    const calculateRoute = useRef<(targetPosition: [number, number]) => void>(() => {})
    const clearRoute = useRef<() => void>(() => {})

    // Handlers
    const handleCloseMenu = () => {
        setIsMapMenu(!isMapMenu)
    }

    const handleCloseMenuConnection = () => {
        setHaveConnection(!haveConnection)
    }

    const handleCloseMenuRouting = () => {
        setIsRouting(!isRouting)
    }

    const findMyLocation = () => {
        if (mapRef.current && position) {
            mapRef.current.setView(position, 21)
        }
    }

    const handleRoutingTargetUser = (targetGmail: string) => {
        const getLocationForRouting = targetLocation[btoa(targetGmail)]
        clearRoute.current()
        calculateRoute.current(getLocationForRouting)
        handleCloseMenuRouting()
    }

    const handleCloseRoutingTargetUser = () => {
        clearRoute.current()
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
                        // Log error when time out
                        // console.error(error);
                    },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
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

        // Check platform
        if (Capacitor.getPlatform() === 'web') {
            getGeolocation();
        } else {
            getMobileGeolocation();
        }

    }, []);

    // Routing
    calculateRoute.current = (targetPosition: [number, number]) => {
        if (mapRef.current && position) {  // Kiểm tra mapRef.current và position
            // Xóa tuyến đường cũ nếu có
            if (routingControl) {
                mapRef.current?.removeControl(routingControl);
            }

            // Tạo tuyến đường mới
            const waypoints = [
                L.latLng(position[0], position[1]),
                L.latLng(targetPosition[0], targetPosition[1]),
            ];

            const control = L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: true,
                showAlternatives: true,
                fitSelectedRoutes: true,
                show: false,
                lineOptions: {
                    styles: [{ color: '#3a7bd5', opacity: 0.7, weight: 5 }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 10,
                },
                plan: L.Routing.plan(waypoints, {
                    draggableWaypoints: false,
                    addWaypoints: false,
                    createMarker: () => false, // Không tạo marker
                }),
            }).addTo(mapRef.current);

            setRoutingControl(control); // Lưu control mới vào state

        }
    };

    // Hàm xóa tuyến đường
    clearRoute.current = () => {
        if (mapRef.current && routingControl) {
            mapRef.current.removeControl(routingControl);
            setRoutingControl(null);
        }
    };

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

    useEffect(() => {
        if (mapConnection && mapConnection.length != 0) {
            setIsConnect(true)
        } else {
            setIsConnect(false)
        }
    }, [mapConnection])


    useEffect(() => {
        shareLocation({
            clientGmail: gmail,
            clientLocation: position,
            targetUsers: mapConnection
        })
    }, [position])

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
                                    {mapConnection.slice(0, maxAvartarBox).map((connection, index) => (
                                        <div
                                            key={index}
                                            className={`mainPage__searchBox__avatarBox ${index == maxAvartarBox - 1 ? "mainPage__searchBox__avatarBoxLast" : ""}`}
                                            style={{ ['--n' as any]: `${index}`, ['--count' as any]: index == maxAvartarBox - 1 ? `"${mapConnection?.length - maxAvartarBox}"` : `""` }}
                                        >
                                            <img
                                                src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"
                                                alt="Avatar user"
                                            />
                                        </div>
                                    ))}


                                </div>

                                <button className="mapPage__disconnect--button" onClick={handleCloseMenuConnection}>Disconnect</button>
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
                        <Marker position={position} icon={customIcon} ref={markerRef}></Marker>

                        {mapConnection.map((connection, index) => {
                            const connectionGmail = connection.gmail
                            if (targetLocation[btoa(connectionGmail)]) {
                                return <Marker key={index} position={targetLocation[btoa(connectionGmail)]} icon={customTargetIcon} ref={markerRef}></Marker>
                            }
                        })}


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

                    <button className="mapPage__mainButtonContainer--button mapPage__mainButtonContainer--button--gps" onClick={handleCloseMenuRouting}>
                        <i className="fas fa-road"></i>
                    </button>
                </div>

                {!isMapMenu ? "" : (
                    <MapMenu closeMenu={handleCloseMenu} />
                )}

                {!haveConnection ? " " : (
                    <MapConnectionMenu closeMenu={handleCloseMenuConnection} />
                )}

                {!isRouting ? "" : (
                    <MapRoutingMenu closeMenu={handleCloseMenuRouting} handleRoutingTargetUser={handleRoutingTargetUser} handleCloseRoutingTargetUser={handleCloseRoutingTargetUser} />
                )}

            </div>
        </IonPage>
    );
};

export default MapPage;