import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: number; // % vs previous
  icon: LucideIcon;
  tone?: "default" | "primary" | "accent" | "success" | "warning" | "destructive";
  sparkline?: number[];
  description?: string;
};

const toneColor: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export function KpiCard({ label, value, unit, delta, icon: Icon, tone = "default", sparkline, description }: Props) {
  const isUp = delta !== undefined && delta > 0;
  const isDown = delta !== undefined && delta < 0;
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center bg-muted/40 border border-border", toneColor[tone])}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
        </div>
        {delta !== undefined && (
          <div className={cn("flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded",
            isUp ? "bg-success/15 text-success" : isDown ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground")}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(delta).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-mono font-bold tabular-nums", toneColor[tone])}>{value}</span>
        {unit && <span className="text-xs font-mono text-muted-foreground">{unit}</span>}
      </div>
      {description && <p className="text-[11px] text-muted-foreground mt-1">{description}</p>}
      {sparkline && sparkline.length > 0 && (
        <svg viewBox="0 0 100 24" className="mt-2 w-full h-6" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={toneColor[tone]}
            points={sparkline.map((v, i) => {
              const x = (i / (sparkline.length - 1)) * 100;
              const min = Math.min(...sparkline);
              const max = Math.max(...sparkline);
              const y = 22 - ((v - min) / Math.max(1, max - min)) * 20;
              return `${x},${y}`;
            }).join(" ")}
          />
        </svg>
      )}
    </div>
  );
}
