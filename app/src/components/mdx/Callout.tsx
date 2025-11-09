import { AlertCircle, Info, CheckCircle } from "lucide-react";

interface CalloutProps {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}

export function Callout({ type = "info", children }: CalloutProps) {
  const styles = {
    info: {
      container: "bg-blue-950/30 border-blue-800/50",
      icon: "text-blue-400",
      IconComponent: Info,
    },
    warning: {
      container: "bg-yellow-950/30 border-yellow-800/50",
      icon: "text-yellow-400",
      IconComponent: AlertCircle,
    },
    success: {
      container: "bg-green-950/30 border-green-800/50",
      icon: "text-green-400",
      IconComponent: CheckCircle,
    },
  };

  const { container, icon, IconComponent } = styles[type];

  return (
    <div
      className={`my-6 flex gap-3 rounded-lg border p-4 ${container}`}
      role="alert"
    >
      <IconComponent className={`h-5 w-5 flex-shrink-0 ${icon}`} />
      <div className="flex-1 text-sm leading-relaxed text-zinc-300">
        {children}
      </div>
    </div>
  );
}
