import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "green"
  | "primary"
  | "sage";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-xs font-semibold",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    danger: "bg-rose-50 text-rose-800 border border-rose-200",
    info: "bg-sky-50 text-sky-800 border border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    green: "bg-primary-50 text-primary-800 border border-primary-200",
    primary: "bg-primary-50 text-primary-800 border border-primary-200",
    sage: "bg-sage-100 text-sage-800 border border-sage-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const s = status.toLowerCase();

  if (s === "confirmed" || s === "active" || s === "doctor_approved" || s === "completed") {
    return (
      <Badge variant="success" size={size}>
        ● {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    );
  }

  if (s === "requested" || s === "awaiting_confirmation" || s === "under_review" || s === "submitted") {
    return (
      <Badge variant="warning" size={size}>
        ◌ {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    );
  }

  if (s === "cancelled" || s === "critical" || s === "high" || s === "urgent") {
    return (
      <Badge variant="danger" size={size}>
        ▲ {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    );
  }

  if (s === "doctor_shared" || s === "in_progress") {
    return (
      <Badge variant="green" size={size}>
        ★ {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    );
  }

  if (s === "superseded" || s === "uncertain") {
    return (
      <Badge variant="neutral" size={size}>
        {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    );
  }

  return (
    <Badge variant="neutral" size={size}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
