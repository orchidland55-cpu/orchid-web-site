import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import keyBg from "@/assets/cleeorchid.png";

type Message = {
  from: "user" | "bot";
  text: string;
};

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
      const res = await fetch("http://localhost:5006/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: messageText }),
      });

      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

      const data = await res.json();

      if (data && data.length > 0) {
        const botReply = data[0].text || "Désolé, je n'ai pas compris.";
        setMessages(prev => [...prev, { from: "bot", text: botReply }]);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "Aucune réponse du bot." }]);
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Erreur serveur ou CORS. Vérifiez la console." }]);
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
            bottom: "160px",
            right: "20px",
            width: "260px",
            height: "280px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {/* Header avec menu */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              borderBottom: "1px solid #eee",
              backgroundColor: "#f8f9fa",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#082648" }}>
              Orchid Island
            </span>
            <button
              className="chat-menu"
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#666",
              }}
              aria-label="Menu"
            >
              ⋮
            </button>
          </div>

          {/* Menu déroulant */}
          {showMenu && (
            <div
              className="chat-menu"
              style={{
                position: "absolute",
                top: "45px",
                right: "10px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                zIndex: 10000,
                minWidth: "150px",
              }}
            >
              <button
                onClick={startNewChat}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🆕 Start a new chat
              </button>
              <button
                onClick={endChat}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ❌ End chat
              </button>
              <button
                onClick={viewRecentChats}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📋 View recent chats
              </button>
            </div>
          )}

          {/* Zone messages */}
          <div
            style={{
              flex: 1,
              padding: "8px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "#888", fontSize: "12px", textAlign: "center", marginTop: "20px" }}>
                Démarrez la conversation 👋
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: m.from === "user" ? "right" : "left",
                      margin: "4px 0",
                      fontSize: "13px",
                      lineHeight: "1.4",
                      position: "relative",
                    }}
                  >
                    <div
                      className="message-bubble"
                      style={{
                        display: "inline-block",
                        background: m.from === "user" ? "#dcf8c6" : "#ffffff",
                        padding: "6px 10px",
                        borderRadius: "12px",
                        border: m.from === "bot" ? "1px solid #e0e0e0" : "none",
                        maxWidth: "85%",
                        wordBreak: "break-word",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <div style={{ flex: 1 }}>
                          <b style={{ fontSize: "11px", color: "#555" }}>
                            {m.from === "user" ? "Vous" : "Orchid Island"}
                          </b>
                          <br />
                          {m.text.split(/(\s+|\/[^\s]+)/).map((part, index) => {
                            if (part.startsWith('/')) {
                              return <a key={index} href={part} style={{ color: "#007bff", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">{part}</a>;
                            }
                            return part;
                          })}
                        </div>
                        {m.from === "bot" && (
                          <button
                            onClick={() => copyToClipboard(m.text)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                              borderRadius: "3px",
                              opacity: 0.7,
                              fontSize: "12px",
                            }}
                            title="Copier le message"
                            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
                          >
                            📋
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action buttons for bot messages - ChatGPT style */}
                    {m.from === "bot" && (
                      <div
                        className="message-actions"
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "10px",
                          display: "flex",
                          gap: "4px",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <button
                          onClick={() => copyToClipboard(m.text)}
                          style={{
                            background: "rgba(0, 0, 0, 0.5)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Copier"
                        >
                          📋
                        </button>

                        <button
                          onClick={() => handleFeedback(i, 'like')}
                          style={{
                            background: messageFeedback[i] === 'like' ? "#10a37f" : "rgba(0, 0, 0, 0.5)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Aimer"
                        >
                          👍
                        </button>

                        <button
                          onClick={() => handleFeedback(i, 'dislike')}
                          style={{
                            background: messageFeedback[i] === 'dislike' ? "#f44336" : "rgba(0, 0, 0, 0.5)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Ne pas aimer"
                        >
                          👎
                        </button>

                        <button
                          onClick={() => repeatResponse(i)}
                          style={{
                            background: "rgba(0, 0, 0, 0.5)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                  padding: "8px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                📋 Recent chats will be displayed here
                <br />
                <em>Feature coming soon...</em>
              </div>
            )}
          </div>

          {/* Input utilisateur */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd", background: "#fff" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Écrire un message..."
              style={{
                flex: 1,
                border: "none",
                padding: "8px 10px",
                fontSize: "14px",
                outline: "none",
              }}
              aria-label="Saisir un message"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              style={{
                padding: "8px 12px",
                background: input.trim() ? "#082648" : "#ccc",
                color: "#fff",
                border: "none",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              aria-label="Envoyer le message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;