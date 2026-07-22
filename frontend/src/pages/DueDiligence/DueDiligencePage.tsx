import { useState } from "react";

import PropertyMap from "./components/PropertyMap";

import CoordinateInputs from "./components/CoordinateInputs";

export default function DueDiligencePage() {


    const [position, setPosition] =
        useState<[number, number] | null>(null);

    const [latitude, setLatitude] = useState("");

    const [longitude, setLongitude] = useState("");

    const [confirmed, setConfirmed] = useState(false);

    const [loadingLocation, setLoadingLocation] = useState(false);

    const [locationInfo, setLocationInfo] = useState<{
        commune: string;
        province: string;
        region: string;
    } | null>(null);

    const handlePositionChange = (pos: [number, number]) => {
        setPosition(pos);

        setLatitude(pos[0].toString());
        setLongitude(pos[1].toString());

        setConfirmed(false);
    };

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold">

                    Due Diligence

                </h1>

                <p className="text-gray-500 mt-2">

                    Click anywhere on the map or manually enter coordinates.

                </p>

            </div>

            <PropertyMap
                position={position}
                setPosition={handlePositionChange}
            />

            <CoordinateInputs

                position={position}

                setPosition={handlePositionChange}

            />

            <div className="flex justify-end">
                <button
                    disabled={!position || loadingLocation}
                    onClick={() => {
                        setLoadingLocation(true);

                        // Temporary fake response
                        setTimeout(() => {
                            setLocationInfo({
                                commune: "Loading...",
                                province: "Loading...",
                                region: "Loading..."
                            });

                            setLoadingLocation(false);
                        }, 800);
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${position
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {loadingLocation
                        ? "Analyzing..."
                        : "🔍 Analyze Selected Location"}
                </button>
            </div>

            {locationInfo && (
                <div className="rounded-xl border bg-white shadow p-6 mt-6">
                    <h2 className="text-2xl font-semibold mb-5">
                        Selected Location
                    </h2>

                    <div className="space-y-4">

                        <div>
                            <p className="text-gray-500">Commune</p>
                            <p className="font-semibold">
                                {locationInfo.commune}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Province</p>
                            <p className="font-semibold">
                                {locationInfo.province}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Region</p>
                            <p className="font-semibold">
                                {locationInfo.region}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Status</p>

                            <p className="text-green-600 font-semibold">
                                ✓ Location identified
                            </p>
                        </div>

                    </div>
                </div>
            )}


        </div>

    );

}