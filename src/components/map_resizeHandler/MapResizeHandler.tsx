import { useEffect } from "react";
import { useMap } from "react-leaflet";

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

export default MapResizeHandler