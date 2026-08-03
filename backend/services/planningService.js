const turf = require("@turf/turf");

const planningBoundaries = require("../datasets/PlanningBoundary.json");
const zoning = require("../datasets/AllZoning.json");

const allowedUses =
    require("../datasets/PlanningAllowedUses.json");

const prohibitedUses =
    require("../datasets/PlanningProhibitedUses.json");

const planningRules =
    require("../datasets/PlanningRules.json");


exports.analyzePlanning = (latitude, longitude) => {

    const point = turf.point([
        Number(longitude),
        Number(latitude)
    ]);

    let planning = null;
    let zone = null;

    // --------------------------------------------------
    // Find planning document
    // --------------------------------------------------

    for (const boundary of planningBoundaries) {

        const polygon = {
            type: "Feature",
            geometry: boundary.geometry
        };

        if (
            turf.booleanPointInPolygon(
                point,
                polygon
            )
        ) {

            planning = boundary;

            break;

        }

    }

    // --------------------------------------------------
    // Find zoning polygon
    // --------------------------------------------------

    for (const item of zoning) {

        const polygon = {
            type: "Feature",
            geometry: item.geometry
        };

        if (
            turf.booleanPointInPolygon(
                point,
                polygon
            )
        ) {

            zone = item;

            break;

        }

    }

    if (!planning || !zone) {

        return {

            available: false

        };

    }

    const zoneCode =
        zone.zoning_code;

    const allowed =
        allowedUses
            .filter(x => x.zone === zoneCode)
            .slice(0, 5);

    const prohibited =
        prohibitedUses
            .filter(x => x.zone === zoneCode)
            .slice(0, 5);

    const rules =
        planningRules
            .filter(x => x.zone === zoneCode)
            .slice(0, 8);

    return {

        available: true,

        planningDocument:
            planning.designation,

        approvalDate:
            planning.approval_date,

        zoningCode:
            zone.zoning_code,

        zoningDesignation:
            zone.designation,

        allowedUses: allowed,

        prohibitedUses: prohibited,

        rules: rules

    };

};