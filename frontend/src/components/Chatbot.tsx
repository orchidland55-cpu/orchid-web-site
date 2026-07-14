import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import keyBg from "@/assets/cleeorchid.png";

type Message = {
  from: "user" | "bot";
  text: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Identifiant stable par visiteur, pour que l'historique de conversation et
// la limite de débit distinguent chaque visiteur au lieu de tous partager
// la même session.
function getSessionId(): string {
  const key = "orchid_chat_session_id";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState<{[key: number]: 'like' | 'dislike' | null}>({});

  const messagesEndRef = useRef<HTMLDivElement>(null); // ✅ Référence pour scroll

  // ✅ Scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.chat-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    if (!text) {
      const userMessage: Message = { from: "user", text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, session_id: getSessionId() }),
      });

      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

      const data = await res.json();
      const botReply = data.reply || "Désolé, je n'ai pas compris.";
      setMessages(prev => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Erreur serveur. Réessayez dans un instant." }]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setShowMenu(false);
  };

  const endChat = () => {
    setIsOpen(false);
    setShowMenu(false);
  };

  const viewRecentChats = () => {
    setShowRecentChats(!showRecentChats);
    setShowMenu(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFeedback = (messageIndex: number, feedback: 'like' | 'dislike') => {
    setMessageFeedback(prev => ({
      ...prev,
      [messageIndex]: feedback
    }));
  };

  const repeatResponse = async (userMessageIndex: number) => {
    // Find the user message that triggered this bot response
    const userMessage = messages
      .slice(0, userMessageIndex)
      .filter(m => m.from === 'user')
      .pop();

    if (userMessage) {
      await sendMessage(userMessage.text);
    }
  };

  const floatingButtonStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    position: "fixed",
    right: "20px",
    bottom: "95px",
    zIndex: 9999,
    border: "none",
    fontSize: "24px",
    backgroundColor: "#082648",
    backgroundImage: `url(${keyBg})`,
    backgroundSize: "70%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <>
      <style>
        {`
          .message-bubble:hover .message-actions {
            opacity: 1 !important;
          }
        `}
      </style>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={floatingButtonStyle}
        title={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      />

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "170px",
            right: "20px",
            width: "380px",
            maxWidth: "92vw",
            height: "min(600px, 70vh)",
            background: "#fff",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 18px",
              borderBottom: "1px solid #eee",
              backgroundColor: "#fff",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#082648" }}>
              Orchid Island
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                className="chat-menu"
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#888",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                }}
                aria-label="Menu"
              >
                ⋯
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#888",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                }}
                aria-label="Fermer le chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menu déroulant */}
          {showMenu && (
            <div
              className="chat-menu"
              style={{
                position: "absolute",
                top: "56px",
                right: "14px",
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "10px",
                boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
                zIndex: 10000,
                minWidth: "170px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={startNewChat}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🆕 Nouvelle conversation
              </button>
              <button
                onClick={endChat}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ❌ Terminer
              </button>
              <button
                onClick={viewRecentChats}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📋 Conversations récentes
              </button>
            </div>
          )}

          {/* Zone messages */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "#fff",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  display: "inline-block",
                  background: "#f4f4f6",
                  color: "#222",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  maxWidth: "85%",
                }}
              >
                Bonjour ! Comment puis-je vous aider ?
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: m.from === "user" ? "right" : "left",
                      margin: "10px 0",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      position: "relative",
                    }}
                  >
                    <div
                      className="message-bubble"
                      style={{
                        display: "inline-block",
                        background: m.from === "user" ? "#082648" : "#f4f4f6",
                        color: m.from === "user" ? "#fff" : "#222",
                        padding: "10px 14px",
                        borderRadius: "16px",
                        maxWidth: "85%",
                        wordBreak: "break-word",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <div style={{ flex: 1 }}>
                          {m.text.split(/(\s+|\/[^\s]+)/).map((part, index) => {
                            if (part.startsWith('/')) {
                              return <a key={index} href={part} style={{ color: m.from === "user" ? "#cfe0ff" : "#007bff", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">{part}</a>;
                            }
                            return part;
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for bot messages - ChatGPT style */}
                    {m.from === "bot" && (
                      <div
                        className="message-actions"
                        style={{
                          display: "flex",
                          gap: "4px",
                          marginTop: "4px",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <button
                          onClick={() => copyToClipboard(m.text)}
                          style={{
                            background: "none",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: "#888",
                            fontSize: "12px",
                          }}
                          title="Copier"
                        >
                          📋
                        </button>

                        <button
                          onClick={() => handleFeedback(i, 'like')}
                          style={{
                            background: "none",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: messageFeedback[i] === 'like' ? "#10a37f" : "#888",
                            fontSize: "12px",
                          }}
                          title="Aimer"
                        >
                          👍
                        </button>

                        <button
                          onClick={() => handleFeedback(i, 'dislike')}
                          style={{
                            background: "none",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: messageFeedback[i] === 'dislike' ? "#f44336" : "#888",
                            fontSize: "12px",
                          }}
                          title="Ne pas aimer"
                        >
                          👎
                        </button>

                        <button
                          onClick={() => repeatResponse(i)}
                          style={{
                            background: "none",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: "#888",
                            fontSize: "12px",
                          }}
                          title="Régénérer"
                        >
                          🔄
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {/* 👇 Anchor invisible pour le scroll */}
                <div ref={messagesEndRef} />
              </>
            )}

            {/* Recent chats placeholder */}
            {showRecentChats && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#f4f4f6",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                📋 L'historique des conversations s'affichera ici
                <br />
                <em>Bientôt disponible...</em>
              </div>
            )}
          </div>

          {/* Input utilisateur */}
          <div style={{ padding: "12px 16px 8px", background: "#fff" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f4f4f6",
                borderRadius: "999px",
                padding: "6px 6px 6px 16px",
                gap: "8px",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Écrire un message..."
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  padding: "8px 0",
                  fontSize: "14px",
                  outline: "none",
                }}
                aria-label="Saisir un message"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: input.trim() ? "#082648" : "#ccc",
                  color: "#fff",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-label="Envoyer le message"
              >
                ➤
              </button>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "#aaa",
                marginTop: "8px",
              }}
            >
              Propulsé par Orchid Island
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;