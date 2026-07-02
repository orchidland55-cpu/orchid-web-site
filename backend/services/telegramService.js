const axios = require("axios");

const sendTelegramNotification = async (message) => {
    try {

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        await axios.post(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            }
        );

        console.log("✅ Telegram notification sent");

    } catch (err) {

        console.error(
            "❌ Telegram Error:",
            err.response?.data || err.message
        );
    }
};

module.exports = {
    sendTelegramNotification
};