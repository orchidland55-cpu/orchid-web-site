import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons for Vite
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
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
}

export default function DueDiligencePage() {
    const [position, setPosition] =
        useState<[number, number] | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Due Diligence
                </h1>

                <p className="text-gray-500 mt-2">
                    Click anywhere on the map to choose a property location.
                </p>
            </div>

            <div className="rounded-xl border bg-white shadow overflow-hidden">
                <MapContainer
                    center={[31.6295, -7.9811]}
                    zoom={11}
                    style={{
                        height: "600px",
                        width: "100%",
                    }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationMarker
                        position={position}
                        setPosition={setPosition}
                    />
                </MapContainer>
            </div>

            <div className="rounded-xl border bg-white shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Selected Location
                </h2>

                {position ? (
                    <>
                        <div className="space-y-2">
                            <p>
                                <strong>Latitude:</strong>{" "}
                                {position[0].toFixed(6)}
                            </p>

                            <p>
                                <strong>Longitude:</strong>{" "}
                                {position[1].toFixed(6)}
                            </p>
                        </div>

                        <button
                            className="mt-6 px-5 py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                            onClick={() => {
                                console.log(position);
                            }}
                        >
                            Use this location
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">
                        No location selected yet.
                    </p>
                )}
            </div>
        </div>
    );
}