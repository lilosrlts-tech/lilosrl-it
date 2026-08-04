"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible || !message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-green-200 bg-green-600 px-4 py-3 text-sm text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      <span className="text-lg" aria-hidden="true">
        ✓
      </span>
      <div className="flex-1">
        <p className="font-semibold">Salvato con successo</p>
        <p className="mt-0.5 text-green-100">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="opacity-80 hover:opacity-100"
        aria-label="Chiudi notifica"
      >
        ✕
      </button>
    </div>
  );
}
