// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

// Import components
import MapResizeHandler from "../../components/map_resizeHandler/MapResizeHandler";
import MapMenu from "../../components/map__menu/mapMenu";
import MapConnectionMenu from "../../components/map__menu__connection/map__menu__connection";
import MapRoutingMenu from "../../components/map__menu__routing/map__menu__routing";
import MapPage__DetailMarker from "../../components/map__detailMarker/map__detailMarker";

// Import css
import "./map_page.css";
import "../../main.css";

// Custom hook
import { useSpinner } from "../../hooks/spinner/spinner";
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
import { useCache } from "../../hooks/cache/cache";
import { cacheRemoveUserLocation_targetLocation, cacheSetUserLocation_targetGmailForDetail, cacheUpdateUserLocation_targetRouting } from "../../redux/reducers/userLocation.reducer";
import { useToast } from "../../hooks/toastMessage/toast";

// Client marker
const clientMarker = `
    <div class="clientMarker"></div>
`

const customIcon = L.divIcon({
    // iconUrl: 'https://png.pngtree.com/png-clipart/20230805/original/pngtree-map-marker-flat-red-color-icon-ui-position-placement-vector-picture-image_9756810.png',  // Đường dẫn đến biểu tượng
    className: "client__customMarker",
    html: clientMarker,
    iconAnchor: [8, 0]
});

