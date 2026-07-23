const gisService = require("../services/gisService");
const planningService = require("../services/planningService");

exports.analyzeLocation = async (req, res) => {

    const { latitude, longitude } = req.body;

    const supported = gisService.isSupportedRegion(
        latitude,
        longitude
    );

    if (!supported) {

        return res.json({

            success: false,

            supported: false,

            message:
                "Due diligence is currently available only within the Marrakech-Safi region."

        });

    }

    const location = gisService.findCommune(
        latitude,
        longitude
    );

    const planning = planningService.analyzePlanning(
        latitude,
        longitude
    );

    return res.json({

        success: true,

        supported: true,

        data: {
            ...location,
            planning
        }

    });

};