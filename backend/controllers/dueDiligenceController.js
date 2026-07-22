const gisService = require("../services/gisService");

exports.analyzeLocation = async (req, res) => {

    const { latitude, longitude } = req.body;

    const supported =
        gisService.isSupportedRegion(
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

    return res.json({

        success: true,

        supported: true,

        data: {

            commune: "Coming soon",

            province: "Marrakech",

            region: "Marrakech-Safi"

        }

    });

};