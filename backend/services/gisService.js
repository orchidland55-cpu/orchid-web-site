const fs = require("fs");
const path = require("path");

const turf = require("@turf/turf");

const region = JSON.parse(
    fs.readFileSync(
        path.join(
            __dirname,
            "../datasets/regions/Marrakech_Safi.geojson"
        ),
        "utf8"
    )
);

const communes = JSON.parse(
    fs.readFileSync(
        path.join(
            __dirname,
            "../datasets/Commune.json"
        ),
        "utf8"
    )
);

exports.isSupportedRegion = (latitude, longitude) => {

    const point = turf.point([
        Number(longitude),
        Number(latitude)
    ]);

    return turf.booleanPointInPolygon(
        point,
        region.features[0]
    );

};

exports.findCommune = (latitude, longitude) => {

    const point = turf.point([
        Number(longitude),
        Number(latitude)
    ]);

    for (const commune of communes) {

        if (
            turf.booleanPointInPolygon(
                point,
                commune.geometry
            )
        ) {

            return {

                commune: commune.name,

                province: "Marrakech",

                region: "Marrakech-Safi"

            };

        }

    }

    return null;

};