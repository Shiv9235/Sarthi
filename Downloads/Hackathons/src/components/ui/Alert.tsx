import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export type AlertType = "info" | "warning" | "error" | "success";

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Alert({
  type = "info",
  title,
  children,
  className = "",
  action,
}: AlertProps) {
  const styles = {
    info: {
      wrapper: "bg-sky-50/80 border-sky-200 text-sky-900",
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
      titleColor: "text-sky-950",
    },
    warning: {
      wrapper: "bg-amber-50/80 border-amber-200 text-amber-900",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      titleColor: "text-amber-950",
    },
    error: {
      wrapper: "bg-rose-50/90 border-rose-300 text-rose-900",
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      titleColor: "text-rose-950",
    },
    success: {
      wrapper: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      titleColor: "text-emerald-950",
    },
  };

  const current = styles[type];

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 flex gap-3 text-sm leading-relaxed ${current.wrapper} ${className}`}
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 ${current.titleColor}`}>{title}</h4>
        )}
        <div className="text-slate-700">{children}</div>
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
