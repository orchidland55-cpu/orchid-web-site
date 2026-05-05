import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5" style={{ color: "#0F6E56" }} />,
      iconBg: "#E1F5EE",
      borderColor: "#1D9E75",
    },
    error: {
      icon: <XCircle className="w-5 h-5" style={{ color: "#A32D2D" }} />,
      iconBg: "#FCEBEB",
      borderColor: "#E24B4A",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" style={{ color: "#854F0B" }} />,
      iconBg: "#FAEEDA",
      borderColor: "#EF9F27",
    },
    info: {
      icon: <Info className="w-5 h-5" style={{ color: "#185FA5" }} />,
      iconBg: "#E6F1FB",
      borderColor: "#378ADD",
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex items-start gap-3 w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-xl pointer-events-auto"
      style={{
        borderTop: "0.5px solid rgba(0,0,0,0.08)",
        borderRight: "0.5px solid rgba(0,0,0,0.08)",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        borderLeft: `4px solid ${config.borderColor}`,
      }}
    >
      {/* Icône */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
        style={{ backgroundColor: config.iconBg }}
      >
        {config.icon}
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        {message && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
