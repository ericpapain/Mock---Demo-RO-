import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend,
} from "recharts";
import { Boxes, AlertTriangle, TrendingDown } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { components, generateStockHistory, helpers } from "@/data/supplyData";

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "JetBrains Mono, monospace",
  },
};

export default function Stocks() {
  const [selected, setSelected] = useState<string[]>([components[0].id, components[2].id, components[4].id]);

  const histories = useMemo(() => {
    return selected.map((id) => ({
      id,
      cmp: helpers.getComponent(id)!,
      data: generateStockHistory(id),
    }));
  }, [selected]);

  // Combine into single dataset by date
  const combined = useMemo(() => {
    const map = new Map<string, any>();
    histories.forEach(({ id, data }) => {
      data.forEach((p) => {
        const cur = map.get(p.date) ?? { date: p.date };
        cur[id] = p.stock;
        cur[`${id}_min`] = p.min;
        cur[`${id}_target`] = p.target;
        map.set(p.date, cur);
      });
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [histories]);

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--neon-magenta))", "hsl(var(--neon-lime))", "hsl(var(--neon-violet))"];

  const toggle = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 5 ? [...s, id] : s);
  };

  // Heatmap couverture (jours de stock restants par composant)
  const coverage = useMemo(() =>
    components.map((c) => {
      const dailyConsumption = 8 + Math.random() * 10;
      const days = Math.floor(c.currentStock / dailyConsumption);
      return { id: c.id, name: c.name, days, status: days < 7 ? "critical" : days < 14 ? "warning" : "ok" };
    }), []);

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stocks dans le temps</h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Historique 30j + Projection 30j · Seuils min/cible · Heatmap de couverture
        </p>
      </div>

      {/* KPIs stocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiSmall icon={Boxes} label="Composants suivis" value={components.length} tone="primary" />
        <KpiSmall icon={AlertTriangle} label="Sous seuil min" value={components.filter((c) => c.currentStock < c.stockMin).length} tone="destructive" />
        <KpiSmall icon={TrendingDown} label="Couverture < 7j" value={coverage.filter((c) => c.days < 7).length} tone="warning" />
        <KpiSmall icon={Boxes} label="Valeur stock" value={`${(components.reduce((s, c) => s + c.currentStock * c.unitCost, 0) / 1000).toFixed(0)}k€`} tone="success" />
      </div>

      {/* Selector */}
      <Panel title="Composants à comparer" subtitle="5 max simultanés">
        <div className="flex flex-wrap gap-1.5">
          {components.map((c) => {
            const active = selected.includes(c.id);
            const idx = selected.indexOf(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40"
                }`}>
                {active && <span className="w-2 h-2 rounded-full" style={{ background: colors[idx % colors.length] }} />}
                {c.id}
              </button>
            );
          })}
        </div>
      </Panel>

      {/* Main chart */}
      <Panel title="Évolution & projection" subtitle="Ligne pointillée = prévision · Zone rouge = sous seuil min">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={combined}>
            <defs>
              {selected.map((id, i) => (
                <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(d) => d.slice(5)} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <Tooltip {...tooltipStyle} />
            <ReferenceLine x={"2026-04-17"} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ value: "Aujourd'hui", fill: "hsl(var(--primary))", fontSize: 10 }} />
            {selected.map((id, i) => (
              <Area key={id} type="monotone" dataKey={id} stroke={colors[i % colors.length]} strokeWidth={2}
                fill={`url(#grad-${id})`} name={helpers.getComponent(id)?.name} />
            ))}
            {selected.map((id, i) => (
              <Line key={`min-${id}`} type="monotone" dataKey={`${id}_min`} stroke={colors[i % colors.length]} strokeDasharray="2 4" dot={false} strokeOpacity={0.5} legendType="none" />
            ))}
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Panel>

      {/* Heatmap coverage */}
      <Panel title="Heatmap de couverture" subtitle="Jours de stock restants au rythme de consommation actuel">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {coverage.map((c, i) => {
            const cmp = helpers.getComponent(c.id)!;
            const max = 30;
            const pct = Math.min(100, (c.days / max) * 100);
            const color = c.status === "critical" ? "hsl(var(--destructive))" : c.status === "warning" ? "hsl(var(--warning))" : "hsl(var(--success))";
            return (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="p-3 rounded-md bg-muted/30 border border-border hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-primary">{c.id}</span>
                  <StatusBadge tone={c.status === "critical" ? "danger" : c.status === "warning" ? "warning" : "success"}>
                    {c.days}j
                  </StatusBadge>
                </div>
                <div className="text-xs font-medium truncate mb-2">{cmp.name}</div>
                <div className="h-2 rounded-full bg-background overflow-hidden border border-border">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.02 }}
                    className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1.5 flex justify-between">
                  <span>{cmp.currentStock} u</span>
                  <span>seuil {cmp.stockMin}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function KpiSmall({ icon: Icon, label, value, tone }: { icon: any; label: string; value: any; tone: string }) {
  const c = tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="kpi-card">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${c}`} />
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className={`text-2xl font-mono font-bold tabular-nums ${c}`}>{value}</div>
    </div>
  );
}
