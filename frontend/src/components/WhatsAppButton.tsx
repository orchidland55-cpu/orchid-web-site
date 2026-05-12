import React from "react";

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "212661868888"; 
  const message = "Bonjour ! Je suis intéressé par vos services immobiliers. Pouvez-vous m'aider ?";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px", // 🔽 WhatsApp reste en bas
        right: "20px",
        width: "60px",
        height: "60px",
        backgroundColor: "#ccac36", // ✅ couleur inchangée
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 9999,
      }}
      aria-label="Contactez-nous sur WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 32 32"
        width="32"
        height="32"
      >
        <path d="M16.001 2.984c-7.326 0-13.29 5.964-13.29 13.29 0 2.347.613 4.646 1.78 6.666l-1.89 6.896 7.07-1.857c1.96 1.067 4.172 1.629 6.33 1.629h.001c7.327 0 13.29-5.963 13.29-13.29s-5.963-13.334-13.29-13.334zm7.905 18.823c-.334.941-1.943 1.796-2.672 1.91-.706.11-1.59.156-2.57-.16-.593-.188-1.355-.44-2.346-.857-4.134-1.79-6.805-5.956-7.01-6.239-.206-.283-1.674-2.225-1.674-4.247 0-2.022 1.059-3.012 1.436-3.431.377-.418.82-.523 1.094-.523.275 0 .548.003.79.015.253.012.592-.095.926.707.334.802 1.13 2.765 1.231 2.963.101.197.168.423.034.685-.134.263-.201.423-.397.648-.197.226-.418.504-.595.677-.197.197-.402.412-.173.811.229.399 1.017 1.677 2.184 2.716 1.501 1.338 2.769 1.759 3.168 1.956.399.197.629.165.863-.1.234-.266.996-1.154 1.263-1.55.266-.397.529-.334.893-.197.364.137 2.311 1.091 2.707 1.29.397.199.662.296.762.463.099.168.099.97-.235 1.911z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;