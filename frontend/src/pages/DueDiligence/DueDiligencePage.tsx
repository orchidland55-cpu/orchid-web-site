import { useState } from "react";

import PropertyMap from "./components/PropertyMap";
import CoordinateInputs from "./components/CoordinateInputs";

import {
    analyzeLocation,
    type AnalysisResult,
} from "./services/dueDiligenceService";

export default function DueDiligencePage() {

    const [position, setPosition] =
        useState<[number, number] | null>(null);

    const [latitude, setLatitude] = useState("");

    const [longitude, setLongitude] = useState("");

    const [loading, setLoading] = useState(false);

    const [analysis, setAnalysis] =
        useState<AnalysisResult | null>(null);

    const [error, setError] = useState("");

    const handlePositionChange = (pos: [number, number]) => {

        setPosition(pos);

        setLatitude(pos[0].toString());

        setLongitude(pos[1].toString());

        // Clear previous analysis whenever the user picks a new location
        setAnalysis(null);

        setError("");

    };

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold text-red-600">
                    Due Diligence TEST
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

                    disabled={!position || loading}

                    onClick={async () => {

                        if (!position) return;

                        setLoading(true);

                        setError("");

                        setAnalysis(null);

                        try {

                            const result = await analyzeLocation(

                                position[0],

                                position[1]

                            );

                            if (result.success === false) {

                                setError(result.message);

                            } else {

                                setAnalysis(result.data);

                            }

                        } catch {

                            setError("Unable to contact the server.");

                        }

                        setLoading(false);

                    }}

                    className={`px-6 py-3 rounded-lg font-semibold transition ${position
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}

                >

                    {loading
                        ? "Analyzing..."
                        : "🔍 Analyze Selected Location"}

                </button>

            </div>

            {error && (

                <div className="rounded-xl border border-red-300 bg-red-50 p-5">

                    <h2 className="font-bold text-red-700">

                        Region Not Supported

                    </h2>

                    <p className="mt-2 text-red-600">

                        {error}

                    </p>

                </div>

            )}

            {analysis && (

                <div className="rounded-xl border bg-white shadow p-6">

                    <h2 className="text-2xl font-semibold mb-5">

                        Selected Location

                    </h2>

                    <div className="space-y-4">

                        <div>

                            <p className="text-gray-500">

                                Commune

                            </p>

                            <p className="font-semibold">

                                {analysis.commune}

                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">

                                Province

                            </p>

                            <p className="font-semibold">

                                {analysis.province}

                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">

                                Region

                            </p>

                            <p className="font-semibold">

                                {analysis.region}

                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">

                                Status

                            </p>

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