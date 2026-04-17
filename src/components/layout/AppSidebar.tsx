import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Network, ClipboardList, GitFork, CalendarRange, LineChart, Settings, Cpu,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const modules = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, badge: "live" },
  { title: "Vue Chaîne", url: "/chaine", icon: Network },
  { title: "Carnet Commandes", url: "/commandes", icon: ClipboardList, badge: "32" },
  { title: "BOM Produits", url: "/bom", icon: GitFork },
  { title: "Planning Gantt", url: "/planning", icon: CalendarRange, badge: "!" },
  { title: "Stocks", url: "/stocks", icon: LineChart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-[0_0_16px_hsl(var(--primary)/0.4)]">
            <Cpu className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-foreground">SUPPLY<span className="text-primary">OR</span></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Operational Research</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] tracking-[0.2em]">MODULES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((m) => {
                const isActive = pathname === m.url;
                return (
                  <SidebarMenuItem key={m.url}>
                    <SidebarMenuButton asChild tooltip={m.title}>
                      <NavLink
                        to={m.url}
                        end
                        className={`group relative ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"}`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r shadow-[0_0_8px_hsl(var(--primary))]" />
                        )}
                        <m.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                        {!collapsed && (
                          <>
                            <span className="text-sm">{m.title}</span>
                            {m.badge && (
                              <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                m.badge === "!"
                                  ? "bg-destructive/20 text-destructive"
                                  : m.badge === "live"
                                  ? "bg-success/20 text-success"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {m.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Paramètres">
              <Settings className="w-4 h-4" />
              {!collapsed && <span className="text-sm">Paramètres</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="px-2 py-2 text-[10px] font-mono text-muted-foreground/60 border-t border-sidebar-border/50 mt-1">
            v1.0.0 · OR-Engine ACTIVE
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
