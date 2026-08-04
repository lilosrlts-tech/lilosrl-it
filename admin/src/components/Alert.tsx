"use client";

type AlertVariant = "error" | "success" | "info";

const styles: Record<AlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

interface AlertProps {
  variant?: AlertVariant;
  message: string;
  onDismiss?: () => void;
}

export function Alert({ variant = "info", message, onDismiss }: AlertProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}
      role="alert"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 font-medium opacity-70 hover:opacity-100"
          aria-label="Chiudi"
        >
          ✕
        </button>
      )}
    </div>
  );
}
