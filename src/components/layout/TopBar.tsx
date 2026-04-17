import { Bell, Search, Activity, Wifi } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

export function TopBar() {
  const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return (
    <header className="h-14 flex items-center gap-3 border-b border-border bg-card/50 backdrop-blur-md px-3 sticky top-0 z-30">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 border border-border">
        <span className="status-dot bg-success" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">OR-Engine</span>
        <span className="text-[10px] font-mono text-success">OPTIMAL</span>
      </div>

      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher commande, composant, fournisseur…"
            className="pl-8 h-9 bg-muted/30 border-border font-mono text-xs"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">⌘K</kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <Activity className="w-3 h-3 text-primary" />
          <span>CPU 42%</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <Wifi className="w-3 h-3 text-success" />
          <span>SYNC</span>
        </div>
        <div className="text-xs font-mono text-foreground tabular-nums">{now}</div>
        <button className="relative w-9 h-9 rounded-md hover:bg-muted/50 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_hsl(var(--accent))]" />
        </button>
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary/30 to-accent/30 border border-border flex items-center justify-center text-xs font-mono font-semibold text-foreground">
          SC
        </div>
      </div>
    </header>
  );
}