const MapPage: React.FC = () => {
    // States
    const [isMapMenu, setIsMapMenu] = useState<boolean>(false)
    const [isConnect, setIsConnect] = useState<boolean>(false)
    const [haveConnection, setHaveConnection] = useState<boolean>(false)
    const [isRouting, setIsRouting] = useState<boolean>(false)
    const [showDetailMarker, setShowDetailMarker] = useState<boolean>(false)
    const [isNewShareLocationRequest, setIsNewShareLocationRequest] = useState<boolean>(false)
    const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
    const [routes, setRoutes] = useState<any[]>([]);
    const [userRouting, setUserRouting] = useState<string>("")
    const [userRouting_name, setUserRouting_name] = useState<string>("")
    const redirect = useHistory()

    // State map
    const mapRef = useRef<any>(null);
    const markerRef = useRef<LeafletMarker>(null)
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [path, setPath] = useState<[number, number][]>([]); // Position history
    // const [position, setPosition] = useState<[number, number]>([10.8231, 106.6297]);
    // const [oldPosition, setOldPosition] = useState<[number, number]>([0, 0]);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const position = useRef<[number, number]>([10.8231, 106.6297]);
    const oldPosition = useRef<[number, number]>([0, 0]);

    // Custom hook
    const { shareLocation } = useSocket()
    const { openSpinner, closeSpinner } = useSpinner()
    const { cacheSetData } = useCache()
    const { addToast } = useToast()

    // Data
    const targetGmailForShowDetail = useState<string>("")
    const maxAvartarBox = parseInt(import.meta.env.VITE_HEADER_SHOWCASEUSER_MAX_ELEMENT)

    // Redux
    const listFriends = useSelector((state: RootState) => state.userInformation.friends)
    const mapConnection = useSelector((state: RootState) => state.userLocation.mapConnection)
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)
    const avartarCode = useSelector((state: RootState) => state.userInformation.avartarCode)

    const listUserOnline = useSelector((state: RootState) => state.userLocation.listUserOnline)
    const targetLocation = useSelector((state: RootState) => state.userLocation.targetLocation)
    const shareLocationRequest = useSelector((state: RootState) => state.userLocation.shareLocationRequest)

    // Function
    const calculateRoute = useRef<(targetPosition: [number, number]) => void>(() => { })
    const clearRoute = useRef<() => void>(() => { })
    const haversineDistance = useRef( // Calculate Distance (haversine)
        ([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number => {
            const R = 6371000; // Bán kính Trái Đất (km)
            const toRad = (deg: number) => deg * Math.PI / 180;

            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;

            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        })

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

    const handleCloseShowMarkerDetail = () => {
        setShowDetailMarker(!showDetailMarker)
    }

    const findMyLocation = () => {
        if (mapRef.current && position) {
            mapRef.current.setView(position.current, 21)
            setIsUserInteracting(false)
        }
    }

    // Handle show detail marker
    const handleShowDetailMarker = (targetGmail_input: string) => {
        cacheSetData(cacheSetUserLocation_targetGmailForDetail(targetGmail_input))
        setShowDetailMarker(true)
    }

    // Handle Routing
    const handleRoutingTargetUser = (targetGmail: string, targetName: string) => {
        const getLocationForRouting = targetLocation[btoa(targetGmail)]
        setUserRouting(targetGmail)
        setUserRouting_name(targetName)

        if (getLocationForRouting) {
            clearRoute.current()
            calculateRoute.current(getLocationForRouting)
            cacheSetData(cacheUpdateUserLocation_targetRouting({ targetGmail, targetLocation: getLocationForRouting }))
            handleCloseMenuRouting()
        } else {
            addToast({
                typeToast: "e",
                content: `${targetName} don't share location`,
                duration: 3
            })
        }
    }

    useEffect(() => {
        if (userRouting != "" && listUserOnline[btoa(userRouting)] == false) {
            handleCloseRoutingTargetUser(false)
            setUserRouting("")
            cacheSetData(cacheUpdateUserLocation_targetRouting({ targetGmail: "", targetLocation: undefined }))
            // cacheSetData(cacheRemoveUserLocation_targetLocation({ targetGmail }))
            setUserRouting_name("")
        } else {
            const findUser = listFriends.filter(friend => friend.gmail == userRouting)
            if (findUser.length == 0) {
                handleCloseRoutingTargetUser(false)
            }
        }
    }, [listUserOnline, listFriends])

    useEffect(() => {
        const newRequest = shareLocationRequest.filter(request => request.type === "receiver")
        setIsNewShareLocationRequest(newRequest.length != 0 ? true : false)
    }, [shareLocationRequest])

    const handleCloseRoutingTargetUser = (isToast: boolean) => {
        clearRoute.current()
        if (isToast) {
            addToast({
                typeToast: "s",
                content: "Remove routing",
                duration: 5
            })
        }

        cacheSetData(cacheUpdateUserLocation_targetRouting({ targetGmail: "", targetLocation: undefined }))
    }

    const handleDirection = () => {
        redirect.push("/")
    }

    // Map
    const getPositionLoop = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (mapConnection.length > 0 && getPositionLoop.current === null) {
            getPositionLoop.current = setInterval(async () => {
                try {
                    const coordinates = await Geolocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 30000,
                        maximumAge: 0
                    })

                    const newPosition: [number, number] = [
                        coordinates.coords.latitude,
                        coordinates.coords.longitude
                    ]

                    if (oldPosition.current[0] === 0 && oldPosition.current[1] === 0) {
                        position.current = [...newPosition]
                        oldPosition.current = [...newPosition]

                        shareLocation({
                            clientGmail: gmail,
                            clientLocation: newPosition,
                            targetUsers: mapConnection
                        })
                    } else {
                        if (oldPosition.current[0] !== newPosition[0] || oldPosition.current[1] !== newPosition[1]) {
                            position.current = [...newPosition]
                            oldPosition.current = [...newPosition]
                        }
                    }

                    if (mapRef.current && isUserInteracting == false) {
                        mapRef.current.setView(newPosition, mapRef.current.getZoom())
                    }
                } catch (error) {
                    console.log(error)
                }
            }, 2000)
        }

        if (mapConnection.length === 0 && getPositionLoop.current !== null) {
            clearInterval(getPositionLoop.current)
            getPositionLoop.current = null
        }

        return () => {
            if (getPositionLoop.current !== null) {
                clearInterval(getPositionLoop.current)
                getPositionLoop.current = null
            }
        }
    }, [mapConnection.length])

    useEffect(() => {
        setTimeout(() => {
            shareLocation({
                clientGmail: gmail,
                clientLocation: position.current,
                targetUsers: mapConnection
            })
        }, 1500)

    }, [position.current, listUserOnline, mapConnection.length])

    const createTargetMarker = (targetAvartarCode: string) => {
        const targetMarker = `
            <div class="targetMarker">
                <div class="targetMarker__imgBox">
                    <img src=${`https://api.dicebear.com/8.x/bottts/svg?seed=${targetAvartarCode}`} alt="" />
                </div>
                
                <div class="targetMarker__arrow">
                
                </div>
            </div>
        `

        return L.divIcon({
            className: "target__customMarker",
            html: targetMarker,
            iconAnchor: [27, 57]
        })
    }


    // Routing
    calculateRoute.current = (targetPosition: [number, number]) => {
        if (mapRef.current && position) {  // Kiểm tra mapRef.current và position
            // Xóa tuyến đường cũ nếu có
            if (routingControl) {
                mapRef.current?.removeControl(routingControl);
            }

            // Tạo tuyến đường mới
            const waypoints = [
                L.latLng(position.current[0], position.current[1]),
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
                    createMarker: () => false,
                }),
            }).addTo(mapRef.current);

            setRoutingControl(control);
        }
    };

    useEffect(() => {
        if (userRouting && targetLocation[btoa(userRouting)]) {
            calculateRoute.current(targetLocation[btoa(userRouting)]);
        }
    }, [targetLocation[btoa(userRouting)]]);

    // Hàm xóa tuyến đường
    clearRoute.current = () => {
        if (mapRef.current && routingControl) {
            mapRef.current.removeControl(routingControl);
            setRoutingControl(null);
        }
    };

    useEffect(() => {
        if (mapRef.current && position && !isUserInteracting) {
            mapRef.current.setView(position.current, mapRef.current.getZoom())
        }
    }, [position.current, isUserInteracting])

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, []);

    // Ngăn tự động set view
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
            const findTargetRouting = mapConnection.filter(connection => connection.gmail == userRouting)

            if (findTargetRouting.length == 0) {
                handleCloseRoutingTargetUser(false)
            }
        } else {
            setIsConnect(false)
            handleCloseRoutingTargetUser(false)
        }
    }, [mapConnection.length])

    useEffect(() => {
        (async () => {
            try {
                const coordinates = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0
                })

                const newPosition: [number, number] = [
                    coordinates.coords.latitude,
                    coordinates.coords.longitude
                ]

                if (oldPosition.current[0] === 0 && oldPosition.current[1] === 0) {
                    position.current = [...newPosition]
                    oldPosition.current = [...newPosition]

                    shareLocation({
                        clientGmail: gmail,
                        clientLocation: newPosition,
                        targetUsers: mapConnection
                    })
                } else {
                    if (oldPosition.current[0] !== newPosition[0] || oldPosition.current[1] !== newPosition[1]) {
                        position.current = [...newPosition]
                        oldPosition.current = [...newPosition]
                    }
                }

                if (mapRef.current && isUserInteracting == false) {
                    mapRef.current.setView(newPosition, mapRef.current.getZoom())
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [mapConnection.length])

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
                                                src={`https://api.dicebear.com/8.x/bottts/svg?seed=${connection.avartarCode}`}
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
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <Marker position={position.current} icon={customIcon} ref={markerRef}></Marker>

                        {mapConnection.map((connection, index) => {
                            const connectionGmail = connection.gmail
                            if (targetLocation[btoa(connectionGmail)] && listUserOnline[btoa(connectionGmail)]) {
                                return <Marker
                                    key={index}
                                    position={targetLocation[btoa(connectionGmail)]}
                                    icon={createTargetMarker(connection.avartarCode)} ref={markerRef}
                                    eventHandlers={{
                                        click: () => { handleShowDetailMarker(connectionGmail) }
                                    }}
                                ></Marker>
                            }
                        })}


                        <MapResizeHandler />
                    </MapContainer>
                </div>

                <div className="mapPage__mainButtonContainer">
                    <button className="mapPage__mainButtonContainer--button mapPage__mainButtonContainer--button--advancedMenu" onClick={handleCloseMenu}>
                        {!isNewShareLocationRequest ? "" : (
                            <p className="mapPage__mainButtonContainer--button--announce">!</p>
                        )}
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
                    <MapConnectionMenu closeMenu={handleCloseMenuConnection} closeRouting={handleCloseRoutingTargetUser} closeRoutingTargetGmail={userRouting} />
                )}

                {!isRouting ? "" : (
                    <MapRoutingMenu closeMenu={handleCloseMenuRouting} handleRoutingTargetUser={handleRoutingTargetUser} handleCloseRoutingTargetUser={handleCloseRoutingTargetUser} />
                )}

                {!showDetailMarker ? "" : (
                    <MapPage__DetailMarker closeMenu={handleCloseShowMarkerDetail} />
                )}
            </div>
        </IonPage>
    );
};

export default MapPage;