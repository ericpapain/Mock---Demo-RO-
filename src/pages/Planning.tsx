import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Truck, RefreshCw, Check, X } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobs as initialJobs, components as initialComponents, productionLines, helpers } from "@/data/supplyData";
import { toast } from "sonner";

const today = new Date("2026-04-17");

export default function Planning() {
  const [jobs, setJobs] = useState(initialJobs);
  const [comps, setComps] = useState(initialComponents);
  const [editingDelivery, setEditingDelivery] = useState<{ cmpId: string; idx: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [savings, setSavings] = useState<{ delta: number; cost: number } | null>(null);

  const range = useMemo(() => {
    const dates = jobs.flatMap((j) => [j.startDate, j.endDate]);
    const sorted = dates.sort();
    const start = new Date(sorted[0] || today);
    const end = new Date(sorted[sorted.length - 1] || today);
    start.setDate(start.getDate() - 2);
    end.setDate(end.getDate() + 2);
    const days: string[] = [];
    const cur = new Date(start);
    while (cur <= end) { days.push(cur.toISOString().slice(0, 10)); cur.setDate(cur.getDate() + 1); }
    return { start, end, days };
  }, [jobs]);

  const dayWidth = 36;
  const rowHeight = 44;

  const reoptimize = () => {
    setOptimizing(true);
    setSavings(null);
    setTimeout(() => {
      // Mock reorder: shuffle start dates slightly + improve progress
      const newJobs = jobs.map((j, i) => {
        if (j.status === "done") return j;
        const shift = Math.floor((Math.random() - 0.5) * 3);
        const newStart = new Date(j.startDate);
        newStart.setDate(newStart.getDate() + shift);
        const newEnd = new Date(j.endDate);
        newEnd.setDate(newEnd.getDate() + shift);
        return {
          ...j,
          startDate: newStart.toISOString().slice(0, 10),
          endDate: newEnd.toISOString().slice(0, 10),
          status: j.status === "blocked" && Math.random() > 0.4 ? "scheduled" as const : j.status,
          blockedBy: j.status === "blocked" && Math.random() > 0.4 ? undefined : j.blockedBy,
        };
      });
      setJobs(newJobs);
      setOptimizing(false);
      const delta = +(Math.random() * 8 + 2).toFixed(1);
      const cost = Math.floor(Math.random() * 15000) + 5000;
      setSavings({ delta, cost });
      toast.success(`Optimisation terminée — ${delta}h gagnées · ${cost.toLocaleString()}€ économisés`);
    }, 1800);
  };

  const startEditing = (cmpId: string, idx: number, current: string) => {
    setEditingDelivery({ cmpId, idx });
    setEditValue(current);
  };

  const saveEdit = () => {
    if (!editingDelivery) return;
    setComps((cs) => cs.map((c) => {
      if (c.id !== editingDelivery.cmpId) return c;
      const newDel = [...c.pendingDeliveries];
      newDel[editingDelivery.idx] = { ...newDel[editingDelivery.idx], date: editValue };
      return { ...c, pendingDeliveries: newDel };
    }));
    setEditingDelivery(null);
    toast.info(`Livraison déplacée — relancez l'optimisation`);
  };

  const dayIndex = (d: string) => range.days.indexOf(d);

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Planning & Ré-optimisation
            <StatusBadge tone="primary" pulse>OR-ENGINE</StatusBadge>
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Gantt {jobs.length} jobs · Modifiez les livraisons puis relancez l'ordonnancement
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savings && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-success/15 border border-success/30 text-success text-xs font-mono">
              <Check className="w-3.5 h-3.5" />
              -{savings.delta}h · -{savings.cost.toLocaleString()}€
            </motion.div>
          )}
          <Button onClick={reoptimize} disabled={optimizing} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {optimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {optimizing ? "Optimisation…" : "Ré-optimiser"}
          </Button>
        </div>
      </div>

      {/* Editable deliveries */}
      <Panel title="Livraisons composants à venir" subtitle="Modifiez une date pour simuler un changement">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {comps.flatMap((c) =>
            c.pendingDeliveries.map((d, idx) => {
              const isEditing = editingDelivery?.cmpId === c.id && editingDelivery.idx === idx;
              return (
                <div key={`${c.id}-${idx}`} className="flex items-center gap-2 p-2.5 rounded-md bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                  <div className="w-8 h-8 rounded bg-info/15 text-info flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-primary">{c.id}</div>
                    <div className="text-xs font-medium truncate">{c.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">+{d.quantity} u</div>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input type="date" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                        className="h-7 w-32 text-[10px] font-mono" />
                      <button onClick={saveEdit} className="w-6 h-6 rounded bg-success/20 text-success flex items-center justify-center hover:bg-success/30">
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={() => setEditingDelivery(null)} className="w-6 h-6 rounded bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEditing(c.id, idx, d.date)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-background border border-border hover:border-primary/40">
                      📅 {d.date.slice(5)}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Panel>

      {/* Gantt */}
      <Panel title="Diagramme de Gantt" subtitle={`${range.days.length} jours · ${productionLines.length} lignes`}>
        <div className="relative overflow-x-auto">
          <div style={{ minWidth: range.days.length * dayWidth + 200 }}>
            {/* Header */}
            <div className="flex sticky top-0 z-10 bg-card">
              <div className="w-[200px] shrink-0 border-r border-border" />
              {range.days.map((d) => {
                const isToday = d === today.toISOString().slice(0, 10);
                const isWeekend = [0, 6].includes(new Date(d).getDay());
                return (
                  <div key={d} style={{ width: dayWidth }}
                    className={`text-center text-[9px] font-mono py-1 border-r border-border ${
                      isToday ? "text-primary font-bold" : isWeekend ? "text-muted-foreground/40" : "text-muted-foreground"
                    }`}>
                    {d.slice(8)}
                    <div className="text-[8px]">{d.slice(5, 7)}</div>
                  </div>
                );
              })}
            </div>

            {/* Lines & jobs */}
            {productionLines.map((line) => {
              const lineJobs = jobs.filter((j) => j.productionLine === line.id);
              return (
                <div key={line.id} className="border-t border-border" style={{ minHeight: Math.max(rowHeight, lineJobs.length * (rowHeight + 4) + 8) }}>
                  <div className="flex">
                    <div className="w-[200px] shrink-0 p-2 border-r border-border bg-muted/20">
                      <div className="text-xs font-semibold">{line.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{line.capacityHoursPerDay}h/j · η={Math.round(line.efficiency*100)}%</div>
                    </div>
                    <div className="relative flex-1" style={{ height: Math.max(rowHeight, lineJobs.length * (rowHeight + 4) + 8) }}>
                      {/* Background grid */}
                      <div className="absolute inset-0 flex">
                        {range.days.map((d, i) => {
                          const isToday = d === today.toISOString().slice(0, 10);
                          const isWeekend = [0, 6].includes(new Date(d).getDay());
                          return (
                            <div key={i} style={{ width: dayWidth }}
                              className={`border-r border-border/50 ${isWeekend ? "bg-muted/20" : ""} ${isToday ? "bg-primary/5" : ""}`}>
                              {isToday && <div className="absolute top-0 bottom-0 w-px bg-primary/60 shadow-[0_0_8px_hsl(var(--primary))]" style={{ left: i * dayWidth + dayWidth/2 }} />}
                            </div>
                          );
                        })}
                      </div>
                      {/* Job bars */}
                      <AnimatePresence>
                        {lineJobs.map((j, idx) => {
                          const startIdx = dayIndex(j.startDate);
                          const endIdx = dayIndex(j.endDate);
                          if (startIdx < 0 || endIdx < 0) return null;
                          const left = startIdx * dayWidth;
                          const width = Math.max(dayWidth, (endIdx - startIdx + 1) * dayWidth - 4);
                          const product = helpers.getProduct(j.productId);
                          const tone = j.status === "blocked" ? "destructive" : j.status === "running" ? "primary" : j.status === "done" ? "success" : "info";
                          const bg = tone === "destructive" ? "from-destructive/40 to-destructive/20 border-destructive" :
                                     tone === "primary" ? "from-primary/40 to-primary/20 border-primary" :
                                     tone === "success" ? "from-success/40 to-success/20 border-success" :
                                     "from-info/40 to-info/20 border-info";
                          return (
                            <motion.div key={j.id}
                              layout
                              initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 25 }}
                              style={{ left, width, top: 4 + idx * (rowHeight + 4), height: rowHeight }}
                              className={`absolute rounded-md border bg-gradient-to-r ${bg} px-2 py-1 group hover:z-10 cursor-pointer overflow-hidden`}>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                                <span className="text-foreground font-semibold">{j.id}</span>
                                {j.status === "blocked" && <span className="text-destructive">⛔</span>}
                              </div>
                              <div className="text-[10px] truncate text-foreground/80">{product?.name} ×{j.quantity}</div>
                              {j.progress > 0 && (
                                <div className="absolute bottom-0 left-0 h-0.5 bg-foreground/60" style={{ width: `${j.progress}%` }} />
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optimizing overlay */}
          <AnimatePresence>
            {optimizing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <div className="text-sm font-mono text-primary">OR-Engine en cours…</div>
                  <div className="text-[10px] font-mono text-muted-foreground">Résolution MILP · Branch & Bound</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          <StatusBadge tone="info">Planifié</StatusBadge>
          <StatusBadge tone="primary">En cours</StatusBadge>
          <StatusBadge tone="success">Terminé</StatusBadge>
          <StatusBadge tone="danger">Bloqué</StatusBadge>
        </div>
      </Panel>
    </div>
  );
}
