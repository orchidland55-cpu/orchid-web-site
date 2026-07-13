const axios = require("axios");

// Relais vers le backend Chatbot-AI (FastAPI + RAG + DeepSeek).
// Remplace l'ancien appel direct à Rasa (rasa_chatbot/ reste en place,
// simplement plus appelé depuis ce contrôleur).
const sendMessageToChatbot = async (req, res) => {
  const { message, session_id } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message manquant ou invalide." });
  }

  const backendUrl = process.env.CHATBOT_AI_URL;
  const internalToken = process.env.CHATBOT_AI_TOKEN;

  if (!backendUrl) {
    console.error("CHATBOT_AI_URL non configuré.");
    return res.status(500).json({ error: "Chatbot indisponible pour le moment." });
  }

  try {
    const response = await axios.post(
      `${backendUrl}/chat`,
      {
        message,
        session_id: session_id || "anonymous",
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(internalToken ? { "X-Internal-Token": internalToken } : {}),
          // Transmet la vraie IP du visiteur (Express la connaît déjà via
          // 'trust proxy') pour que le rate limiting de Chatbot-AI s'applique
          // par visiteur, pas par notre propre serveur.
          "X-Forwarded-For": req.ip,
        },
        timeout: 15000,
      }
    );

    const reply = response.data?.reply || "Désolé, je n'ai pas compris.";
    res.json({ reply });
  } catch (err) {
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "Trop de messages envoyés, merci de patienter un instant.",
      });
    }
    console.error("Erreur chatbot:", err.message);
    res.status(502).json({ error: "Erreur de communication avec le chatbot." });
  }
};

module.exports = { sendMessageToChatbot };
