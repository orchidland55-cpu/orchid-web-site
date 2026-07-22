import { useState } from "react";

import PropertyMap from "./components/PropertyMap";

import CoordinateInputs from "./components/CoordinateInputs";

export default function DueDiligencePage() {

    const [position, setPosition] = useState<[number, number] | null>(null);

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

                setPosition={setPosition}

            />

            <CoordinateInputs

                position={position}

                setPosition={setPosition}

            />

        </div>

    );

}