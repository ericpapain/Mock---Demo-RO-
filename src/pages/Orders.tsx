import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, LayoutGrid, List, ArrowUpDown, AlertCircle, Zap, Star } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { orders, products, helpers, type OrderStatus } from "@/data/supplyData";

const statusTone: Record<OrderStatus, "primary" | "info" | "success" | "danger" | "muted" | "warning"> = {
  draft: "muted", confirmed: "info", in_production: "primary", ready: "success", shipped: "success", late: "danger",
};
const statusLabel: Record<OrderStatus, string> = {
  draft: "Brouillon", confirmed: "Confirmée", in_production: "En production", ready: "Prête", shipped: "Expédiée", late: "En retard",
};
const priorityIcon = { low: "·", normal: "•", high: "▲", critical: "★" };

export default function Orders() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "value" | "quantity">("dueDate");

  const filtered = useMemo(() => {
    return orders
      .filter((o) => {
        const p = helpers.getProduct(o.productId);
        const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          p?.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || o.status === statusFilter;
        const matchPrio = priorityFilter === "all" || o.priority === priorityFilter;
        return matchSearch && matchStatus && matchPrio;
      })
      .sort((a, b) => {
        if (sortBy === "value") return b.quantity * b.unitPrice - a.quantity * a.unitPrice;
        if (sortBy === "quantity") return b.quantity - a.quantity;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [search, statusFilter, priorityFilter, sortBy]);

  const stats = useMemo(() => ({
    total: filtered.length,
    value: filtered.reduce((s, o) => s + o.quantity * o.unitPrice, 0),
    late: filtered.filter((o) => o.status === "late").length,
  }), [filtered]);

  const grouped = useMemo(() => {
    const groups: Record<OrderStatus, typeof orders> = {
      draft: [], confirmed: [], in_production: [], ready: [], shipped: [], late: [],
    };
    filtered.forEach((o) => groups[o.status].push(o));
    return groups;
  }, [filtered]);

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carnet de commandes</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {stats.total} commandes · {(stats.value / 1_000_000).toFixed(2)} M€ · <span className="text-destructive">{stats.late} en retard</span>
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-md bg-muted/40 border border-border">
          <Button size="sm" variant={view === "table" ? "default" : "ghost"} onClick={() => setView("table")} className="h-7 gap-1.5">
            <List className="w-3.5 h-3.5" /> Table
          </Button>
          <Button size="sm" variant={view === "kanban" ? "default" : "ghost"} onClick={() => setView("kanban")} className="h-7 gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Panel title="Filtres & recherche">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ID, client, produit…" className="pl-8 h-9 font-mono text-xs" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-9 px-3 rounded-md bg-input border border-border text-xs font-mono">
            <option value="all">Tous statuts</option>
            {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
                  className="h-9 px-3 rounded-md bg-input border border-border text-xs font-mono">
            <option value="all">Toutes priorités</option>
            <option value="critical">Critique ★</option>
            <option value="high">Haute ▲</option>
            <option value="normal">Normale</option>
            <option value="low">Basse</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 px-3 rounded-md bg-input border border-border text-xs font-mono">
            <option value="dueDate">Tri: échéance</option>
            <option value="value">Tri: valeur</option>
            <option value="quantity">Tri: quantité</option>
          </select>
        </div>
      </Panel>

      <AnimatePresence mode="wait">
        {view === "table" ? (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Panel title="Liste détaillée">
              <div className="overflow-x-auto -mx-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                      <th className="text-left py-2 px-3">ID</th>
                      <th className="text-left py-2 px-3">Client</th>
                      <th className="text-left py-2 px-3">Produit</th>
                      <th className="text-right py-2 px-3">Qté</th>
                      <th className="text-right py-2 px-3">Valeur</th>
                      <th className="text-left py-2 px-3">Échéance</th>
                      <th className="text-left py-2 px-3">Statut</th>
                      <th className="text-center py-2 px-3">Prio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o, i) => {
                      const p = helpers.getProduct(o.productId);
                      const value = o.quantity * o.unitPrice;
                      const due = new Date(o.dueDate);
                      const today = new Date("2026-04-17");
                      const daysLeft = Math.round((due.getTime() - today.getTime()) / 86400000);
                      return (
                        <motion.tr key={o.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-2 px-3 font-mono text-primary">{o.id}</td>
                          <td className="py-2 px-3">{o.customer}</td>
                          <td className="py-2 px-3 text-muted-foreground">{p?.name}</td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums">{o.quantity}</td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums">{(value/1000).toFixed(1)}k€</td>
                          <td className="py-2 px-3 font-mono">
                            {o.dueDate}
                            <span className={`ml-1 text-[10px] ${daysLeft < 0 ? "text-destructive" : daysLeft < 7 ? "text-warning" : "text-muted-foreground"}`}>
                              ({daysLeft >= 0 ? `+${daysLeft}` : daysLeft}j)
                            </span>
                          </td>
                          <td className="py-2 px-3"><StatusBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</StatusBadge></td>
                          <td className="py-2 px-3 text-center">
                            <span className={`text-base ${
                              o.priority === "critical" ? "text-destructive" :
                              o.priority === "high" ? "text-accent" :
                              o.priority === "normal" ? "text-muted-foreground" : "text-muted-foreground/40"
                            }`}>{priorityIcon[o.priority]}</span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </motion.div>
        ) : (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.keys(grouped) as OrderStatus[]).map((status) => (
              <div key={status} className="panel p-3 min-h-[200px]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                  <StatusBadge tone={statusTone[status]}>{statusLabel[status]}</StatusBadge>
                  <span className="text-[10px] font-mono text-muted-foreground">{grouped[status].length}</span>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {grouped[status].map((o) => {
                    const p = helpers.getProduct(o.productId);
                    return (
                      <motion.div key={o.id}
                        whileHover={{ y: -2 }}
                        className="p-2.5 rounded-md bg-muted/30 border border-border hover:border-primary/40 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-primary">{o.id}</span>
                          {o.priority === "critical" && <Star className="w-3 h-3 text-destructive fill-destructive" />}
                        </div>
                        <p className="text-xs font-medium truncate">{o.customer}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p?.name} ×{o.quantity}</p>
                        <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
                          <span className="text-muted-foreground">{o.dueDate.slice(5)}</span>
                          <span className="text-foreground">{((o.quantity * o.unitPrice)/1000).toFixed(0)}k€</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
