import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { MoreHorizontal, X, SquarePen, History, ArrowUp, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import keyBg from "@/assets/cleeorchid.png";

type Message = {
  from: "user" | "bot";
  text: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Identifiant stable par visiteur, pour que l'historique de conversation et
// la limite de débit distinguent chaque visiteur au lieu de tous partager
// la même session.
// Convertit les liens markdown [texte](url) et les URLs brutes (http(s)://...)
// en vrais liens cliquables ; le reste du texte est affiché tel quel.
function renderMessageText(text: string, linkColor: string): React.ReactNode[] {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const label = match[1] ?? match[3];
    const url = match[2] ?? match[3];
    nodes.push(
      <a key={key++} href={url} style={{ color: linkColor, textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

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
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null); // ✅ Référence pour scroll

  // ✅ Scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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

    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, session_id: getSessionId() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Le backend renvoie un message utile (avec les coordonnées d'Orchid
        // Island) pour les cas prévus (limite de débit, panne temporaire).
        const fallback = data?.error || "⚠️ Erreur serveur. Réessayez dans un instant.";
        setMessages(prev => [...prev, { from: "bot", text: fallback }]);
        return;
      }

      const botReply = data?.reply || "Désolé, je n'ai pas compris.";
      setMessages(prev => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Erreur serveur. Réessayez dans un instant." }]);
    } finally {
      setIsTyping(false);
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
    left: "20px",
    bottom: "20px",
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
          @keyframes typing-dot-bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-4px); opacity: 1; }
          }
          .typing-dot {
            animation: typing-dot-bounce 1.2s infinite ease-in-out;
          }
          .typing-dot:nth-child(2) { animation-delay: 0.15s; }
          .typing-dot:nth-child(3) { animation-delay: 0.3s; }
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
            bottom: "95px",
            left: "20px",
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
                  cursor: "pointer",
                  color: "#888",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Menu"
              >
                <MoreHorizontal size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Fermer le chat"
              >
                <X size={18} />
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#222",
                }}
              >
                <SquarePen size={16} color="#082648" />
                Nouvelle conversation
              </button>
              <button
                onClick={endChat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#222",
                }}
              >
                <X size={16} color="#e11d48" />
                Terminer
              </button>
              <button
                onClick={viewRecentChats}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#222",
                }}
              >
                <History size={16} color="#555" />
                Conversations récentes
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
                        <div style={{ flex: 1, whiteSpace: "pre-wrap" }}>
                          {renderMessageText(m.text, m.from === "user" ? "#cfe0ff" : "#007bff")}
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
                            display: "flex",
                          }}
                          title="Copier"
                        >
                          <Copy size={14} />
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
                            display: "flex",
                          }}
                          title="Aimer"
                        >
                          <ThumbsUp size={14} />
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
                            display: "flex",
                          }}
                          title="Ne pas aimer"
                        >
                          <ThumbsDown size={14} />
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
                            display: "flex",
                          }}
                          title="Régénérer"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ textAlign: "left", margin: "10px 0" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "4px",
                        background: "#f4f4f6",
                        padding: "12px 16px",
                        borderRadius: "16px",
                      }}
                    >
                      <span className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#999", display: "inline-block" }} />
                      <span className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#999", display: "inline-block" }} />
                      <span className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#999", display: "inline-block" }} />
                    </div>
                  </div>
                )}
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
                <ArrowUp size={16} />
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