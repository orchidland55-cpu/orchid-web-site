import { useState } from "react";

import PropertyMap from "./components/PropertyMap";

import CoordinateInputs from "./components/CoordinateInputs";

export default function DueDiligencePage() {


    const [position, setPosition] =
        useState<[number, number] | null>(null);

    const [latitude, setLatitude] = useState("");

    const [longitude, setLongitude] = useState("");

    const [confirmed, setConfirmed] = useState(false);

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

        </div>

    );

}