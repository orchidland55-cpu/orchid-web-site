import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({
    position,
    setPosition,
}: {
    position: [number, number] | null;
    setPosition: (pos: [number, number]) => void;
}) {

    useMapEvents({

        click(e) {

            setPosition([
                e.latlng.lat,
                e.latlng.lng
            ]);

        }

    });

    return position
        ? <Marker position={position} />
        : null;
}

interface Props {

    position: [number, number] | null;

    setPosition: (p: [number, number]) => void;

}

export default function PropertyMap({

    position,

    setPosition

}: Props) {

    return (

        <div className="rounded-xl border bg-white shadow overflow-hidden">

            <MapContainer

                center={[31.6295, -7.9811]}

                zoom={11}

                style={{
                    height: "600px",
                    width: "100%"
                }}

            >

                <TileLayer

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                    attribution="&copy; OpenStreetMap contributors"

                />

                <LocationMarker

                    position={position}

                    setPosition={setPosition}

                />

            </MapContainer>

        </div>

    );

}