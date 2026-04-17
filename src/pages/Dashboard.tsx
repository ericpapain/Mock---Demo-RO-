import { useMemo } from "react";
import {
  Activity, Package, AlertTriangle, TrendingUp, Boxes, Factory, Truck, CheckCircle2, Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
} from "recharts";
import { KpiCard } from "@/components/shared/KpiCard";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { orders, components, jobs, suppliers, products, helpers } from "@/data/supplyData";

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "JetBrains Mono, monospace",
  },
  labelStyle: { color: "hsl(var(--muted-foreground))", fontSize: 10 },
};

export default function Dashboard() {
  const stats = useMemo(() => {
    const total = orders.length;
    const late = orders.filter((o) => o.status === "late").length;
    const inProd = orders.filter((o) => o.status === "in_production").length;
    const value = orders.reduce((s, o) => s + o.quantity * o.unitPrice, 0);
    const lowStock = components.filter((c) => c.currentStock < c.stockMin).length;
    const blocked = jobs.filter((j) => j.status === "blocked").length;
    const otd = Math.round(((total - late) / total) * 100);
    return { total, late, inProd, value, lowStock, blocked, otd };
  }, []);

  const ordersByDay = useMemo(() => {
    const map = new Map<string, { date: string; commandes: number; valeur: number }>();
    orders.forEach((o) => {
      const d = o.orderedAt;
      const cur = map.get(d) ?? { date: d, commandes: 0, valeur: 0 };
      cur.commandes += 1;
      cur.valeur += o.quantity * o.unitPrice;
      map.set(d, cur);
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, []);

  const familyData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const p = helpers.getProduct(o.productId);
      if (!p) return;
      map.set(p.family, (map.get(p.family) ?? 0) + o.quantity * o.unitPrice);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const reliabilityData = suppliers.map((s) => ({ name: s.name.split(" ")[0], reliability: s.reliability, fill: `hsl(${s.reliability > 95 ? 152 : s.reliability > 90 ? 188 : 28} 80% 55%)` }));

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--neon-magenta))", "hsl(var(--neon-lime))", "hsl(var(--neon-violet))", "hsl(var(--info))"];

  const alerts = [
    ...components.filter((c) => c.currentStock < c.stockMin).slice(0, 3).map((c) => ({
      tone: "danger" as const, icon: AlertTriangle, title: `${c.name} sous seuil critique`, sub: `${c.currentStock}/${c.stockMin} u — réappro requise`,
    })),
    ...jobs.filter((j) => j.status === "blocked").slice(0, 2).map((j) => ({
      tone: "warning" as const, icon: Clock, title: `Job ${j.id} bloqué`, sub: `Manque ${j.blockedBy?.[0] ?? "composant"}`,
    })),
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Cockpit Supply Chain
            <StatusBadge tone="success" pulse>LIVE</StatusBadge>
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            T+0 · Recherche Opérationnelle active · Dernière optimisation il y a 4 min
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <KpiCard label="Commandes" value={stats.total} icon={Package} tone="primary" delta={12.4} sparkline={[3,5,4,7,6,8,9]} />
        <KpiCard label="OTD" value={stats.otd} unit="%" icon={CheckCircle2} tone="success" delta={2.1} sparkline={[88,90,89,92,91,93,stats.otd]} description="On-Time Delivery" />
        <KpiCard label="En retard" value={stats.late} icon={AlertTriangle} tone="destructive" delta={-8} sparkline={[7,6,5,4,5,4,stats.late]} />
        <KpiCard label="En production" value={stats.inProd} icon={Factory} tone="accent" delta={5.6} sparkline={[4,5,6,5,7,6,stats.inProd]} />
        <KpiCard label="Stocks bas" value={stats.lowStock} icon={Boxes} tone="warning" sparkline={[2,3,2,4,3,3,stats.lowStock]} />
        <KpiCard label="Valeur carnet" value={`${(stats.value/1_000_000).toFixed(1)}`} unit="M€" icon={TrendingUp} tone="primary" delta={7.8} sparkline={[1.2,1.4,1.5,1.7,1.8,2.0,2.2]} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Flux commandes (14 jours)" subtitle="Volume & valeur cumulés" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={ordersByDay}>
              <defs>
                <linearGradient id="grad-cmd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-val" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="commandes" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#grad-cmd)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Répartition CA par famille" subtitle={`${familyData.length} familles produits`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={familyData}
                cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                paddingAngle={3} dataKey="value"
              >
                {familyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v: number) => `${(v/1000).toFixed(0)}k€`} />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Fiabilité fournisseurs" subtitle="% de livraisons à l'heure">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart data={reliabilityData} innerRadius="20%" outerRadius="100%" startAngle={180} endAngle={0}>
              <RadialBar dataKey="reliability" cornerRadius={4} background={{ fill: "hsl(var(--muted))" }} />
              <Tooltip {...tooltipStyle} />
            </RadialBarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Charge des lignes (h/jour)" subtitle="Capacité vs allocation">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[
              { line: "ASM-A", capacity: 16, used: 14.2 },
              { line: "ASM-B", capacity: 16, used: 11.8 },
              { line: "PRC-1", capacity: 8, used: 7.6 },
              { line: "PKG-1", capacity: 24, used: 18.4 },
            ]}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
              <XAxis dataKey="line" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="capacity" fill="hsl(var(--muted))" radius={[4,4,0,0]} />
              <Bar dataKey="used" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="🔔 Alertes critiques" subtitle={`${alerts.length} actives`}>
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {alerts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-2 p-2.5 rounded-md border ${
                  a.tone === "danger" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"
                }`}
              >
                <a.icon className={`w-4 h-4 mt-0.5 shrink-0 ${a.tone === "danger" ? "text-destructive" : "text-warning"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                  <p className="text-[10px] font-mono text-muted-foreground truncate">{a.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Bottom: live activity */}
      <Panel title="Flux d'activité temps réel" subtitle="Événements OR-Engine">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: "Livraison reçue", val: "CMP-A1 ×120", time: "il y a 2 min", tone: "success" as const },
            { icon: Activity, label: "Ré-optimisation", val: "Δ -3.2h", time: "il y a 4 min", tone: "primary" as const },
            { icon: Factory, label: "Job lancé", val: "JOB-0014", time: "il y a 8 min", tone: "info" as const },
            { icon: AlertTriangle, label: "Seuil franchi", val: "CMP-B1", time: "il y a 12 min", tone: "warning" as const },
          ].map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border hover:border-primary/30 transition-colors"
            >
              <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                e.tone === "success" ? "bg-success/15 text-success" :
                e.tone === "primary" ? "bg-primary/15 text-primary" :
                e.tone === "info" ? "bg-info/15 text-info" : "bg-warning/15 text-warning"
              }`}>
                <e.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{e.label}</p>
                <p className="text-sm font-mono font-semibold text-foreground truncate">{e.val}</p>
                <p className="text-[10px] text-muted-foreground/70">{e.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
