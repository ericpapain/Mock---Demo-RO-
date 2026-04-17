import { cn } from "@/lib/utils";

const toneMap = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  primary: "bg-primary/15 text-primary border-primary/30",
  muted: "bg-muted text-muted-foreground border-border",
} as const;

type Props = { tone?: keyof typeof toneMap; className?: string; pulse?: boolean; children: React.ReactNode };

export function StatusBadge({ tone = "muted", className, pulse, children }: Props) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider border",
      toneMap[tone], className,
    )}>
      {pulse && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", `bg-current`)} />}
      {children}
    </span>
  );
}
