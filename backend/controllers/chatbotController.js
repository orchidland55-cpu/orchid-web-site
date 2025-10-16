const axios = require("axios");

const sendMessageToChatbot = async (req, res) => {
  const { message } = req.body;

  try {
    // Envoyer le message au serveur Rasa
    const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
      sender: "user1",
      message: message
    });

    // Récupérer le texte du premier message reçu de Rasa
    const reply = response.data[0]?.text || "Désolé, je n'ai pas compris.";

    // Réponse simplifiée
    res.json({ reply });
  } catch (err) {
    console.error("Erreur chatbot:", err.message);
    res.status(500).json({ error: "Erreur de communication avec Rasa" });
  }
};

module.exports = { sendMessageToChatbot };
