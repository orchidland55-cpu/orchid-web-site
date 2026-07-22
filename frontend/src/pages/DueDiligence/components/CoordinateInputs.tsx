interface Props {

    position: [number, number] | null;

    setPosition: (p: [number, number]) => void;

}

export default function CoordinateInputs({

    position,

    setPosition

}: Props) {

    return (

        <div className="rounded-xl border bg-white shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

                Coordinates

            </h2>

            <div className="grid md:grid-cols-2 gap-5">

                <div>

                    <label>

                        Latitude

                    </label>

                    <input

                        className="w-full border rounded-lg p-3 mt-2"

                        value={position?.[0] ?? ""}

                        onChange={(e) => {

                            const lat = parseFloat(e.target.value);

                            setPosition([

                                lat,

                                position?.[1] ?? 0

                            ]);

                        }}

                    />

                </div>

                <div>

                    <label>

                        Longitude

                    </label>

                    <input

                        className="w-full border rounded-lg p-3 mt-2"

                        value={position?.[1] ?? ""}

                        onChange={(e) => {

                            const lng = parseFloat(e.target.value);

                            setPosition([

                                position?.[0] ?? 0,

                                lng

                            ]);

                        }}

                    />

                </div>

            </div>

        </div>

    );

}