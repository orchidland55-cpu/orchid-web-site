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