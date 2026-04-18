import { useState } from "react";
import { Panel } from "@/components/shared/Panel";
import { KpiCard } from "@/components/shared/KpiCard";
import { routes, riskZones } from "@/data/maritimeData";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";

export default function Risk() {
  const [weather, setWeather] = useState([50]);
  const [geo, setGeo] = useState([60]);
  const [piracy, setPiracy] = useState([40]);
  const [running, setRunning] = useState(false);

  // Mock Monte Carlo: 200 trajectories
  const runMC = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 1400);
  };

  const baseline = (weather[0] + geo[0] + piracy[0]) / 3;
  // Generate distribution
  const dist = Array.from({ length: 60 }, (_, i) => {
    const day = i + 1;
    const meanCost = 100 + day * 1.4 + baseline * 0.6;
    const p10 = meanCost - 25 - baseline * 0.2;
    const p50 = meanCost;
    const p90 = meanCost + 30 + baseline * 0.5;
    return { day, p10, p50, p90 };
  });

  // Per-route risk scoring
  const routeRisk = routes.map((r) => ({
    ...r,
    adj: Math.min(100, r.weatherRisk * weather[0] / 50 * 0.35 + r.geoRisk * geo[0] / 50 * 0.4 + r.piracyRisk * piracy[0] / 50 * 0.25),
  })).sort((a, b) => b.adj - a.adj);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active Risks" value={riskZones.length} icon={ShieldAlert} tone="warning" />
        <KpiCard label="Critical Zones" value={riskZones.filter((z) => z.severity === "critical").length} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Mean Risk" value={baseline.toFixed(0)} unit="/100" icon={Activity} tone="warning" sparkline={[42,45,48,50,52,55,baseline]} />
        <KpiCard label="Insurance +" value="+38" unit="%" delta={12} icon={TrendingUp} tone="destructive" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sliders */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Risk Drivers · Adjust" subtitle="Probabilities for next 30d">
            <div className="space-y-5">
              {[
                { k: "Weather severity", val: weather, set: setWeather, color: "info" },
                { k: "Geopolitical tension", val: geo, set: setGeo, color: "destructive" },
                { k: "Piracy probability", val: piracy, set: setPiracy, color: "warning" },
              ].map((d) => (
                <div key={d.k}>
                  <div className="flex justify-between text-[11px] font-mono mb-2">
                    <span className="uppercase text-muted-foreground">{d.k}</span>
                    <span className={`font-bold text-${d.color}`}>{d.val[0]}%</span>
                  </div>
                  <Slider value={d.val} onValueChange={d.set} min={0} max={100} step={1} />
                </div>
              ))}
            </div>
            <button onClick={runMC} disabled={running}
              className="w-full mt-5 py-2 rounded bg-primary/15 border border-primary/40 hover:bg-primary/25 text-primary text-xs font-mono uppercase disabled:opacity-50 transition-colors">
              {running ? "Running 1,000 MC trials…" : "Run Monte Carlo Simulation"}
            </button>
          </Panel>

          <Panel title="Top Risky Routes" subtitle="Adjusted score">
            <div className="space-y-2">
              {routeRisk.slice(0, 5).map((r) => (
                <div key={r.id} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-foreground truncate">{r.name}</span>
                    <span className={r.adj > 60 ? "text-destructive" : r.adj > 35 ? "text-warning" : "text-success"}>{r.adj.toFixed(0)}</span>
                  </div>
                  <div className="h-1.5 bg-muted/40 rounded overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.adj}%` }} transition={{ duration: 0.6 }}
                      className={r.adj > 60 ? "bg-destructive" : r.adj > 35 ? "bg-warning" : "bg-success"} style={{ height: "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* MC Simulation */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Monte Carlo · Cost Distribution" subtitle="P10 / P50 / P90 over 60 days">
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={dist}>
                  <defs>
                    <linearGradient id="gp90" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontFamily: "JetBrains Mono", fontSize: 11 }} />
                  <Area type="monotone" dataKey="p90" stroke="hsl(var(--destructive))" fill="url(#gp90)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="p50" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="p10" stroke="hsl(var(--success))" fill="hsl(var(--success)/0.1)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <Stat label="P10 (best)" value={`${dist[dist.length-1].p10.toFixed(0)} k$`} color="success" />
              <Stat label="P50 (median)" value={`${dist[dist.length-1].p50.toFixed(0)} k$`} color="primary" />
              <Stat label="P90 (worst)" value={`${dist[dist.length-1].p90.toFixed(0)} k$`} color="destructive" />
            </div>
          </Panel>

          <Panel title="Scenario Comparison · Safe vs Risky-Short" subtitle="Side-by-side decision">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-success/5 border border-success/30">
                <div className="text-[10px] font-mono uppercase text-success">Safe Route (Cape)</div>
                <div className="text-2xl font-mono font-bold text-foreground mt-1">46d <span className="text-xs text-muted-foreground">transit</span></div>
                <div className="space-y-1 mt-2 text-[11px] font-mono">
                  <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="text-foreground">$1.84M</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Risk score</span><span className="text-success">38/100</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Reliability</span><span className="text-success">94%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CO₂</span><span className="text-warning">+18%</span></div>
                </div>
              </div>
              <div className="p-3 rounded bg-destructive/5 border border-destructive/30">
                <div className="text-[10px] font-mono uppercase text-destructive">Risky-Short (Suez)</div>
                <div className="text-2xl font-mono font-bold text-foreground mt-1">38d <span className="text-xs text-muted-foreground">transit</span></div>
                <div className="space-y-1 mt-2 text-[11px] font-mono">
                  <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="text-foreground">$1.62M</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Risk score</span><span className="text-destructive">72/100</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Reliability</span><span className="text-warning">71%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span className="text-destructive">+480%</span></div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-2 rounded bg-primary/10 border border-primary/30 text-xs font-mono text-primary">
              💡 Recommended: <span className="font-bold">Safe Route</span> — Risk-adjusted EV +$340k vs Risky-Short.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-2 rounded bg-muted/30 border border-border">
      <div className="text-[10px] font-mono uppercase text-muted-foreground">{label}</div>
      <div className={`text-lg font-mono font-bold text-${color}`}>{value}</div>
    </div>
  );
}
