import { useState } from "react";
import { Panel } from "@/components/shared/Panel";
import { KpiCard } from "@/components/shared/KpiCard";
import { Slider } from "@/components/ui/slider";
import { Sliders, Zap, CheckCircle2, GitBranch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type ObjectiveKey = "cost" | "time" | "reliability" | "risk-weighted";

export default function OptimCenter() {
  const [objective, setObjective] = useState<ObjectiveKey>("cost");
  const [weights, setWeights] = useState({ cost: 60, time: 20, risk: 20 });
  const [capacity, setCapacity] = useState([85]);
  const [maxRisk, setMaxRisk] = useState([60]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);

  const run = () => {
    setRunning(true); setSolved(false); setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setRunning(false); setSolved(true);
          toast.success("Optimization converged", { description: "Gap 0.02% · 1,420 vars · 980 constraints" });
          return 100;
        }
        return p + 4;
      });
    }, 60);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Variables" value="1,420" icon={GitBranch} tone="primary" />
        <KpiCard label="Constraints" value="980" icon={Sliders} tone="primary" />
        <KpiCard label="Last Solve" value="12.4" unit="s" icon={Zap} tone="success" />
        <KpiCard label="Gap" value="0.02" unit="%" icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Config */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Panel title="Objective Function" subtitle="Choose primary goal">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {([
                { k: "cost", label: "Min Cost", desc: "Min $ total" },
                { k: "time", label: "Min Time", desc: "Min transit days" },
                { k: "reliability", label: "Max Reliability", desc: "Max OTA %" },
                { k: "risk-weighted", label: "Risk-Weighted Profit", desc: "EV − λ·Var" },
              ] as { k: ObjectiveKey; label: string; desc: string }[]).map((o) => {
                const sel = objective === o.k;
                return (
                  <button key={o.k} onClick={() => setObjective(o.k)}
                    className={`p-3 rounded border text-left transition-all ${sel ? "bg-primary/15 border-primary text-primary" : "bg-muted/20 border-border hover:border-primary/40"}`}>
                    <div className="text-xs font-mono font-bold">{o.label}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">{o.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Multi-criteria weights */}
            {objective === "risk-weighted" && (
              <div className="mt-4 space-y-3">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Multi-Criteria Weights (sum = 100)</div>
                {(["cost", "time", "risk"] as const).map((k) => (
                  <div key={k}>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="uppercase text-muted-foreground">{k}</span>
                      <span className="text-primary font-bold">{weights[k]}%</span>
                    </div>
                    <Slider value={[weights[k]]} onValueChange={(v) => setWeights({ ...weights, [k]: v[0] })} min={0} max={100} step={5} />
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Constraints">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-2">
                  <span className="uppercase text-muted-foreground">Min vessel utilization</span>
                  <span className="text-primary font-bold">{capacity[0]}%</span>
                </div>
                <Slider value={capacity} onValueChange={setCapacity} min={50} max={100} step={5} />
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-2">
                  <span className="uppercase text-muted-foreground">Max accepted risk score</span>
                  <span className="text-warning font-bold">{maxRisk[0]}/100</span>
                </div>
                <Slider value={maxRisk} onValueChange={setMaxRisk} min={20} max={100} step={5} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { l: "ETS compliance", on: true },
                  { l: "Reefer power slots", on: true },
                  { l: "IMDG segregation", on: true },
                  { l: "Crew rest hours", on: false },
                ].map((c) => (
                  <div key={c.l} className={`flex items-center gap-2 p-2 rounded text-[11px] font-mono ${c.on ? "bg-success/10 border border-success/30 text-success" : "bg-muted/20 border border-border text-muted-foreground"}`}>
                    <CheckCircle2 className="w-3 h-3" /> {c.l}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* Run + result */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Panel title="Run Solver" subtitle="MILP · Branch & Cut">
            <button onClick={run} disabled={running}
              className="w-full py-3 rounded bg-gradient-to-r from-primary to-info text-primary-foreground font-mono uppercase text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              {running ? "Solving…" : solved ? "Re-Run Optimization" : "Run Optimization"}
            </button>

            {(running || solved) && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-primary tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 bg-muted/40 rounded overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-primary to-info" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  {progress < 30 ? "Building model…" : progress < 60 ? "LP relaxation…" : progress < 90 ? "Branch & cut…" : "Polishing solution…"}
                </div>
              </div>
            )}
          </Panel>

          <AnimatePresence>
            {solved && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Panel title="Recommended Plan" subtitle="vs Baseline">
                  <div className="space-y-3">
                    {[
                      { l: "Total Cost", base: 12.4, opt: 11.8, unit: "M$", color: "success" },
                      { l: "Avg Transit", base: 21.4, opt: 20.1, unit: "d", color: "success" },
                      { l: "On-Time %", base: 84.2, opt: 88.6, unit: "%", color: "success" },
                      { l: "Risk Score", base: 42.6, opt: 34.1, unit: "/100", color: "success" },
                    ].map((m) => (
                      <div key={m.l} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-border">
                        <div className="text-[11px] font-mono uppercase text-muted-foreground">{m.l}</div>
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-muted-foreground line-through">{m.base}{m.unit}</span>
                          <span className={`font-bold text-${m.color}`}>→ {m.opt}{m.unit}</span>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 rounded bg-primary/10 border border-primary/30">
                      <div className="text-[10px] font-mono uppercase text-primary">Confidence · Sensitivity</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-muted/40 rounded overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "92%" }} />
                        </div>
                        <span className="text-xs font-mono text-primary">92%</span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-1">
                        Stable for ±10% demand · ±15% bunker price
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
