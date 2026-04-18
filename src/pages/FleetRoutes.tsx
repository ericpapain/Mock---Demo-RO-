import { useState } from "react";
import { Panel } from "@/components/shared/Panel";
import { KpiCard } from "@/components/shared/KpiCard";
import { vessels, routes, ports } from "@/data/maritimeData";
import { Ship, Fuel, Gauge, Anchor, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function FleetRoutes() {
  const [selectedVessel, setSelectedVessel] = useState<string | null>(vessels[0].id);
  const [speed, setSpeed] = useState([18]);
  const [optimRunning, setOptimRunning] = useState(false);

  const v = vessels.find((x) => x.id === selectedVessel)!;
  const route = routes.find((r) => r.id === v.routeId)!;

  const fuelGain = ((18 - speed[0]) * 4.2).toFixed(1);
  const timeImpact = ((18 - speed[0]) * -1.2).toFixed(1);

  const runOptim = () => {
    setOptimRunning(true);
    toast.info("Re-optimizing fleet rotations…", { description: "Solving MILP · 248 vars · 192 constraints" });
    setTimeout(() => {
      setOptimRunning(false);
      toast.success("Optimization complete", { description: "Saved 4.8% fuel · +2.1pt OTA · 3 routes adjusted" });
    }, 2200);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Active Fleet" value={vessels.length} icon={Ship} tone="primary" />
        <KpiCard label="Avg Speed" value="16.4" unit="kn" delta={-1.2} icon={Gauge} tone="success" />
        <KpiCard label="Bunker Cost" value="612" unit="$/T" icon={Fuel} tone="warning" />
        <KpiCard label="In Port" value={vessels.filter((v) => v.status === "In Port").length} icon={Anchor} tone="default" />
        <KpiCard label="Avg Util" value={Math.round(vessels.reduce((s,v) => s+v.utilization,0)/vessels.length)} unit="%" icon={Gauge} tone="primary" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Vessel list */}
        <div className="col-span-12 lg:col-span-4">
          <Panel title="Fleet Roster" subtitle={`${vessels.length} vessels`}>
            <div className="max-h-[640px] overflow-y-auto -mx-4">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card z-10">
                  <tr className="text-[10px] font-mono uppercase text-muted-foreground border-b border-border">
                    <th className="text-left px-3 py-2">Vessel</th>
                    <th className="text-right px-3 py-2">TEU</th>
                    <th className="text-right px-3 py-2">Util</th>
                    <th className="text-left px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.map((vs) => {
                    const isSel = vs.id === selectedVessel;
                    const stColor = vs.status === "At Sea" ? "text-primary" : vs.status === "In Port" ? "text-success" : vs.status === "Anchored" ? "text-warning" : "text-destructive";
                    return (
                      <tr key={vs.id}
                        onClick={() => setSelectedVessel(vs.id)}
                        className={`cursor-pointer border-b border-border/50 hover:bg-muted/30 ${isSel ? "bg-primary/10" : ""}`}>
                        <td className="px-3 py-2">
                          <div className="font-mono font-semibold text-foreground truncate max-w-[140px]">{vs.name}</div>
                          <div className="text-[9px] font-mono text-muted-foreground">{vs.type} · {vs.flag}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground">{(vs.capacityTEU/1000).toFixed(1)}k</td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums">
                          <span className={vs.utilization > 85 ? "text-success" : vs.utilization > 70 ? "text-primary" : "text-warning"}>{vs.utilization}%</span>
                        </td>
                        <td className={`px-3 py-2 font-mono text-[10px] ${stColor}`}>{vs.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Vessel details + Gantt */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel
            title={`Vessel · ${v.name}`}
            subtitle={`${v.imo} · ${v.type} · Flag ${v.flag}`}
            actions={
              <button onClick={runOptim} disabled={optimRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/15 border border-primary/40 hover:bg-primary/25 transition-colors text-primary text-[11px] font-mono uppercase disabled:opacity-50">
                <Zap className="w-3 h-3" />
                {optimRunning ? "Solving…" : "Re-Optimize"}
              </button>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Capacity</div>
                <div className="text-lg font-mono font-bold text-primary">{v.capacityTEU.toLocaleString()} <span className="text-xs text-muted-foreground">TEU</span></div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Utilization</div>
                <div className="text-lg font-mono font-bold text-success">{v.utilization}%</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Route</div>
                <div className="text-lg font-mono font-bold text-foreground">{route.id}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Fuel</div>
                <div className="text-lg font-mono font-bold text-warning">{v.fuelTPD} <span className="text-xs text-muted-foreground">T/d</span></div>
              </div>
            </div>

            {/* Speed slider */}
            <div className="p-3 rounded bg-muted/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Speed Optimization · Slow Steaming</div>
                <div className="text-2xl font-mono font-bold text-primary tabular-nums">{speed[0]} <span className="text-xs text-muted-foreground">kn</span></div>
              </div>
              <Slider value={speed} onValueChange={setSpeed} min={10} max={24} step={0.5} />
              <div className="grid grid-cols-3 gap-3 text-[10px] font-mono">
                <div className="p-2 rounded bg-success/10 border border-success/30">
                  <div className="text-success uppercase">Fuel impact</div>
                  <div className="text-base font-bold text-success tabular-nums">{Number(fuelGain) > 0 ? "−" : "+"}{Math.abs(Number(fuelGain))}%</div>
                </div>
                <div className="p-2 rounded bg-warning/10 border border-warning/30">
                  <div className="text-warning uppercase">Transit impact</div>
                  <div className="text-base font-bold text-warning tabular-nums">{Number(timeImpact) > 0 ? "+" : ""}{timeImpact}d</div>
                </div>
                <div className="p-2 rounded bg-info/10 border border-info/30">
                  <div className="text-info uppercase">CO₂ saved</div>
                  <div className="text-base font-bold text-info tabular-nums">{(Number(fuelGain) * 3.1).toFixed(0)}T/leg</div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Gantt rotations */}
          <Panel title="Rotation Schedule · Next 60 days" subtitle="Drag to reschedule (mock)">
            <div className="space-y-1 overflow-x-auto">
              <div className="flex text-[9px] font-mono text-muted-foreground border-b border-border pb-1 min-w-[700px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 text-center">D+{i*5}</div>
                ))}
              </div>
              {vessels.slice(0, 10).map((vs, idx) => {
                const r = routes.find((rt) => rt.id === vs.routeId)!;
                return (
                  <div key={vs.id} className="flex items-center gap-2 group min-w-[700px]">
                    <div className="w-32 text-[10px] font-mono text-foreground truncate shrink-0">{vs.name}</div>
                    <div className="flex-1 relative h-6 bg-muted/30 rounded">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.durationDays / 60) * 100}%`, x: `${(idx * 6) % 30}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className={`absolute top-0 h-full rounded cursor-grab hover:opacity-80 ${
                          r.riskScore > 60 ? "bg-destructive/60" : r.riskScore > 35 ? "bg-warning/60" : "bg-primary/60"
                        }`}
                        title={`${r.name} · ${r.durationDays}d`}
                      >
                        <div className="absolute inset-0 flex items-center px-2 text-[9px] font-mono text-foreground truncate">{r.id} · {r.durationDays}d</div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      {/* Scenario comparison */}
      <Panel title="Scenario Comparison · Baseline vs Optimized" subtitle="3 KPIs side-by-side">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Cost", base: 12.4, opt: 11.8, unit: "M$" , better: "lower" },
            { label: "On-Time %", base: 84.2, opt: 87.5, unit: "%", better: "higher" },
            { label: "Risk Exposure", base: 42.6, opt: 31.2, unit: "/100", better: "lower" },
          ].map((m) => {
            const delta = m.opt - m.base;
            const positive = m.better === "lower" ? delta < 0 : delta > 0;
            return (
              <div key={m.label} className="p-3 rounded bg-muted/20 border border-border">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">{m.label}</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <div className="text-xs text-muted-foreground">
                    Base <span className="font-mono text-foreground">{m.base}{m.unit}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-primary">Optim</span> <span className="font-mono font-bold text-primary">{m.opt}{m.unit}</span>
                  </div>
                </div>
                <div className={`text-xs font-mono mt-1 ${positive ? "text-success" : "text-destructive"}`}>
                  {delta > 0 ? "+" : ""}{delta.toFixed(1)}{m.unit} {positive ? "✓ better" : "✗ worse"}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
