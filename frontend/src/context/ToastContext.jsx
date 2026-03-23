import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const bg = { success: "#0F6E56", error: "#A32D2D", warning: "#854F0B", info: "#185FA5" };
  const icon = { success: "✓", error: "✕", warning: "⚠", info: "i" };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: "#fff", background: bg[t.type] ?? bg.success,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              animation: "toastIn .22s ease", maxWidth: 340, minWidth: 180,
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.9 }}>{icon[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
