import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, subtitle, actions, children, className }: Props) {
  return (
    <div className={cn("panel animate-fade-in", className)}>
      <div className="panel-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          {subtitle && <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
